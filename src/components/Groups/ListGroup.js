import React from 'react'
import {Link} from 'react-router-dom'
import { getGroups } from '../../../functions/FirebaseU/FirebaseUtils'
import CardGroup from './CardGroup'

class ListGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            groups:[],
        } 
        //this.createNew = this.createNew.bind(this);
    }
        
    componentDidMount(){
        getGroups().on('value', (snapshot) => {
            try {
                if(snapshot.val()){
                    console.log("snapshot",snapshot.val());
                    //this.setState({groups: Object.values(snapshot.val())})
                    this.setState({groups: snapshot.val()})
                    console.log("State groups", this.state.groups);
                }
            } catch (error) {
                console.log("NO GROUPS")
            }
        })
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                    <h1>Groups</h1>
                </div>
                <div className="body-app">
                    <Link to="/groups/new" className="btn btn-primary">Create new Group</Link>
                    {
                        Object.entries(this.state.groups).map(([key,value]) =>
                            <div>
                                <br/>
                                <CardGroup
                                    id={key}
                                    name={value.name}
                                    description={value.description}
                                ></CardGroup>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default ListGroup