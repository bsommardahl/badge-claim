import React from "react";
import {
  addGroup,
  getOneGroup,
  editGroup,
  getGroups,
} from "../../../functions/FirebaseU/FirebaseUtils";
import { Link,withRouter } from "react-router-dom";
class NewGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      id: "",
    };
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.setState({ id: params.id });
    getOneGroup(params.id).on("value", (snapshot) => {
      try {
        if (snapshot.val()) {
          const { name, description } = snapshot.val();
          this.setState({ name: name, desc: description });
        }
      } catch (error) {
        console.log("NO GROUP", error);
      }
    });
  }

  create() {
    if (this.state.name == "") alert("Please type in a name");
    else {
      addGroup(this.state.name, this.state.desc);
      getGroups().on("value", (snapshot) => {
        console.log("Snapshot", snapshot.val());
        let values = Object.values(snapshot.val());
        let keys = Object.keys(snapshot.val());
        for (let x = 0; x < values.length; x++) {
          if (
            values[x].name === this.state.name &&
            values[x].description === this.state.desc
          ) {
            this.props.history.push(`/groups/${keys[x]}`);
          }
        }
      });
    }
  }

  edit() {
    if (this.state.name == "") alert("Please type in a name");
    else editGroup(this.state.id, this.state.name, this.state.desc);
    this.props.history.push(`/groups/${this.state.id}`);
  }

  onChangeText = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  render() {
    return (
      <div>
        <div className="badge-summary jumbotron">
          <h1>{this.state.id ? "Edit Group" : "Create Group"}</h1>
          <Link to={this.state.id?`/groups/${this.state.id}`:`/groups`} className="btn btn-primary">
              Back
          </Link>
        </div>
        <div className="body-app d-flex flex-column center text-left ">
          <div className="min-800 mw-800 shadow p-4 rounded">
            <h2 className="mt-3">Name of Group</h2>
            <input
              className="form-control"
              placeholder="Nombre"
              name="name"
              value={this.state.name}
              required
              onChange={this.onChangeText}
            ></input>
            <h2 className="mt-3">Description of Group</h2>
            <textarea
              className="form-control"
              rows="5"
              cols="40"
              name="desc"
              value={this.state.desc}
              placeholder="Description"
              onChange={this.onChangeText}
            />
            <button
              className="btn btn-primary mt-3"
              onClick={() => (this.state.id ? this.edit() : this.create())}
            >
              {this.state.id ? "Edit" : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(NewGroup);
