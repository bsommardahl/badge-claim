import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {addWebhook, app, deleteWebhook, getUserEmail} from '../../FirebaseUtils'
import {WebhookFire} from './WebhookEngine'

const cookies = new Cookies();

const name2event = (key) =>{
    switch (key) {
        case "Badge Awarded":
            return "badge_awarded"
        case "Badge Requested":
            return "badge_requested"
        case "New Pathway Member":
            return "new_pathway_member"
        case "Pathway Join Requested":
            return "pathway_join_requested"
    }
    return "Unknown"
}

const event2name = (key) =>{
    switch (key) {
        case "badge_awarded":
            return "Badge Awarded"
        case "badge_requested":
            return "Badge Requested"
        case "new_pathway_member":
            return "New Pathway Member"
        case "pathway_join_requested":
            return "Pathway Join Requested"
    }
    return "Unknown"
}

class WebhooksManagement extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            show: false, 
            showConfirm: false,
            id: "", 
            name: "", 
            url: "", 
            event: "badge_awarded", 
            secret: "",
            editing: false, 
            webhooks: {},
            password: "",
            email: "",
            showError: false
        }
        this.handleClose = this.handleClose.bind(this);
        this.createWebhook = this.createWebhook.bind(this);

        this.onChangeId = this.onChangeId.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeUrl = this.onChangeUrl.bind(this);
        this.onChangeEvent = this.onChangeEvent.bind(this);
        this.onChangeSecret = this.onChangeSecret.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePass = this.onChangePass.bind(this);

        this.addWebhook = this.addWebhook.bind(this);
        this.editWebhook = this.editWebhook.bind(this);
        this.openConfirm = this.openConfirm.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
    }
    
    createWebhook(){
        this.setState({show: true})
    }

    openConfirm(){
        this.setState({showConfirm: true})
    }

    closeConfirm(){
        this.setState({showConfirm: false})
        this.setState({showError: false})
    }

    handleClose(){
        this.setState({show: false})
        this.setState({editing: false})
    }

    onChangeId(event){
        this.setState({ id :event.target.value})
    }

    onChangeName(event){
        this.setState({ name :event.target.value})
    }

    onChangeUrl(event){
        this.setState({ url :event.target.value})
    }
    
    onChangeEvent(event){
        this.setState({ event : name2event(event.target.value)})
    }

    onChangeSecret(event){
        this.setState({ secret :event.target.value})
    }

    onChangeEmail(event){
        this.setState({email :event.target.value})
    }

    onChangePass(event){
        this.setState({password :event.target.value})
    }

    addWebhook(){
        const data = `username=${encodeURIComponent(this.state.email)}&password=${encodeURIComponent(this.state.password)}`;
        const cookie = cookies.get('issuer');
        if(cookie && cookie === this.state.id){
            addWebhook(this.state);
            this.setState({editing: false})
            this.setState({name :""})
            this.setState({event :"Badge Awarded"})
            this.setState({url :""})
            this.setState({id :""})
            this.setState({secret :""})
            this.setState({password :""})
            this.setState({showConfirm: false})
            this.setState({show: false})
        }else{
            axios({
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded' 
                },       
                method: 'post',
                url: 'https://api.badgr.io/o/token',
                data
            }).then(res => {
                console.log(res, res.data.access_token)                
                axios({
                    headers: {
                        'Authorization': `Bearer ${res.data.access_token}`
                    },
                    method: 'get',
                    url: `https://api.badgr.io/v2/issuers`,
        
                }).then(res1 => {
                    //console.log(this.state, res1.data.result)                
                    const len = res1.data.result.filter(r => r.entityId === this.state.id).length;
                    //console.log("longitud", len)                

                    if(len > 0)
                    {
                        addWebhook(this.state);
                        //console.log("longitud", len)
                        let d = new Date();
                        d.setTime(d.getTime() + (9*60*1000));
                        //console.log("longitud", len);
                        cookies.set("issuer", this.state.id, {path: "/webhooks", expires: d});
                        //console.log("longitud", len);

                        this.setState({editing: false});
                        this.setState({name :""});
                        this.setState({event :"Badge Awarded"});
                        this.setState({url :""});
                        this.setState({id :""});
                        this.setState({secret :""});
                        this.setState({password :""});
                        this.setState({showConfirm: false});
                        this.setState({show: false});
                    }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                this.setState({showError: true})
            })
        }
    }

    editWebhook(key, data){
        this.setState({ id: key.split(":")[0]})
        this.setState({ name: key.split(":")[1]})
        this.setState({ url: data.url})
        this.setState({ event: data.event})
        this.setState({ secret: data.secret})
        this.setState({ editing: true})
        this.setState({ show: true})
    }

    componentDidMount(){
        getUserEmail().then((user) => {
            this.setState({email: user.email})
            app.database().ref(`webhooks/`).orderByChild("owner").equalTo(user.email).on('value', (snapshot) =>
            {this.setState({
                webhooks: snapshot.val()
            })}
        )
        })
    }

    render(){
        const disable = 
            this.state.id !== "" && 
            this.state.name !== "" &&
            this.state.url !== "" &&
            this.state.event !== "" &&
            this.state.secret !== ""
        return (
            <div>
                <div className="badge-summary jumbotron">
                        <h1>Webhooks Management</h1>
                </div>
                <div className="body-app">
                    <Button variant="primary" style={{marginBottom: "15px"}} onClick={this.createWebhook}>
                        Add Webhook
                    </Button>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Issuer ID</th>
                                <th>Name</th>
                                <th>URL</th>
                                <th>Secret</th>
                                <th>Event</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.webhooks ? Object.entries(this.state.webhooks).map(([key,value])=>
                                <tr>
                                    <td>{key.split(":")[0]}</td>
                                    <td>{key.split(":")[1]}</td>
                                    <td>{value.url}</td>
                                    <td>{value.secret}</td>
                                    <td>{value.event}</td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <button type="button" onClick={() => this.editWebhook(key, value)} className="btn btn-primary">Edit</button>
                                            <button type="button" onClick={() => deleteWebhook(key)} className="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : <div/>}
                        </tbody>
                    </Table>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{this.state.editing ? "Edit Webhook" : "Add Webhook"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <Form.Group controlId="webhook.id">
                                <Form.Label>Issuer ID</Form.Label>
                                <Form.Control value={this.state.id} onChange={this.onChangeId} readOnly={this.state.editing}/>
                            </Form.Group>
                            <Form.Group controlId="webhook.name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control value={this.state.name} onChange={this.onChangeName} readOnly={this.state.editing}/>
                            </Form.Group>
                            <Form.Group controlId="webhook.url">
                                <Form.Label>URL</Form.Label>
                                <Form.Control value={this.state.url} onChange={this.onChangeUrl}/>
                            </Form.Group>
                            <Form.Group controlId="webhook.secret">
                                <Form.Label>Secret</Form.Label>
                                <Form.Control value={this.state.secret} onChange={this.onChangeSecret}/>
                            </Form.Group>
                            <Form.Group controlId="webhook.event">
                                <Form.Label>Event</Form.Label>
                                <Form.Control as="select" value={event2name(this.state.event)} onChange={this.onChangeEvent}>
                                <option>Badge Awarded</option>
                                <option>Badge Requested</option>
                                <option>New Pathway Member</option>
                                <option>Pathway Join Requested</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" disabled={!disable} onClick={cookies.get('issuer') ? this.addWebhook : this.openConfirm}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.showConfirm} onHide={this.closeConfirm} id="confirmation">
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" onChange={this.onChangeEmail}/>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={this.onChangePass}/>
                                </Form.Group>
                                <div style={{color: "red"}}>{this.state.showError  ? "Incorrect Credentials" : ""}</div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeConfirm}>Close</Button>
                            <Button variant="primary" onClick={this.addWebhook}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
};

export default WebhooksManagement;