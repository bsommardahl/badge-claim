import React from 'react'
import Form from 'react-bootstrap/Form';
import { useParams } from "react-router-dom";
import {getID, addDraft, publishDraft, getDraft} from '../../FirebaseUtils'

var arr = []
var pathway = {}
var IDS = 0;

const build = (name, adding) => {
    var root = arr.filter(a => a.herencia === name)
    var parts = 3;
    console.log("A",arr)

    if(root!=null)
        pathway[getID(root[0].url)] = {title: name.split(" > ")[1], completionBadge: root[0].url, children: []}
        //pathway["completationBadge"]=getID(root[0].url);
    for(var i = 0; i < arr.length; i++){
        const heri = arr[i].herencia.split(" > ");
        
        if(heri.length == parts){
            //const child = {title: heri[parts-1], requiredBadge: arr[i].url};\
            //buildAux(arr[i] ,parts+1)
            pathway[getID(root[0].url)].children.push(buildAux(arr[i], heri[parts-1], parts+1));
        }
    }

    console.log("B",arr)

    if(adding)
        publishDraft(getID(root[0].url), pathway[getID(root[0].url)])
    else
        addDraft(getID(root[0].url), pathway[getID(root[0].url)])
}


const buildAux = (parent, parentName, parts) => {
    var subpath = {title: parentName, requiredBadge: parent.url, children: []}
    for(var i = 0; i < arr.length; i++){
        const heri = arr[i].herencia.split(" > ");
        if(heri.length == parts && arr[i].herencia.includes(parent.herencia)){
            subpath.children.push(buildAux(arr[i], heri[parts-1], parts+1))
        }
    }

    return subpath
}

class CardChild extends React.Component{
    constructor(props){
        super(props)
        this.state = {draft: null, id: 0, savedName: this.props.obj.title, name: this.props.obj.title, requiredBadge: this.props.obj.requiredBadge, children: []}
        this.addRoot = this.addRoot.bind(this);
        this.updateChild = this.updateChild.bind(this);
        this.addChild = this.addChild.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.deleteChild =  this.deleteChild.bind(this);
    }

    addRoot(){
        if(this.state.name !== "" && this.state.name !== undefined){
            this.props.updateChild(this.state.savedName, this.state.name, this.state.requiredBadge, this.state.children);
            this.setState({savedName: this.state.name})
        }
    }

    addChild(){
        if(this.state.children.filter(child => child.title === "" || child.title === undefined).length === 0)
            this.setState({children: this.state.children.concat([{title: "", requiredBadge: "", children: []}])})
    }

    updateChild(savedName, newname, requiredBadge, children){
        console.log("***********PARENT", this.state.savedName, "***************");
        console.log(savedName, newname, requiredBadge, children);
        if(newname === "" || newname === undefined){
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)})
        }else{
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)
                    .concat([{title: newname, requiredBadge: requiredBadge, children: children ? children : []}])})
        }
        console.log(this.state)
        console.log("***********SENDING", this.state.savedName, "***************");
        this.props.updateChild(this.state.savedName, this.state.name, this.state.requiredBadge, this.state.children);
    }

    deleteChild(){
        this.props.updateChild(this.state.savedName, "", "", [])
        arr = arr.filter(a => a.herencia.includes(`ROOT > ${this.props.parents} > ${this.state.savedName}`))
        //this.setState({savedName: ""});
        console.log(arr);
    }

    handleName(e){
        this.setState({name: e.target.value})
    }

    handleUrl(e){
        this.setState({requiredBadge: e.target.value})
    }

    componentDidMount(){
        console.log("MOUNTING", this.props.obj)
        if(this.props.editing && this.state.savedName !== undefined){
            this.setState({
                savedName: this.props.obj.title, 
                name: this.props.obj.title, 
                requiredBadge: this.props.obj.requiredBadge, 
                children: this.props.obj.children ? this.props.obj.children : [], 
                draft: this.props.obj
            })
            arr.push({herencia: `ROOT > ${this.props.parents} > ${this.props.obj.title}`, requiredBadge: this.props.obj.requiredBadge})
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.obj.title !== this.state.savedName) {
          this.setState({ savedName: nextProps.obj.title, name: nextProps.obj.title, requiredBadge: nextProps.obj.requiredBadge, children: nextProps.obj.children ? nextProps.obj.children : [] });
        }
      }

    componentDidUpdate(prevProps, prevState) {
        /*const { match: {params}} = this.props
        if (prevState.pathway !== this.state.pathway) {
           //console.log('UPDATE', this.state);
           createPathway(this.state.pathway, this.state.userEmail, this.state.awarded)
           if(existPath(params.pathway_id) == null) {
               savePath(params.pathway_id, this.state.pathway)
           }
        }*/
        if (prevState.children !== this.state.children && prevState.children.length > 0) {
            console.log("SENDING", this.state, prevState);
            this.props.updateChild(this.state.savedName, this.state.savedName, this.state.requiredBadge, this.state.children)
        }
    }

    render() {
        return (
            <div className="card" style={{width: "100%"}}>
                <div className="card-header">
                    <h5>{`${this.props.parent} > ${this.state.savedName}`}</h5>
                    <button 
                        className="btn btn-danger"
                        onClick={() => this.deleteChild()}
                    >
                        Delete
                    </button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div class="col-auto">
                            <button className="btn btn-primary" disabled={this.state.name==="" || this.state.requiredBadge === ""} onClick={this.addRoot}>{this.state.savedName === "" ? 'Create' : 'Update'}</button>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control type="name" value={this.state.name} placeholder="Enter Name" onChange={this.handleName}/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control placeholder="Enter URL" value={this.state.requiredBadge} onChange={this.handleUrl}/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col-auto">
                            <div class="btn-group" role="group">
                                <button className="btn btn-primary" onClick={this.addChild} disabled={this.state.savedName === "" || this.state.savedName === undefined}>Add Child</button>
                            </div>
                        </div>
                    </div>
                    <p style={{marginTop: "10px"}}>Children:</p>
                    {this.state.children.map(child => <CardChild updateChild={this.updateChild} parents={`${this.props.parents} > ${this.state.savedName}`} parent={this.state.savedName} obj={child} editing={this.props.editing}/>)}
                </div>
            </div>
        )
    }
}

class Drafts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {draft: null, savedName: "", name: "", url: "", children: [], editing: false}
        this.addRoot = this.addRoot.bind(this);
        this.addChild = this.addChild.bind(this);
        this.updateChild = this.updateChild.bind(this);
        this.deleteChild = this.deleteChild(this)
        this.save = this.save.bind(this);
        this.publish = this.publish.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
    }

    addRoot(){
        if(this.state.name){
            if(arr.length == 0){
                arr.push({herencia: "ROOT > " + this.state.name, url: this.state.url})
            }else{
                for(var i = 0; i < arr.length; i++){
                    if(`ROOT > ${this.state.savedName}` === arr[i].herencia){
                        arr[i].url = this.state.url;
                    }
                    const newName = arr[i].herencia.replace(`ROOT > ${this.state.savedName}`, `ROOT > ${this.state.name}`);
                    arr[i].herencia = newName;
                }
            }
            this.setState({savedName: this.state.name})
        }
    }

    addChild(){
        if(this.state.children.filter(child => child.title === "" || child.title === undefined).length === 0)
            this.setState({children: this.state.children.concat([{title: "", requiredBadge: "", children: []}])})
    }

    updateChild(savedName, newname, requiredBadge, children){
        console.log("***********PARENT", "ROOT***********");
        console.log(savedName, newname, requiredBadge, children);
        if(newname === "" || newname === undefined){
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)})
        }else{
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)
                    .concat([{title: newname, requiredBadge: requiredBadge, children: children ? children : []}])})
        }
    }

    deleteChild(){
        console.log(arr);
    }

    save(){
        addDraft(getID(this.state.url), 
            {
                title: this.state.savedName,
                completionBadge: this.state.url, 
                children: this.state.children
            });
    }

    publish(){
        publishDraft(getID(this.state.url), 
            {
                title: this.state.savedName,
                completionBadge: this.state.url, 
                children: this.state.children
            })
    }

    handleName(e){
        this.setState({name: e.target.value})
    }

    handleUrl(e){
        this.setState({url: e.target.value})
    }

    componentDidMount(){
        const { match: {params}} = this.props
        if(params.draft_id){
            getDraft(params.draft_id).on('value', (snapshot) => {
                const obj = snapshot.val();
                
                this.setState({
                    savedName: obj.title, 
                    name: obj.title, 
                    url: obj.completionBadge, 
                    children: obj.children ? obj.children : [], 
                    draft: obj,
                    editing: true
                })

                arr.push({herencia: "ROOT > " + this.state.savedName, url: this.state.url})
            })
        }

        
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1>Creating</h1>
                        <button className="btn btn-primary" disabled={this.state.savedName === ""} onClick={this.save}>Save</button>
                        <button style={{marginLeft: "20px"}} className="btn btn-primary" disabled={this.state.savedName === ""} onClick={this.publish}>Publish</button>
                    </div>
                    <div  className="body-app">
                        <div className="row">
                            <div class="col-auto">
                                <button className="btn btn-primary" disabled={this.state.name === ""} onClick={this.addRoot}>{this.state.savedName ? 'Update Root' : 'Add Root'}</button>
                            </div>
                            <div class="col">
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control type="name" value={this.state.name} placeholder="Enter Name" onChange={this.handleName}/>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col">
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control placeholder="Enter URL"  value={this.state.url} onChange={this.handleUrl}/>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col-auto">
                                <button className="btn btn-primary" disabled={this.state.savedName === "" || this.state.savedName === undefined} onClick={this.addChild}>Add Child</button>
                            </div>
                        </div>
                        {this.state.children.map(child => <CardChild updateChild={this.updateChild} parents={this.state.savedName} parent={this.state.savedName} obj={child} editing={this.state.editing}/>)}
                    </div>
                </div>
            </div>
        )
    }
}
export default Drafts;