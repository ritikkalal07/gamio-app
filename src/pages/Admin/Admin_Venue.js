import React from "react";

function Admin_Venue()
{
    return(
        <main className="main-content">
    <header className="main-header">
        <h1>📘Manage Venues</h1>
        <button className="btn btn-primary" id="add-venue-btn">Add New Venue</button>
    </header>

    <div className="table-container">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Venue Name</th>
                    <th>Location</th>
                    <th>Sports</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Urban Sports Hub</td>
                    <td>Ahmedabad</td>
                    <td>Cricket, Badminton</td>
                    <td>Active</td>
                    <td className="action-btns">
                        <button className="action-btn edit"><i className="fas fa-edit"></i></button>
                        <button className="action-btn delete"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
                <tr>
                    <td>The Shuttle Zone</td>
                    <td>Gandhinagar</td>
                    <td>Badminton</td>
                    <td>Active</td>
                    <td className="action-btns">
                        <button className="action-btn edit"><i className="fas fa-edit"></i></button>
                        <button className="action-btn delete"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div className="modal" id="venue-modal">
        <div className="modal-content">
            <div className="modal-header">
                <h2>Add New Venue</h2>
                <button className="modal-close">&times;</button>
            </div>
            <form>
                <div className="form-group">
                    <label for="venue-name">Venue Name</label>
                    <input type="text" id="venue-name" className="form-input"/>
                </div>
                <div className="form-group">
                    <label for="venue-location">Location</label>
                    <input type="text" id="venue-location" className="form-input"/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn modal-close">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Venue</button>
                </div>
            </form>
        </div>
    </div>
</main>
    );
}
export default Admin_Venue;