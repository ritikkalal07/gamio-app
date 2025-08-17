import React from "react";

function Booking()
{
    return(
      <main className="main-content">
    <header className="main-header">
        <h1>All Bookings</h1>
    </header>

    <div className="table-container">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>#G1234</td>
                    <td>John Doe</td>
                    <td>Urban Sports Hub</td>
                    <td>2025-08-14</td>
                    <td>₹1500</td>
                    <td>Confirmed</td>
                </tr>
                <tr>
                    <td>#G1235</td>
                    <td>Jane Smith</td>
                    <td>The Shuttle Zone</td>
                    <td>2025-08-15</td>
                    <td>₹800</td>
                    <td>Confirmed</td>
                </tr>
                 <tr>
                    <td>#G1236</td>
                    <td>Peter Jones</td>
                    <td>Night Cricket Arena</td>
                    <td>2025-08-13</td>
                    <td>₹2000</td>
                    <td>Cancelled</td>
                </tr>
            </tbody>
        </table>
    </div>
</main>
    );
}
export default Booking;