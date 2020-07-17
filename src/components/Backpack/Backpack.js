import React, { Component } from 'react';
import axios from 'axios';
import './Backpack.css'

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
    }

    async validateCredentials(){
        const log = await axios.post(
            `/users`, 
            {
                email: this.state.email, 
                password: this.state.password
            }
        )
        if(log && log!==""){
            this.setState({isAuthenticated: true})
        }
        const badges = await axios.post(
            `/users/backpack`, 
            {
                email: this.state.email
            }
        )
        if(badges && badges!=={}){
            console.log("BADGES: ", badges);
            this.setState({ backpackBadges: badges })            
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
        console.log("State Backpack: ", this.state.backpackBadges);
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
                        <div>
                            {this.state.backpackBadges?
                                this.state.backpackBadges.data.badges.map((badge)=>
                                    <p>{badge.name}</p>
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