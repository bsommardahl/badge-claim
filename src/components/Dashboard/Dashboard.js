import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from "react-router-dom";
import axios from 'axios';
import {getPathways, getUserEmail, joinPathway} from '../../FirebaseU/FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

let awardedBadges = 0;

const card = (pathway, userEmail, subscribed, state) => {
    var badgeID = getID(pathway.completionBadge);
    var percent = state.progress[badgeID] / state.badgesCount[badgeID] * 100;
    return (
        <div class="col-sm-6">
            <div className="card" style={{marginTop: "15px"}}>
                <h5 className="card-header">{pathway.title}</h5>
                <div className="card-body">
                    <div>
                        {!subscribed ? <button onClick={() => joinPathway(pathway, userEmail)} 
                            className="btn btn-primary"
                        >
                            Request Access
                        </button> : <div/>}
                        <Link style={{marginLeft: !subscribed ? "20px" : ""}} className="btn btn-primary" to={`/pathway/${badgeID}`}>View</Link>
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

/*const subscribe = async(name, from, id) =>{
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
            console.log("SENT");
          })
          .catch(function (error) {
            console.log(error);
          });
}*/



const getAwarded = async(email) =>{
    var resp = await axios.get(`/award`)
    return resp.data.result.filter(a => a.recipient.plaintextIdentity === email);
}

const isAwarded = (awards, id) => {
    return awards.filter(a => a.badgeclass === id).length > 0 ? 1 : 0;
}

class Dashboard extends Component{
    badges = 0;
    constructor(props){
        super(props);
        this.getAwards = this.getAwards.bind(this);
        this.getAwards_aux = this.getAwards_aux.bind(this);
        this.state = {pathways: [], userEmail: "", my_pathways: [], progress: {}, badgesCount: {}};
    }

    getAwards = async(obj, awarded) => {
        var progress = {}
        var badgesCount = {}

        if(obj){
            var pathways = Object.values(obj);
            for(let i = 0; i < pathways.length; i++){
                var count = {};
                count = this.getAwards_aux(pathways[i], awarded);
                badgesCount[getID(pathways[i].completionBadge)]=count.count + 1
                progress[getID(pathways[i].completionBadge)]=count.progress
            }
        }
        this.setState({progress: progress, badgesCount: badgesCount})
    }
     
    getAwards_aux = (obj, awarded) => {
        let awardCount = 0
        if(obj){
            let objID = getID(obj.completionBadge ? obj.completionBadge : obj.requiredBadge) 
            if(objID){
                awardCount = isAwarded(awarded, objID)
                if(obj.children){
                    let returnObj = {'count': obj.children.length, 'progress': 0}
    
                    for(let j = 0; j <= obj.children.length; j++){
                        returnObj.count += this.getAwards_aux(obj.children[j], awarded).count
                        returnObj.progress += this.getAwards_aux(obj.children[j], awarded).progress
                    }
                    returnObj.progress += awardCount;
                    return returnObj;
                }
            }
        }
        return {'count': 0, 'progress': awardCount};
    }

    async componentDidMount(){
        const user = await getUserEmail();
        const awarded = await getAwarded(user.email);
        getPathways().on('value', (snapshot) =>
            {
                this.setState({pathways: Object.values(snapshot.val()), userEmail: user.email});

                this.getAwards(this.state.pathways, awarded);
                this.setState({my_pathways:
                    this.state.pathways.filter(
                        path => path.users && path.users.includes(user.email)
                    )})
            }
        );
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                <h1>Explore</h1>
                </div>
                <div className="body-app">
                    <Tabs style={{width: "100%"}}>
                        <Tab eventKey="available" title="Available">
                            <div className="row">
                                {!this.state.pathways.length?
                                    <div class="col-sm-6">
                                        <br/>
                                        <span>Loading...</span>
                                    </div>
                                    :
                                    this.state.pathways.map((pathway) => 
                                        card(
                                            pathway, 
                                            this.state.userEmail, 
                                            pathway.users && pathway.users.includes(this.state.userEmail), 
                                            this.state))
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="my_pathways" title="My Pathways">
                            <div className="row">
                                {!this.state.my_pathways.length?
                                    <div class="col-sm-12">
                                        <br/>
                                        <span>There are currently no pathways here. Request access to one in Avaliable!</span>
                                    </div>
                                    :
                                    this.state.my_pathways.map((pathway) => 
                                        card(pathway, this.state.userEmail, true, this.state))
                                }
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Dashboard