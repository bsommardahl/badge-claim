import React from "react";
import {
  getID,
  getOneGroup,
  addUserToGroup
} from "../../../functions/FirebaseU/FirebaseUtils";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from "react-router-dom";
import { WebhookFire } from "../Webhooks/WebhookEngine";
import Modal from "react-bootstrap/Modal";
import { UserTable } from "../UserTable";
import { Loader } from "../Loader";
import './IndividualGroup.css';
import { isUndefined } from "lodash";

class IndividualGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      desc: "",
      users: null,
      pathways: undefined,
      allPathways: [],
      open: false,
      openPath: false,
      email: "",
    };
    this.handleModal = this.handleModal.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  handleModal() {
    this.setState({ open: !this.state.open });
  }

  handleModalPath() {
    this.setState({ openPath: !this.state.openPath });
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this.setState({ id: params.id });

    getOneGroup(params.id).on("value", (snapshot) => {
      try {
        if (snapshot.val()) {
          const { name, description, users, pathways } = snapshot.val();
          this.setState({
            name: name,
            desc: description,
            users: users,
            pathways: pathways,
          });
        }
      } catch (error) {
        console.log("NO GROUP", error);
      }
    });

    let allPathways = [];
    let pathways = require(`../../../pathways/pathwaysIDS.json`);
    
    for(let x=0;x<pathways.pathways_ids.length;x++){
        let path = Object.values(require(`../../../pathways/${pathways.pathways_ids[x]}.json`))[0]
        allPathways.push(path);
    }
    
    this.setState({
      allPathways
    });
  }

  onChangeText = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  addUser() {
    addUserToGroup(this.state.id, this.state.email);
    WebhookFire("2mE3WXrJT1KEdqousLHhFw", "group_invitation", {
      email: this.state.email,
      name: this.state.name,
    });
  }

  addPathway(id){
    if(isUndefined(this.state.pathways)){
      this.setState({pathways: [id]})
    }
  }

  render() {
    return (
      <div>
        <div className="badge-summary jumbotron row d-flex justify-content-around">
          <div className="text-left">
            <h1>{this.state.name}</h1>
            <p>{this.state.desc}</p>
          </div>
          <div>
            <Link
              to={{
                pathname: `/groups/edit/${this.state.id}`,
                aboutProps: {
                  name: this.state.name,
                  desc: this.state.description,
                  id: this.state.id,
                },
              }}
              className="btn btn-primary mr-3"
            >
              Edit
            </Link>

            <Link to={`/groups`} className="btn btn-primary">
              Back
            </Link>
          </div>
        </div>
        <div className="body-app">
          <button
            className="btn btn-primary"
            onClick={() => this.handleModalPath()}
          >
            Add Pathway to Group
          </button>
          <button
            className="btn btn-secondary ml-3"
            onClick={() => this.handleModal()}
          >
            Add User to Group
          </button>
          <div>
            <div style={{marginTop: "3%"}}>
              <Tabs style={{width: "100%"}}>
                  <Tab eventKey="available" title="Users">
                    {this.state.users ? (
                      <UserTable users={Object.entries(this.state.users)} />
                    ) : (
                      <Loader />
                    )}
                  </Tab>
                  <Tab eventKey="pathways" title="Pathways">
                    {!isUndefined(this.state.pathways) ? (
                      <UserTable users={Object.entries(this.state.users)} />
                    ) : (
                      <Loader />
                    )}
                  </Tab>
              </Tabs>
            </div>
          </div>
          <Modal show={this.state.open} onHide={this.handleModal}>
            <Modal.Header>
              <h4 class="modal-title">Add new user to group</h4>
            </Modal.Header>
            <Modal.Body>
              <input
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.onChangeText}
                type="email"
                required
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => this.handleModal()}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.addUser()}
              >
                Add User
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.openPath} onHide={this.handleModalPath}>
            <Modal.Header>
              <h4 class="modal-title">Add New Pathway to Group</h4>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column">
              <div className="pathwaysModal">
                {this.state.allPathways.map((item) => 
                  <div className=" d-flex flex-row m-2 shadow p-4 align-middle justify-content-between align-content-center align-items-center">
                    <span className="font-weight-bold">{item.title}</span>
                    <button className="btn btn-primary ml-3">Add</button>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => this.handleModalPath()}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
export default IndividualGroup;
