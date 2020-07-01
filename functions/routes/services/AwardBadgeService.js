const fire = require('../../FirebaseU/FirebaseUtils');

const axios = require('axios');
const envs = require('../../env.json');
const ISSUER_ID = envs.service.issuer_id;
const APP_URL = envs.service.app_url;

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

const findParents = async(authToken, badgeToken, data) => {
  const temp = await AwardService.listAwards(data, authToken);
  const aws = temp.result;  
  if(aws!==undefined){
    const awardsUser = aws.filter(a => a.recipient.plaintextIdentity === data.email)
    await fire.getPathways().on('value', (snapshot) => {
      Object.values(snapshot.val()).map(path => {
        if(path.children){
          if(getID(path.completionBadge) !== badgeToken)
            findParentAux(badgeToken, path, awardsUser, data);
        } 
      });
    }) 
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
          console.log("PARENT ", path)
          console.log("CHILD ", path.children[i])
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
        console.log("Completed children: ", completedChildren);
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

    console.log("AWARD_RESPONSE", response)
    if(response.status == 201)
      findParents(authToken, data.badgeToken, data);
    return response.data;
  },
  listAwards: async (data, authToken) => {
    let response = await axios({
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      method: 'get',
      url: `/issuers/${ISSUER_ID}/assertions`,
    })
    return response.data;
  }
}

module.exports = AwardService;
