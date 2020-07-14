const axios = require('axios');
const envs = require('../../env.json');
const ISSUER_ID = envs.service.issuer_id;
const APP_URL = envs.service.app_url;

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

const AWARDS ={}
const ONE_HOUR = 60 * 60 * 1000;
var NO_UPDATE = true;

const findParents = async(authToken, badgeToken, data) => {
  NO_UPDATE = false;
  const temp = await AwardService.listAwards(data, authToken);
  NO_UPDATE = true;
  const aws = temp.result;  
  let allPathways = [];
  let pathways = require(`../../../pathways/pathwaysIDS.json`);
  if(aws!==undefined){
    for(let x=0;x<pathways.pathways_ids.length;x++){
      let path = Object.values(require(`../../../pathways/${pathways.pathways_ids[x]}.json`))
      allPathways.push(path[0]);
      const awardsUser = aws.filter(a => a.recipient.plaintextIdentity === data.email)
      path.map(path => {
        if(path.children){
          if(getID(path.completionBadge) !== badgeToken)
            findParentAux(badgeToken, path, awardsUser, data)
        } 
      });
    }
  }
}

const findParentAux = (badgeToken, path, awardsUser, data) => {
  if(path){
    if(path.children){
      for(let i = 0;  i < path.children.length; i++){
        let childID = '';
        
        if(path.children[i]){
          if(path.children[i].requiredBadge)
            childID = getID(path.children[i].requiredBadge)
          if(path.children[i].completionBadge)
          childID = getID(path.children[i].completionBadge)
        }

        if(childID===badgeToken){
          checkParent(path, awardsUser, data)
        }

        findParentAux(badgeToken, path.children[i], awardsUser, data);
      } 
    }
  }
}

const checkParent = (parent, awardsUser, data) => {
  if(parent && parent.completionBadge && parent.children){
    var completedChildren = 0
    let childID = '';
    
    for(let i = 0;  i < parent.children.length; i++){

      if(parent.children[i]){
        if(parent.children[i].requiredBadge)
          childID = getID(parent.children[i].requiredBadge)
        if(parent.children[i].completionBadge)
        childID = getID(parent.children[i].completionBadge)
      }

      if(awardsUser.filter(a => a.badgeclass === childID).length > 0){
        completedChildren++;
      }
    }

    if(completedChildren == parent.children.length && awardsUser.filter(a => a.badgeclass === getID(parent.completionBadge))){
      postAward(data, parent);
    }
  }
}

const postAward = async(data, parent) => {
  await axios
  .post(
      `${APP_URL}/api/award`, 
      {
          email: data.email,
          authToken: "",
          badgeToken: getID(parent.completionBadge),
          badgeName: parent.title
      }
  )
}

const AwardService = {
  awardBadge: async (data, authToken) => {
    let response = await axios({
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      method: 'post',
      url: `/badgeclasses/${data.badgeToken}/assertions`,
      data: {
        recipient: {
          identity: data.email,
          type: 'email',
          hashed: true
        },
        notify: true
      }
    })

    if(response.status == 201)
      findParents(authToken, data.badgeToken, data);
    return response.data;
  },

  listAwards: async (data, authToken) => {
    var d = new Date(); 
    var time = d.getTime();

    if(AWARDS["list"] && (time - AWARDS["time"]) < ONE_HOUR && NO_UPDATE){
      return AWARDS["list"]
    }

    let response = await axios({
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      method: 'get',
      url: `/issuers/${ISSUER_ID}/assertions`,
    })

    if(response.data){
      AWARDS["list"] = response.data
      AWARDS["time"] = time
    }
    
    return response.data;
  }
}

module.exports = AwardService;
