import React, { Component } from 'react';
import {
    Link
  } from "react-router-dom";
import axios from 'axios';
import {getPathways, getUserEmail, logOut} from '../../FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

const card = (pathway, userEmail, view, state) => {
    var badgeID = getID(pathway.completionBadge);
    var percent = state.progress[badgeID] 
        /state.badgesCount[badgeID] * 100;
    return (
        <div class="col-sm-6">
            <div className="card">
                <h5 className="card-header">{pathway.title}</h5>
                <div className="card-body">
                    <div>
                        <button onClick={() => subscribe(pathway.title, userEmail, getID(pathway.completionBadge))} 
                            className="btn btn-primary"
                        >
                            Request Access
                        </button>
                        <Link style={{marginLeft: "10%"}} className="btn btn-primary" to={`/pathway/${badgeID}`}>View</Link>
                    </div>
                    <div id="myProgress">
                        <div id="myBar" 
                            style={{width: `${percent}%`}}>{percent ? `${Math.floor(percent)}%` : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const subscribe = async(name, from, id) =>{
    var to = "";
    var issuer = "";

    await axios
        .get(`/badges/${id}`)
        .then(res => {
            issuer = res.data.result[0].issuer;
        })
        .catch(err => {
            console.log(err)
        });
    await axios.get(`/issuer/${issuer}`)
        .then(res => {
            to = res.data.result[0].email;
        })
        .catch(err => {
            console.log(err)
        })
    axios.post(`/v2/pathways/${id}/subscribe`, {
            to: to,
            from: from,
            pathway: name
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
}

const getAwarded = async(email) =>{
    var resp = null;

    await axios({
        method: 'get',
        url: `/award/user`,
        data: {
          body: {
            email: email
          }
        }
    })
    .then(res => {
      resp = res.data;
      console.log(resp)
    })
    .catch(err => {
      console.log(err);
    });

    return resp;
}

const isAwarded = (awards, id) => {
    return awards.filter(a => a.entityId === id).length
}

class Dashboard extends Component{
    badges = 0;
    constructor(props){
        super(props);
        this.getAwards = this.getAwards.bind(this);
        this.getAwards_aux = this.getAwards_aux.bind(this);
        this.state = {pathways: [], userEmail: "", progress: {}, badgesCount: {}};
    }

    getAwards = async(obj, email) => {
        var hello = await getAwarded(email);
        var progress = {}
        var badgesCount = {}
        for (let index = 0; index < obj.length; index++) {
            this.badges = 1;
            //console.log("pathway", obj[index].title, obj[index]);
            //console.log("isAwarded", isAwarded(hello, getID(obj[index].requiredBadge ? obj[index].requiredBadge : obj[index].completionBadge)))
            var id = getID(obj[index].requiredBadge ? obj[index].requiredBadge : obj[index].completionBadge);
            var counter = isAwarded(hello, id);
            for (let index1 = 0; index1 < obj[index].children.length; index1++) {
                //console.log (obj[index].children[index1]);
                counter += this.getAwards_aux(obj[index].children[index1], hello);
                if(obj[index].children[index1].completionBadge || obj[index].children[index1].requiredBadge)
                    this.badges++;
            }
            progress[id] = counter;
            badgesCount[id] = this.badges;
        }

        console.log(progress);
        console.log(badgesCount);
        this.setState({progress: progress})
        this.setState({badgesCount: badgesCount})
    }
      
    getAwards_aux = (obj, hello) => {
        var counter = 0
        if(obj.children){
            //console.log(obj, "obj");
            //console.log("sub pathway", obj.title);
            for (let index = 0; index < obj.children.length; index++) {
                //console.log("child", obj.children[index].title, getID(obj.children[index].requiredBadge 
                //    ? obj.children[index].requiredBadge : obj.children[index].completionBadge ? obj.children[index].completionBadge : ""));
                counter += isAwarded(hello,
                    getID(obj.children[index].requiredBadge 
                        ? obj.children[index].requiredBadge : obj.children[index].completionBadge ? obj.children[index].completionBadge : ""));
                if(obj.children[index].requiredBadge || obj.children[index].completionBadge)
                        this.badges++;
                this.getAwards_aux(obj.children[index], hello);
            }
        }

        return counter;
    }

    componentDidMount(){
        getPathways().once('value', (snapshot) =>
            {
                this.setState({pathways: Object.values(snapshot.val())});
                getUserEmail().then((user) => {
                    this.setState({userEmail: user.email})
                    this.getAwards(this.state.pathways, user.email);
                })
               
            }
        );
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                <h1>Explore</h1>
                </div>
                <div className="row body-app">
                    {this.state.pathways.map((pathway) => card(pathway, this.state.userEmail, this.props.viewPathway, this.state))}
                </div>
            </div>
        )
    }
}

export default Dashboard