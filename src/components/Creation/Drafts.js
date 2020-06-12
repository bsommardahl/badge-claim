import React from 'react'
import Form from 'react-bootstrap/Form';
import {getID} from '../../FirebaseUtils'

const test = {
    name: 'Pepperoni',
    id: 'pepperoni-id',
    subOptions: [
      {
        name: 'Spicy',
        id: 'spicy-id',
        subOptions: [],
      },
      {
        name: 'Chicken',
        id: 'chicken-id',
        subOptions: []
      }
    ],
  }

var arr = []
var pathway = {}

const build = (name) => {
    var root = arr.filter(a => a.herencia === name)
    var parts = 3;

    if(root!=null)
        pathway[getID(root[0].url)] = {title: name.split(" > ")[1], completationBadge: root[0].url, children: []}
        //pathway["completationBadge"]=getID(root[0].url);
    console.log("ROOT", pathway)
    for(var i = 0; i < arr.length; i++){
        const heri = arr[i].herencia.split(" > ");
        
        //console.log(heri.length, parts, heri);
        if(heri.length == parts){
            //const child = {title: heri[parts-1], requiredBadge: arr[i].url};
            //console.log(heri)
            //buildAux(arr[i] ,parts+1)
            pathway[getID(root[0].url)].children.push(buildAux(arr[i], heri[parts-1], parts+1));
        }
    }

    console.log("PATHWAY", pathway)
}


const buildAux = (parent, parentName, parts) => {
    var subpath = {title: parentName, requiredBadge: parent.url, children: []}
    console.log("Subpath", parts, subpath);
    for(var i = 0; i < arr.length; i++){
        const heri = arr[i].herencia.split(" > ");
        console.log(heri.length == parts, arr[i].herencia.includes(parent))
        if(heri.length == parts && arr[i].herencia.includes(parent)){
            console.log("NEXT", heri);
            subpath.children.push(buildAux(arr[i].herencia, heri[parts-1], parts+1))
        }
    }

    return subpath
}

class CardRoot extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="card" style={{width: "100%"}}>
                <h5 className="card-header">{`ROOT > ${this.props.parent}`}</h5>
                <div className="card-body">
                    <div className="row">
                        <div class="col-auto">
                            <button className="btn btn-primary">{arr.length ? 'Update Root' : 'Add Root'}</button>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control type="name" placeholder="Enter Name"/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control placeholder="Enter URL"/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col-auto">
                            <button className="btn btn-primary">Add Child</button>
                        </div>
                    </div>
                    <p style={{marginTop: "10px"}}>Children:</p>
                    {this.props.obj.subOptions ? this.props.obj.subOptions.map(opt => <CardChild obj={opt} parent={this.props.obj.name }/>) : <div/>}
                </div>
            </div>
        )
    }
}

class CardChild extends React.Component{
    constructor(props){
        super(props)
        this.state = {draft: null, oldname: "", name: "", url: "", children: []}
        this.addRoot = this.addRoot.bind(this);
        this.addChild = this.addChild.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
    }

    addRoot(){
        if(this.state.oldname === ""){
            console.log(this.props.parents)
            arr.push({herencia: `ROOT > ${this.props.parents} > ${this.state.name}`, url: this.state.url})
        }else if(this.state.name !== ""){
            for(var i = 0; i < arr.length; i++){
                if(`ROOT > ${this.props.parents} > ${this.state.oldname}` === arr[i].herencia){
                    if(this.state.name !== this.state.oldname){
                        const newName = arr[i].herencia.replace(`ROOT > ${this.props.parents} > ${this.state.oldname}`, `ROOT > ${this.props.parent} > ${this.state.name}`);
                        arr[i].herencia = newName;
                    }
                    arr[i].url = this.state.url;
                }else{
                    const newName = arr[i].herencia.replace(`ROOT > ${this.props.parents} > ${this.state.oldname}`, `ROOT > ${this.props.parent} > ${this.state.name}`);
                    arr[i].herencia = newName;
                }
            }
        }
        console.log("ARRAY" , arr)
        this.setState({oldname: this.state.name})
    }

    addChild(){
        this.setState({children: this.state.children.concat([{herencia: this.state.name, url: this.state.url}])})
    }

    handleName(e){
        this.setState({name: e.target.value})
    }

    handleUrl(e){
        this.setState({url: e.target.value})
    }

    render() {
        return (
            <div className="card" style={{width: "100%"}}>
                <h5 className="card-header">{`${this.props.parent} > ${this.state.oldname}`}</h5>
                <div className="card-body">
                    <div className="row">
                        <div class="col-auto">
                            <button className="btn btn-primary" onClick={this.addRoot}>{this.state.oldname === "" ? 'Create' : 'Update'}</button>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control type="name" placeholder="Enter Name" onChange={this.handleName}/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col">
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control placeholder="Enter URL" onChange={this.handleUrl}/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div class="col-auto">
                            <div class="btn-group" role="group">
                                <button className="btn btn-primary" onClick={this.addChild} disabled={this.state.oldname === ""}>Add Child</button>
                            </div>
                        </div>
                    </div>
                    <p style={{marginTop: "10px"}}>Children:</p>
                    {this.state.children.map(child => <CardChild parents={`${this.props.parents} > ${this.state.oldname}`} parent={this.state.oldname} obj={child}/>)}
                </div>
            </div>
        )
    }
}

class Drafts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {draft: null, oldname: "", name: "", url: "", children: []}
        this.addRoot = this.addRoot.bind(this);
        this.addChild = this.addChild.bind(this);
        this.save = this.save.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
    }

    addRoot(){
        if(this.state.name){
            if(arr.length == 0){
                arr.push({herencia: "ROOT > " + this.state.name, url: this.state.url})
            }else{
                for(var i = 0; i < arr.length; i++){
                    if(`ROOT > ${this.state.oldname}` === arr[i].herencia){
                        arr[i].url = this.state.url;
                    }
                    const newName = arr[i].herencia.replace(`ROOT > ${this.state.oldname}`, `ROOT > ${this.state.name}`);
                    arr[i].herencia = newName;
                }
            }
            console.log("ARRAY" , arr)
            this.setState({oldname: this.state.name})
        }
    }

    addChild(){
        this.setState({children: this.state.children.concat([{herencia: this.state.name, url: this.state.url}])})
    }

    save(){
        build("ROOT > " + this.state.name)
    }

    handleName(e){
        this.setState({name: e.target.value})
    }

    handleUrl(e){
        this.setState({url: e.target.value})
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1>Creating</h1>
                        <button className="btn btn-primary" onClick={this.save}>Save</button>
                    </div>
                    <div  className="body-app">
                        <div className="row">
                            <div class="col-auto">
                                <button className="btn btn-primary" onClick={this.addRoot}>{arr.length ? 'Update Root' : 'Add Root'}</button>
                            </div>
                            <div class="col">
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control type="name" placeholder="Enter Name" onChange={this.handleName}/>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col">
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control placeholder="Enter URL" onChange={this.handleUrl}/>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div class="col-auto">
                                <button className="btn btn-primary" disabled={this.state.oldname === ""} onClick={this.addChild}>Add Child</button>
                            </div>
                        </div>
                        {this.state.children.map(child => <CardChild parents={this.state.oldname} parent={this.state.oldname} obj={child}/>)}
                    </div>
                </div>
            </div>
        )
    }
}
export default Drafts;