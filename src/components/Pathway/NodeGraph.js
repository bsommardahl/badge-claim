import * as d3 from 'd3'
import axios from 'axios';
import $ from 'jquery';

var Y_OFFSET = [];
var LANES = 0;
var PATHWAYOBJ = new Object();
var ID = 0;

///TREE FUNCTIONS

function treeDeep(obj) {
  var h = 0;
  var heights = [];

  if(obj.children){
    for (let index = 0; index < obj.children.length; index++) {
      heights.push(treeDeep(obj.children[index]));
    }

    h = Math.max(...heights);
  }
  return h + 1;
}

function down2Up(obj, email, awarded) {
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

  PATHWAYOBJ["nodes"].push(node)
  renderGraph(PATHWAYOBJ, email);
  $("h1").html(obj.title + " Pathway");
}

function down2Up_aux(level, obj, xdes, ydes, iddes) {
  let myY = getY(false);
  var id = ID;
  ID++;
  
  if(obj.children){
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
  link["xori"]= xori;
  link["yori"]= yori;
  link["xdes"]= xdes;
  link["ydes"]= ydes;
  PATHWAYOBJ["links"].push(link);

  var node = {};
  node["id"] = id;
  node["name"] = obj.title;
  node["y"] = myY * 75;
  node["x"] = (level-1) * 300;
  node["isComplete"] = obj.completionBadge ? true : false;
  node["url"] = obj.completionBadge ? obj.completionBadge : obj.requiredBadge;
  
  PATHWAYOBJ["nodes"].push(node);
}

function getY(end){
  var pos = Y_OFFSET[0];
  //for (let index = 0; index < lvl; index++) {
  if(end)
    Y_OFFSET[0] += 1;
  //}
  return pos;
}

function evaluateObj(obj) {
  return (new Function(` return  ${obj.split("=")[1]}` ));
}

const getAwarded = async(email) => {
  var resp = null;

  await axios({
      method: 'get',
      url: `/award`,
  })
  .then(res => {
    resp = res.data.result.filter(a => a.recipient.plaintextIdentity ===  email);
  })
  .catch(err => {
    console.log(err);
  });

  return resp;
}

export function createPathway(pathway, email, awarded) {
  
  down2Up(pathway, email, awarded);

}

function getJSCode(url) {
  var settings = {
    "url": url,
    "method": "GET",
    "timeout": 0,
  };

  return $.ajax(settings);
}

const isAwarded = async(data, id) => {
  return data.filter(a => a.entityId === id).length;
}

function findEarned(badge, awards) {
    var partbadge = String(badge.url).split('/');
    var badgeId = partbadge[partbadge.length-1];
    return awards.filter(a => a.badgeclass === badgeId).length > 0
}

async function renderGraph(data, email) {
  var dataAward = await getAwarded(email);
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = (LANES*300) - margin.left - margin.right,
      height = (Y_OFFSET[0]*75) - margin.top - margin.bottom;

  var svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("opacity", 0)
      .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

  var link = svg
      .selectAll("path")
      .data(data.links)
      .enter()
      .append("path")
      .style("stroke", "#aaa")
      .style("stroke-width", "4")
      .attr("fill", "none");
  
  var node = svg
      .selectAll("rect")
      .data(data.nodes)
      .enter()
      .append("rect")
      .attr("width", 200)
      .attr("height", 50)
      .attr("stroke-width", "3")
      .attr("stroke", "#535dc8")
      .attr("fill", "white")
      .on("click", handleClick);

  var text = svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text(function(d){return d.name}).
      attr("fill", "#535dc8");

  const ticked = () => {
      node
        .attr("x", function (d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("stroke", function(d) { return findEarned(d, dataAward) ? "#13bf00" : d.isComplete ? "#ffdd00" : "#535dc8" });
      text
        .attr("x", function (d) { return d.x+10; })
        .attr("y", function(d) { return d.y+20; })
        .attr("fill", function(d) { return findEarned(d, dataAward) ? "#13bf00" : d.isComplete ? "#ffdd00" : "#535dc8" });
      link.attr("d", function(d) {
        var half = d.xori + (d.xdes - d.xori)/2
        return "M" + 
            d.xori + "," + d.yori + 
            " L " + half + "," + d.yori +
            " L " + half + "," + d.ydes +
            " L " + d.xdes + "," + d.ydes;
      });
      $("div.progress-bar").css("display", "none");
      $("div.legend").css("display", "inline-block");
      svg.attr("opacity", 1);
  }

  function handleClick(d) {
    if(d.url)
      window.location = d.url;
  }
  
  var simulation = d3.forceSimulation(data.nodes).on("end", ticked);
}