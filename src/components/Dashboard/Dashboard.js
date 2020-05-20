import React, { Component } from 'react';
import {
    Link
  } from "react-router-dom";
import axios from 'axios';
import {getPathways, getUserEmail, logOut} from '../../FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1)

const goto = (path) => {document.location.href = path;}

const card = (pathway, userEmail, view) => {
    return (
        <div class="col-sm-6">
            <div className="card">
                <h5 className="card-header">{pathway.title}</h5>
                <div className="card-body">
                    <button onClick={() => subscribe(pathway.title, userEmail, getID(pathway.completionBadge))} 
                        className="btn btn-primary">
                            Request Access
                    </button>
                    <Link style={{marginLeft: "10%"}} className="btn btn-primary" to={`/pathway/${getID(pathway.completionBadge)}`}>View</Link>
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
            console.log(res.data.result[0].issuer);
            issuer = res.data.result[0].issuer;
        })
        .catch(err => {
            console.log(err)
        });
    await axios.get(`/issuer/${issuer}`)
        .then(res => {
            console.log("issuer",res.data.result[0].email);
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

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state = {pathways: [], userEmail: ""};
    }

    componentDidMount(){
        getPathways().once('value', (snapshot) =>
            this.setState({pathways: snapshot.val()})
        );
        getUserEmail().then((user) => this.setState({userEmail: user.email}))
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                <h1>Explore</h1>
                <button className="btn btn-primary" onClick={() => logOut()}>Sign Out</button>
                </div>
                <div className="dashboard row">
                    {this.state.pathways.map((pathway) => card(pathway, this.state.userEmail, this.props.viewPathway))}
                </div>
            </div>
        )
    }
}

export default Dashboard