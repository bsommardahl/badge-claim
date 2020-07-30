import React from 'react'

export const UserTable = ({users}) => {
    return(
        <table className="table mt-3">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Date</th>
                </tr>
            </thead>
                <tbody>
                {
                    users.map(([key,value])=>(
                        <tr key={key}>
                            <th scope="row">{value.email}</th>
                            <td>{new Date(value.ms_date).toLocaleDateString("en-US")}</td>
                        </tr>
                        )
                    )
                }
                </tbody>
        </table>
    )
}