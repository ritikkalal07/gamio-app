import React from "react";

function Admin_Users()
{
    return(
<main className="main-content">
    <header className="main-header">
        <h1>Manage Users</h1>
    </header>

    <div className="table-container">
        <table className="data-table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>#U001</td>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                    <td>2025-07-20</td>
                    <td className="action-btns">
                        <button className="action-btn delete"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>#U002</td>
                    <td>Jane Smith</td>
                    <td>jane@example.com</td>
                    <td>2025-07-22</td>
                    <td className="action-btns">
                        <button className="action-btn delete"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</main>
    );
}
export default Admin_Users;