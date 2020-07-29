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
          <div className="container-fluid d-flex flex-wrap">{badgeList}</div>
        )}
      </div>
    );
  }
}

export default BadgeListContainer;