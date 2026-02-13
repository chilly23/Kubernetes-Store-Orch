import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

export default function App() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadStores() {
    const res = await axios.get(`${API}/stores`);
    setStores(res.data);
  }

  async function createStore() {
    setLoading(true);
    await axios.post(`${API}/stores`);
    await loadStores();
    setLoading(false);
  }

  async function deleteStore(id) {
    await axios.delete(`${API}/stores/${id}`);
    await loadStores();
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Store Provisioning Dashboard</h1>

        <button style={styles.createBtn} onClick={createStore} disabled={loading}>
          {loading ? "Provisioning..." : "Create New Store"}
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>URL</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  <span
                    style={{
                      ...styles.status,
                      ...(s.status === "Ready"
                        ? styles.ready
                        : s.status === "Failed"
                        ? styles.failed
                        : styles.provisioning),
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <a href={`http://${s.domain}`} target="_blank">
                    {s.domain}
                  </a>
                </td>
                <td>{new Date(s.created).toLocaleString()}</td>
                <td>
                  <button style={styles.deleteBtn} onClick={() => deleteStore(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stores.length === 0 && <p>No stores yet. Click "Create New Store".</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    background: "#111",
    padding: "32px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "1000px",
    boxShadow: "0 0 30px rgba(255,255,255,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  createBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  deleteBtn: {
    background: "#ff4d4d",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  ready: {
    background: "#00ff88",
    color: "#000",
  },
  failed: {
    background: "#ff4444",
    color: "#000",
  },
  provisioning: {
    background: "#ffaa00",
    color: "#000",
  },
};
