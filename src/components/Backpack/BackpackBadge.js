import React,{Component} from 'react'
import { Link } from "react-router-dom";

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
              className="badge-image img-fluid"
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
export default BackpackBadge;