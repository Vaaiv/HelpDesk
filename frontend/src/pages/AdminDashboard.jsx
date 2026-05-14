import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", technicianNotes: "", priority: "" });
  const [filter, setFilter] = useState("All");

  function fetchTickets() {
    API.get("/tickets/all")
      .then(function({ data }) {
        setTickets(data);
      })
      .catch(function() {
        alert("Failed to load tickets");
      })
      .finally(function() {
        setLoading(false);
      });
  }

  useEffect(function() {
    fetchTickets();
  }, []);

  function handleEdit(ticket) {
    setEditingId(ticket._id);
    setEditForm({
      status: ticket.status,
      technicianNotes: ticket.technicianNotes || "",
      priority: ticket.priority,
    });
  }

  async function handleUpdate(id) {
    try {
      await API.put("/tickets/" + id, editForm);
      setEditingId(null);
      fetchTickets();
    } catch (err) {
      alert("Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this ticket?")) return;
    try {
      await API.delete("/tickets/" + id);
      fetchTickets();
    } catch (err) {
      alert("Delete failed");
    }
  }

  const statuses = ["All", "Open", "In Progress", "Resolved", "Closed"];

  const filtered = filter === "All" ? tickets : tickets.filter(function(t) {
    return t.status === filter;
  });

  const counts = {
    total: tickets.length,
    open: tickets.filter(function(t) { return t.status === "Open"; }).length,
    progress: tickets.filter(function(t) { return t.status === "In Progress"; }).length,
    resolved: tickets.filter(function(t) { return t.status === "Resolved"; }).length,
  };

  return (
    <>
      <Navbar />
      <div className="page-wide">
        <div className="page-header">
          <h2>🛠️ Admin Dashboard</h2>
          <p>Manage all IT support tickets submitted by customers.</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <h4>Total Tickets</h4>
            <div className="stat-num">{counts.total}</div>
          </div>
          <div className="stat-card" style={{ borderColor: "#1565c0" }}>
            <h4>Open</h4>
            <div className="stat-num" style={{ color: "#1565c0" }}>{counts.open}</div>
          </div>
          <div className="stat-card" style={{ borderColor: "#f57f17" }}>
            <h4>In Progress</h4>
            <div className="stat-num" style={{ color: "#f57f17" }}>{counts.progress}</div>
          </div>
          <div className="stat-card" style={{ borderColor: "#2e7d32" }}>
            <h4>Resolved</h4>
            <div className="stat-num" style={{ color: "#2e7d32" }}>{counts.resolved}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {statuses.map(function(s) {
            return (
              <button
                key={s}
                className={"btn btn-sm " + (filter === s ? "btn-primary" : "btn-gold")}
                onClick={function() { setFilter(s); }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🎫</div>
            <p>No tickets found.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Category</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(function(t) {
                    return (
                      <tr key={t._id}>
                        <td style={{ fontWeight: 600, color: "#006747" }}>
                          #{t._id.slice(-6).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{t.userName}</div>
                          <div style={{ fontSize: "0.78rem", color: "#888" }}>{t.userEmail}</div>
                        </td>
                        <td>{t.category}</td>
                        <td style={{ fontSize: "0.85rem" }}>{t.issue}</td>
                        <td>
                          {editingId === t._id ? (
                            <select
                              value={editForm.priority}
                              onChange={function(e) { setEditForm({ ...editForm, priority: e.target.value }); }}
                            >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                            </select>
                          ) : (
                            t.priority
                          )}
                        </td>
                        <td>
                          {editingId === t._id ? (
                            <select
                              value={editForm.status}
                              onChange={function(e) { setEditForm({ ...editForm, status: e.target.value }); }}
                            >
                              <option>Open</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                              <option>Closed</option>
                            </select>
                          ) : (
                            t.status
                          )}
                        </td>
                        <td style={{ fontSize: "0.82rem" }}>
                          {editingId === t._id ? (
                            <input
                              value={editForm.technicianNotes}
                              onChange={function(e) { setEditForm({ ...editForm, technicianNotes: e.target.value }); }}
                              placeholder="Add notes..."
                            />
                          ) : (
                            t.technicianNotes || "—"
                          )}
                        </td>
                        <td style={{ fontSize: "0.82rem" }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem" }}>
                            {editingId === t._id ? (
                              <>
                                <button className="btn btn-primary btn-sm" onClick={function() { handleUpdate(t._id); }}>
                                  Save
                                </button>
                                <button className="btn btn-sm" style={{ background: "#eee" }} onClick={function() { setEditingId(null); }}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-gold btn-sm" onClick={function() { handleEdit(t); }}>
                                  Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={function() { handleDelete(t._id); }}>
                                  Del
                                </button>
                              </>
                            )}
                          </div>
                        </td>
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

export default AdminDashboard;