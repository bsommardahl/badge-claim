import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from "react-router-dom";
import {getSubscritions, userSubscribe} from '../../../functions/FirebaseU/FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class PathwayCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        var badgeID = getID(this.props.pathway.completionBadge);
        var subscribed = this.props.data.subscribe.includes(badgeID)
        return (
            <div class="col-sm-6">
                <div className="card" style={{marginTop: "15px"}}>
                    <h5 className="card-header">{this.props.pathway.title}</h5>
                    <div className="card-body">
                        <div>
                            {!subscribed ? <button onClick={() => this.props.callSub(badgeID)} 
                                className="btn btn-primary btn-sm">
                                Request Access
                            </button> : <div/>}
                            <Link 
                                style={{marginLeft: !subscribed ? "20px" : ""}} 
                                className="btn btn-primary btn-sm" 
                                to={`/pathway/${badgeID}`}
                            >
                                View
                            </Link>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.subscribe = this.subscribe.bind(this);
        this.state = {pathways: [], subscribe: [], userEmail: "", my_pathways: []};
    }

    async componentDidMount(){
        window.onpopstate  = (e) => {
            window.location.reload();
        }
        let allPathways = [];
        let pathways = require(`../../../pathways/pathwaysIDS.json`);
        const user = localStorage.getItem("email");
        for(let x=0;x<pathways.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathways.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        this.setState({pathways: allPathways, userEmail: user});
        getSubscritions(user).on('value', (snapshot) => {
            try {
                if(snapshot.val()){
                    this.setState({subscribe: snapshot.val()})
                }
            } catch (error) {
                console.log("NO SUBS")
            }
        })
    }

    subscribe(id){
        var sub = this.state.subscribe.filter(s => s != id);
        this.setState({subscribe: sub.concat([id])})   
        userSubscribe(this.state.userEmail, sub.concat([id]))
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
                                        <PathwayCard pathway={pathway} data={this.state} callSub={this.subscribe}/>)
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="my_pathways" title="My Pathways">
                            <div className="row">
                                {!this.state.pathways.length?
                                    <div class="col-sm-12">
                                        <br/>
                                        <span>There are currently no pathways here. Request access to one in Avaliable!</span>
                                    </div>
                                    :
                                    this.state.pathways.map((pathway) =>
                                        this.state.subscribe.includes(getID(pathway.completionBadge)) ?
                                        <PathwayCard pathway={pathway} data={this.state} callSub={this.subscribe}/> : <div/>)
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