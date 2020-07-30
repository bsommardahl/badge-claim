import React from "react";
import { Link } from "react-router-dom";

const CardGroup = ({ id, name, description }) => {
  return (
    <tr>
      <th scope="row">{id}</th>
      <td>{name}</td>
      <td>{description}</td>
      <td>
        <Link
          to={{
            pathname: `/groups/${id}`,
            aboutProps: {
              name: name,
              desc: description,
              id: id,
            },
          }}
          className="btn btn-primary"
        >
          View
        </Link>
      </td>
    </tr>
  );
};
export default CardGroup;
