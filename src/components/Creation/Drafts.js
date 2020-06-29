import React from 'react'
import Form from 'react-bootstrap/Form';
import {getID, addDraft, publishDraft, getDraft, getUserEmail, getAdmins} from '../../../functions/FirebaseU/FirebaseUtils'

class CardChild extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            draft: null, 
            id: 0, 
            savedName: this.props.obj.title, 
            name: this.props.obj.title, 
            requiredBadge: this.props.obj.requiredBadge, 
            isCompletion: false,
            children: []}
        this.addRoot = this.addRoot.bind(this);
        this.updateChild = this.updateChild.bind(this);
        this.addChild = this.addChild.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.handleCompletion = this.handleCompletion.bind(this);
        this.deleteChild =  this.deleteChild.bind(this);
    }

    addRoot(){
        if(this.state.name !== "" && this.state.name !== undefined){
            this.props.updateChild(this.state.savedName, this.state.name, this.state.requiredBadge, this.state.children, this.state.isCompletion);
            this.setState({savedName: this.state.name})
        }
    }

    addChild(){
        if(this.state.children.filter(child => child.title === "" || child.title === undefined).length === 0)
            this.setState({children: this.state.children.concat([{title: "", requiredBadge: "", children: []}])})
    }

    updateChild(savedName, newname, requiredBadge, children, isCompletion){
        if(newname === "" || newname === undefined){
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)})
        }else{

            const pos = this.state.children.map(function(e) { return e.title; }).indexOf(savedName);

            var newChildren = this.state.children;

            isCompletion?
            newChildren[pos] = {title: newname, completionBadge: requiredBadge, children: children ? children : []}:
            newChildren[pos] = {title: newname, requiredBadge: requiredBadge, children: children ? children : []}

            this.setState({children: newChildren})
        }
        this.props.updateChild(this.state.savedName, this.state.name, this.state.requiredBadge, this.state.children, this.state.isCompletion);
    }

    deleteChild(){
        this.props.updateChild(this.state.savedName, "", "", [], false)
    }

    handleName(e){
        this.setState({name: e.target.value})
    }

    handleCompletion(){
        this.setState({isCompletion: !this.state.isCompletion})
    }

    handleUrl(e){
        this.setState({requiredBadge: e.target.value})
    }

    componentDidMount(){
        if(this.props.editing && this.state.savedName !== undefined){
            this.setState({
                savedName: this.props.obj.title, 
                name: this.props.obj.title, 
                requiredBadge: this.props.obj.requiredBadge ? this.props.obj.requiredBadge : this.props.obj.completionBadge, 
                children: this.props.obj.children ? this.props.obj.children : [], 
                draft: this.props.obj,
                isCompletion: this.props.obj.requiredBadge ? false : true
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.obj.title !== this.state.savedName) {
            this.setState({ 
              savedName: nextProps.obj.title, 
              name: nextProps.obj.title, 
              requiredBadge: nextProps.obj.requiredBadge ? nextProps.obj.requiredBadge : nextProps.obj.completionBadge,
              children: nextProps.obj.children ? nextProps.obj.children : [],
              isCompletion: nextProps.obj.requiredBadge ? false : true
            });
        }
      }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.children !== this.state.children && prevState.children.length > 0) {
            this.props.updateChild(this.state.savedName, this.state.savedName, this.state.requiredBadge, this.state.children, this.state.isCompletion)
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
                            <button className="btn btn-primary" disabled={this.state.name===""} onClick={this.addRoot}>{this.state.savedName === "" ? 'Create' : 'Update'}</button>
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
                            <label class="row">
                                <input type="checkbox" checked={this.state.isCompletion} onChange={this.handleCompletion}/>
                                &nbsp;
                                <p>Completion Badge</p>
                            </label>
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
            this.setState({savedName: this.state.name})
        }
    }

    addChild(){
        if(this.state.children.filter(child => child.title === "" || child.title === undefined).length === 0)
            this.setState({children: this.state.children.concat([{title: "", requiredBadge: "", children: []}])})
    }

    updateChild(savedName, newname, requiredBadge, children, isCompletion){
        if(newname === "" || newname === undefined){
            this.setState({children: 
                this.state.children
                    .filter(child => child.title !== savedName)})
        }else{
            const pos = this.state.children.map(function(e) { return e.title; }).indexOf(savedName);

            var newChildren = this.state.children;

            isCompletion?
            newChildren[pos] = {title: newname, completionBadge: requiredBadge, children: children ? children : []}:
            newChildren[pos] = {title: newname, requiredBadge: requiredBadge, children: children ? children : []}

            this.setState({children: newChildren})
        }
    }

    deleteChild(){
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

    async componentDidMount(){
        const user = await getUserEmail();
        getAdmins().on('value', (snapshot) => {
            if(!snapshot.val().includes(user.email)){
                alert("You don't have permission to be here")
                document.location.href = '/explore';
            }
        })

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
            })
        }

        
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1>Creating</h1>
                        <button className="btn btn-primary" disabled={this.state.savedName === "" || this.state.url === ""} onClick={this.save}>Save</button>
                        <button style={{marginLeft: "20px"}} className="btn btn-primary" disabled={this.state.savedName === "" || this.state.url === ""} onClick={this.publish}>Publish</button>
                    </div>
                    <div  className="body-app">
                        <div className="row">
                            <div class="col-auto">
                                <button className="btn btn-primary" disabled={this.state.name === "" || this.state.url === ""} onClick={this.addRoot}>{this.state.savedName ? 'Update Root' : 'Add Root'}</button>
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