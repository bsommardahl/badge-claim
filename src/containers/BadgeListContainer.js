import React, { Component } from "react";
import axios from "axios";
import BadgeListItem from "../components/BadgeListItem/BadgeListItem";
import { Loader } from "../components/Loader";

class BadgeListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    axios
      .get(`/badges`)
      .then((res) => {
        this.setState({
          badges: res.data.result,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const badgeList = this.state.badges.map((badge) => (
      <BadgeListItem badge={badge} />
    ));

    return (
      <div className="h-100">
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
             <div className="badge-summary jumbotron">
          <h1>Welcome to Acera! ❤️</h1>
        </div>
        <div className="badged-grid">{badgeList}
          </div>
          </>
        )}
      </div>
    );
  }
}

export default BadgeListContainer;
