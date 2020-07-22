import React from 'react'
import {addGroup, getOneGroup, editGroup} from '../../../functions/FirebaseU/FirebaseUtils'

class NewGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: props.name||"",
            desc: props.desc||"",
            id: props.id||null
        } 
        this.create = this.create.bind(this);
        this.edit = this.edit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }
    
    componentDidMount(){
        const { match: {params}} = this.props;
        this.setState({id: params.id})
        getOneGroup(params.id).on('value', (snapshot) => {
            try {
                if(snapshot.val()){
                    const {name,description}= snapshot.val()
                    console.log("snapshot in EDIT",snapshot.val());
                    this.setState({name:name,desc:description})
                }
            } catch (error) {
                console.log("NO GROUP")
            }
        })
    }

    create(){

        if(this.state.name=="")
            alert("Please type in a name");
        else
            addGroup(this.state.name,this.state.desc)
    }

    edit(){
        alert("It's an edit");
        if(this.state.name=="")
            alert("Please type in a name");
        else
            editGroup(this.state.id, this.state.name, this.state.desc)
    }

    onChangeText = (e)=>{
        const {name, value} = e.currentTarget;
        this.setState({
            ...this.state,
            [name]:value,
        });
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                    <h1>{this.state.id?"Edit":"Create"} Group</h1>
                </div>
                <div className="body-app">
                    <h2>Name of Group</h2>
                    <input 
                        placeholder="Nombre" 
                        name="name" 
                        value={this.state.name}
                        onChange={this.onChangeText}
                    ></input>
                    <br/>
                    <h2>Description of Group</h2>
                    <textarea 
                        rows="5" 
                        cols="40" 
                        name="desc"
                        value={this.state.desc}
                        placeholder="Description"
                        onChange={this.onChangeText}
                    />
                    <br/>
                    <br/>
                    <button onClick={() => this.state.id ? this.edit() : this.create()}>{this.state.id?"Edit":"Create"}</button>
                </div>
            </div>
        )
    }
}

export default NewGroup