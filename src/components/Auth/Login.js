import React,{ Component} from 'react'
import {logIn} from '../../FirebaseUtils'

export default class LogIn extends Component{
    render(){
        return(
            <div className="App badge-summary jumbotron">
                <h1>Welcome to Badge Claim</h1>
                <button className="btn btn-primary" onClick={() => logIn()}>Log In</button>
            </div>
        )
    }
}