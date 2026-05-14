import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(function() {
    API.get("/tickets/my")
      .then(function({ data }) {
        setTickets(data);
      })
      .catch(function() {
        alert("Failed to load tickets");
      })
      .finally(function() {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-wide">
        <div className="page-header">
          <h2>📋 My Support Tickets</h2>
          <p>Track the status of your submitted tickets.</p>
        </div>

        <button className="btn btn-primary" style={{ marginBottom: "1rem" }} onClick={function() { navigate("/help"); }}>
          + New Help Request
        </button>

        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🎫</div>
            <p>No tickets submitted yet.</p>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={function() { navigate("/help"); }}>
              Get Help Now
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Technician Notes</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(function(t) {
                    return (
                      <tr key={t._id}>
                        <td style={{ fontWeight: 600, color: "#006747" }}>
                          #{t._id.slice(-6).toUpperCase()}
                        </td>
                        <td>{t.category}</td>
                        <td>{t.issue}</td>
                        <td>{t.priority}</td>
                        <td>{t.status}</td>
                        <td>{t.technicianNotes || "—"}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyTickets;