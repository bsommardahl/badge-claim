import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "./Backpack.css";
import BackpackBadge from "./BackpackBadge";
import {
  getUserEmail,
  saveBackpackToken,
  getTokenData,
} from "../../../functions/FirebaseU/FirebaseUtils";
import { Loader } from "../Loader";

const clientID = process.env.REACT_APP_CLIENT_ID || "RANDOM";
const returnURL = "http://localhost:3001/backpack";

class Backpack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      email: "",
      password: "",
      backpackBadges: null,
      isLoaded: false,
    };
    this.validateCredentials = this.validateCredentials.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.postMount = this.postMount.bind(this);
    this.getCode = this.getCode.bind(this);
    this.isLogged = this.isLogged.bind(this);
    this.getBadges = this.getBadges.bind(this);
    this.getNewToken = this.getNewToken.bind(this);
  }

  async validateCredentials() {
    window.location.replace(
      `https://badgr.io/auth/oauth2/authorize?client_id=${clientID}&redirect_uri=${returnURL}&scope=r:profile r:backpack`
    );
  }

  async componentDidMount() {
    const email = await getUserEmail();
    this.setState({ email: email.email });
    var data;
    getTokenData(email.email, email.email).on("value", async (snapshot) => {
      data = snapshot.val();
      this.postMount(snapshot.val(), email);
      if (!data) await this.getCode(email);
    });
  }

  async isLogged(token) {
    const isLogged = await axios.post(`/users/logged`, {
      data: token,
    });
    return isLogged;
  }

  async getBadges(token) {
    this.setState({ isAuthenticated: true });
    const badges = await axios.post(`/users/backpack`, {
      token: token.data.access_token,
    });
    if (badges && badges !== {}) {
      this.setState({ backpackBadges: badges });
    }
  }

  async getCode(email) {
    var code = false;
    if(this.props.location.search){
      code = (this.props.location.search
        ? this.props.location.search
        : null
      ).replace("?code=", "");        
    }
    if (code) {
      var res = await axios.post("/users/oauthToken", { body: { code: code } });
      if (res.data && res.data.access_token) await this.postMount(res, email);
    }
    this.setState({isLoaded: true});
  }


  async getNewToken(email, token) {
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
  }

  async postMount(token, email) {
    if (token) {
      const isLogged = await this.isLogged(token);
      if (isLogged.data === true) {
        await this.getBadges(token);
      } else if (isLogged.data === false) {
        await this.getNewToken(email, token);
      }
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
          {!this.state.isAuthenticated && this.state.isLoaded ? (
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
                  <Loader/>
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
