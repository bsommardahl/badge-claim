import React from "react";
import { Link } from "react-router-dom";
import { getGroups } from "../../../functions/FirebaseU/FirebaseUtils";
import CardGroup from "./CardGroup";
import { Loader } from "../Loader";

class ListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      groups: [],
    };
  }

  componentDidMount() {
    getGroups().on("value", (snapshot) => {
      try {
        if (snapshot.val()) {
          this.setState({ groups: snapshot.val(), isLoading: false });
        }
      } catch (error) {
        console.log("NO GROUPS",error);
      }
    });
  }

  render() {
    const ListOfGroups = Object.entries(
      this.state.groups
    ).map(([key, value]) => (
      <CardGroup
        id={key}
        name={value.name}
        description={value.description}
      ></CardGroup>
    ));

    return (
      <div>
        <div className="badge-summary jumbotron">
          <h1>Groups</h1>
        </div>
        <div className="body-app d-flex flex-column">
          <div className="mw-200">
            <Link to="/groups/new" className="btn btn-primary ">
              Create new Group
            </Link>
          </div>
          {!this.state.isLoading ? (
            <table className="table mt-3">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>{ListOfGroups}</tbody>
            </table>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  }
}

export default ListGroup;
