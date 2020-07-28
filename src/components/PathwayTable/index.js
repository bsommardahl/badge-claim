import React from "react";
import { Link } from "react-router-dom";

const getID = (str) => str.substring(str.lastIndexOf("/") + 1);

export const PathwayTable = ({ paths }) => {
  return (
    <table className="table mt-3">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paths.map((item) => (
          <tr key={getID(item.completionBadge)}>
            <th scope="row">{item.title}</th>
            <td>
              <Link
                className="btn btn-primary"
                to={`/pathway/${getID(item.completionBadge)}`}
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
