import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Backpack.css'
import { getUserEmail, saveBackpackToken, getTokenData } from '../../../functions/FirebaseU/FirebaseUtils';

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class BackpackBadge extends Component{
    constructor(props){
        super(props);
    }

    render(){
        var badgeID = getID(this.props.badge.entityId);
        return (
            <div class="col-sm-6">
                <div className="card" style={{marginTop: "15px"}}>
                    <div className="card-header row">
                        <img className="badge-image container-fluid" src={this.props.badge.image} alt="This is a badge"/>
                        <h4>{this.props.badge.name}</h4>
                    </div>
                    <div className="card-body">

                        <p>{this.props.badge.description}</p>
                        <div>
                            <Link 
                                className="btn btn-primary btn-sm" 
                                to={`/badges/${badgeID}`}
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

class Backpack extends Component{
    constructor(props){
        super(props);
        this.state={
            isAuthenticated: false,
            email: "",
            password: "",
            backpackBadges: null
        }
        this.validateCredentials = this.validateCredentials.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.postMount = this.postMount.bind(this);
    }

    async validateCredentials(){
        const log = await axios.post(
            `/users`, 
            {
                email: this.state.email, 
                password: this.state.password
            }
        )
        if(log.data && log.data!=="" && log.data!==undefined){
            const email = await getUserEmail();
            saveBackpackToken(email.email, log.data, this.state.email);
            this.setState({isAuthenticated: true})
        }else{
            alert("Your credentials are incorrect, please type them again");
            window.location.reload();
        }
        const badges = await axios.post(
            `/users/backpack`, 
            {
                email: this.state.email,
                data: log
            }
        )
        if(badges && badges!=={}){
            this.setState({ backpackBadges: badges })            
        }
    }

    async componentDidMount(){
        const email = await getUserEmail()
        this.setState({email: email.email})
        var data;
        getTokenData(email.email, email.email).on('value', (snapshot) => {
            this.postMount(snapshot.val());
        });
    }

    async postMount(token){
        const isLogged = await axios.post(
            `/users/logged`, 
            {
                data: token
            }
        )
        if(isLogged.data===true){ //check is the request is OK
            const badges = await axios.post(
                `/users/backpack`, 
                {
                    token: token.data.access_token
               }
            )
            if(badges && badges!=={}){
                this.setState({ backpackBadges: badges })            
            }
        }else{
            const badges = await axios.post(
                `/users/backpack`, 
                {
                    token: token.data.refresh_token
                }
            )
            if(badges && badges!=={}){
                this.setState({ backpackBadges: badges })            
            }
        }

    }

    onChangeText = (e)=>{
        const {name, value} = e.currentTarget;
        this.setState({
            ...this.state,
            [name]:value,
        });
    }

    render(){
        return(
            <div>
                <div className="badge-summary jumbotron">
                    <h1>Backpack</h1>
                </div>
                <div className="body-app">
                    {!this.state.isAuthenticated?
                        <div className="Credentials">
                            <p>Please enter with your Badgr user to access your Backpack</p>
                            <br/>
                            <input
                                type="text" 
                                name="email"
                                placeholder="email" 
                                onChange={this.onChangeText} 
                                value={this.state.email}
                            />
                            <br/>
                            <input
                                type="password" 
                                name="password"
                                placeholder="password" 
                                onChange={this.onChangeText} 
                                value={this.state.password}
                            />
                            <br/>
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => this.validateCredentials()}
                            >
                                Enter
                            </button>
                        </div>:
                        <div className="row">
                            {this.state.backpackBadges?
                                this.state.backpackBadges.data.badges.map((badge)=>
                                    <BackpackBadge badge={badge}></BackpackBadge>
                                ):
                                <div>
                                    <p>You have no badges or a problem occurred</p>
                                </div>
                            }
                        </div>
                    }   
                </div>
            </div>
        )
    }
}

export default Backpack;