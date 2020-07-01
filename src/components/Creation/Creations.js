import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {getDrafts, getID, deleteDraft, getUserEmail, getAdmins} from '../../../functions/FirebaseU/FirebaseUtils'
import '../Dashboard/Dashboard.css'

const card = (pathway, subscribed) => {
    var badgeID = getID(pathway.completionBadge);
    return (
        <div class="col-sm-6">
            <div className="card" style={{marginTop: "15px"}}>
                <h5 className="card-header">{pathway.title}</h5>
                <div className="card-body">
                    <div>
                        <Link className="btn btn-primary" to={`/drafts/${badgeID}`}>Edit</Link>
                        <button onClick={()=>deleteDraft(badgeID)} style={{marginLeft: !subscribed ? "20px" : ""}} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

class Creations extends Component{
    badges = 0;
    constructor(props){
        super(props);
        this.state = {pathways: [], userEmail: "", my_pathways: [], progress: {}, badgesCount: {}};
    }

    async componentDidMount(){
        const user = await getUserEmail();
        getAdmins().on('value', (snapshot) => {
            if(!snapshot.val().includes(user.email)){
                alert("You don't have permission to be here")
                document.location.href = '/explore';
            }
        })

        getDrafts().on('value', (snapshot) =>
            {
                this.setState({pathways: Object.values(snapshot.val())});
            }
        );
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                    <h1>Creation</h1>
                    <Link className="btn btn-primary" to={`/drafts`}>Create Pathway</Link>
                </div>
                <div className="body-app">
                    <div className="row">
                        {this.state.pathways.map((pathway) => card(pathway, this.state.userEmail, false))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Creations