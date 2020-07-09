import $ from 'jquery';

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

var Y_OFFSET = [];
var LANES = 0;
var PATHWAYOBJ = new Object();
var ID = 0;
var tall = 0;

///TREE FUNCTIONS

function treeDeep(obj) {
  var h = 0;
  var heights = [];

  if(obj.children){
    if(obj.children.length>1)
      tall += obj.children.length-1
    for (let index = 0; index < obj.children.length; index++) {
      heights.push(treeDeep(obj.children[index]));
    }

    h = Math.max(...heights);
  }
  return h + 1;
}

function down2Up(obj) {
  var lvls = treeDeep(obj);
  var id = ID;
  ID++;
  Y_OFFSET = new Array(lvls);
  Y_OFFSET.fill(0);
  LANES = lvls;

  PATHWAYOBJ["nodes"] = [];
  PATHWAYOBJ["links"] = [];
  
  if(obj.children){
    for (let index = 0; index < obj.children.length; index++) {
      down2Up_aux(lvls - 1, obj.children[index], (lvls-1) * 300, 25, id);
    }
  }
  var node = {};
  node["id"] = id;
  node["name"] = obj.title;
  node["y"] = 0;
  node["x"] = (lvls-1) * 300;
  node["url"] = obj.completionBadge ? obj.completionBadge : obj.requiredBadge;
  node["isComplete"] = obj.completionBadge ? true : false;
  node["pathwayURL"] = obj.pathwayURL ? obj.pathwayURL : "";

  PATHWAYOBJ["nodes"].push(node)
  $("h1").html(obj.title + " Pathway");
}

function down2Up_aux(level, obj, xdes, ydes, iddes) {
  let myY = getY(false);
  var id = 0;
  var found = PATHWAYOBJ["nodes"].filter(node => node.name === obj.title)
  if(found.length > 0){
    id = found[0].id
  }else{
    id = ID;
    ID++;
  }
  
  if(obj.children && found.length == 0){
    for (let index = 0; index < obj.children.length; index++) {
      down2Up_aux(level - 1, obj.children[index], ((level-1) * 300), (myY * 75) + 25, id);
    }
  }else{
    myY = getY(true)
  }

  var xori = ((level-1) * 300) + 200;
  var yori = (myY * 75) + 25;

  var link = {};
  link["source"]= id;
  link["target"]= iddes;
  if(found.length > 0){
    var foundlink = PATHWAYOBJ["links"].filter(link => link.source === found[0].id)
    link["xori"]= foundlink[0].xori;
    link["yori"]= foundlink[0].yori;
    link["xdes"]= xdes;
    link["ydes"]= ydes;
  }else{
    link["xori"]= xori;
    link["yori"]= yori;
    link["xdes"]= xdes;
    link["ydes"]= ydes;
  }
  PATHWAYOBJ["links"].push(link);

  if(found.length == 0){
    var node = {};
    node["id"] = id;
    node["name"] = obj.title;
    node["y"] = myY * 75;
    node["x"] = (level-1) * 300;
    node["isComplete"] = obj.completionBadge ? true : false;
    node["url"] = obj.completionBadge ? obj.completionBadge : obj.requiredBadge;
    node["pathwayURL"] = obj.pathwayURL ? obj.pathwayURL : "";

    PATHWAYOBJ["nodes"].push(node);
  }
}

function getY(end){
  var pos = Y_OFFSET[0];
  if(end)
    Y_OFFSET[0] += 1;
  return pos;
}

export function createPathway(pathway, pathways) {
  PATHWAYOBJ = {}
  modify(pathway, pathways)
  down2Up(pathway);
  PATHWAYOBJ["lanes"] = LANES;
  PATHWAYOBJ["tall"] = tall+1;
  return PATHWAYOBJ
}

function modify(pathway, pathways){
  if(pathway){
    var newChildren = []
    if(pathway.children){

      for(let index = 0; index < pathway.children.length; index++){
        var newChild = modifyaux(pathway.children[index], pathways)
        if(newChild)
          newChildren.push(newChild)
      }
    }
  }
}

function modifyaux(pathway, pathways){
  var newPathway = pathway;
  if(pathway){
    var newChildren = []
    var oldChildren = []
    if(pathway.pathwayURL && pathway.pathwayURL!==""){
      var childPathway = pathways.filter(path => getID(path.completionBadge) === getID(pathway.pathwayURL))
      if(childPathway.length > 0 && childPathway[0].children){
        if(!newPathway.children){
          newPathway.children = childPathway[0].children;
        } else {
          oldChildren = newPathway.children;
          newPathway.children = childPathway[0].children;
          newPathway = addChildrenAtDeep(oldChildren, newPathway)
        }
      }
    }
    
    if(newPathway.children){
      for(let index = 0; index < newPathway.children.length; index++){
        var newChild = modifyaux(newPathway.children[index], pathways)
        if(newChild)
          newChildren.push(newChild)
      } 
      newPathway.children = newChildren
    }
  }

  return newPathway
}

function addChildrenAtDeep(oldChildren, pathway){
  var newPathway = pathway

  if(newPathway){
    if(newPathway.children && newPathway.children.length>0){
      for(let index = 0; index < newPathway.children.length; index++){
        addChildrenAtDeep_aux(oldChildren, newPathway.children[index])
      }
    }else{
      newPathway["children"] = oldChildren
    }
  }
  
  return newPathway
}

function addChildrenAtDeep_aux(oldChildren, pathway){
  var newPathway = pathway

  if(newPathway){
    if(newPathway.children){
      var newChildren = []
      for(let index = 0; index < newPathway.children.length; index++){
        var child = addChildrenAtDeep_aux(oldChildren, newPathway.children[index])
        if(child)
          newChildren.push(child)
      }
      newPathway["children"] = newChildren
    }else{
      newPathway["children"] = oldChildren
    }
  }
  return newPathway
}
