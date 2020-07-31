import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import "./Backpack.css";
import {
  getUserEmail,
  saveBackpackToken,
  getTokenData,
} from "../../../functions/FirebaseU/FirebaseUtils";

const clientID = process.env.REACT_APP_CLIENT_ID || "RANDOM";
const clientSecret = process.env.REACT_APP_SECRET || "RANDOM";
const returnURL = "http://localhost:3001/backpack";

const getID = (str) => str.substring(str.lastIndexOf("/") + 1);

class BackpackBadge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var badgeID = getID(this.props.badge.entityId);
    return (
      <div class="col-sm-6">
        <div className="card" style={{ marginTop: "15px" }}>
          <div className="card-header row">
            <img
              className="badge-image container-fluid"
              src={this.props.badge.image}
              alt="This is a badge"
            />
            <h4>{this.props.badge.name}</h4>
          </div>
          <div className="card-body">
            <p>{this.props.badge.description}</p>
            <div>
              <Link
                className="btn btn-primary btn-sm"
                to={`/badges/${badgeID}`}
              >
                View
              </Link>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

class Backpack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      email: "",
      password: "",
      backpackBadges: null,
    };
    this.validateCredentials = this.validateCredentials.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.postMount = this.postMount.bind(this);
  }

  async validateCredentials() {
    //
    //console.log("ID", clientID)
    //console.log("Secret", clientSecret)
    window.location.replace(
      `https://badgr.io/auth/oauth2/authorize?client_id=${clientID}&redirect_uri=${returnURL}&scope=r:profile r:backpack`
    );

    // await axios.get('https://badgr.io/auth/oauth2/authorize?client_id=DhPGPJM6k6DNluhmfPYkifyjC6KcFoDX9QtFTRUh&redirect_uri=http://localhost:3001/backpack&scope=r:profile r:backpack',
    //     {headers: {"Access-Control-Allow-Origin": "*"}
    // })

    /*
        const log = await axios.post(
            `/users`, 
            {
                email: this.state.email, 
                password: this.state.password
            }
        )
        if(log.data && log.data!=="" && log.data!==undefined){
            const email = await getUserEmail();
            saveBackpackToken(email.email, log.data, this.state.email);
            this.setState({isAuthenticated: true})
        }else{
            alert("Your credentials are incorrect, please type them again");
            window.location.reload();
        }
        console.log("LOG: ",log.data.access_token);
        const badges = await axios.post(
            `/users/backpack`, 
            {
                token: log.data.access_token
            }
        )
        if(badges && badges!=={}){
            this.setState({ backpackBadges: badges })            
        }
        */
  }

  async componentDidMount() {
    const email = await getUserEmail();
    this.setState({ email: email.email });
    var data;
    getTokenData(email.email, email.email).on("value", (snapshot) => {
      this.postMount(snapshot.val(), email);
    });
    const code = (this.props.location.search
      ? this.props.location.search
      : null
    ).replace("?code=", "");
    if (code) {
      console.log("CODE DID MOUNT: ", code);
      axios
        .post("/users/oauthToken", { body: { code: code } })
        .then((res) => console.log(res))
        .catch((error) => console.log("ERROR: ", error));
    }
  }

  async postMount(token, email) {
    const isLogged = await axios.post(`/users/logged`, {
      data: token,
    });
    if (isLogged.data === true) {
      //check if the request is OK
      this.setState({ isAuthenticated: true });
      const badges = await axios.post(`/users/backpack`, {
        token: token.data.access_token,
      });
      if (badges && badges !== {}) {
        this.setState({ backpackBadges: badges });
      }
    } else if (isLogged.data === false) {
      const new_access = await axios.post(`/users/refresh`, {
        token: token.data.refresh_token,
      });
      saveBackpackToken(email.email, new_access.data, this.state.email);
      this.setState({ isAuthenticated: true });
      const badges = await axios.post(`/users/backpack`, {
        token: new_access.data.access_token,
      });
      if (badges && badges !== {}) {
        this.setState({ backpackBadges: badges });
      }
    } else {
      alert("Please register your Badgr account");
    }
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
          <h1>Backpack</h1>
        </div>
        <div className="body-app">
          {!this.state.isAuthenticated ? (
            <div className="Credentials">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => this.validateCredentials()}
              >
                Login with Badgr's OAuth
              </button>
            </div>
          ) : (
            <div className="row">
              {this.state.backpackBadges ? (
                this.state.backpackBadges.data.badges.map((badge) => (
                  <BackpackBadge badge={badge}></BackpackBadge>
                ))
              ) : (
                <div>
                  <p>Loading</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(Backpack);
