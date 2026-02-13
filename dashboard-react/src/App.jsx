import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

const API = "http://localhost:3000";

export default function App() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadStores() {
    const res = await fetch(`${API}/stores`);
    const data = await res.json();
    setStores(data);
  }

  async function createStore() {
    setLoading(true);
    await fetch(`${API}/stores`, { method: "POST" });
    await loadStores();
    setLoading(false);
  }

  async function deleteStore(id) {
    await fetch(`${API}/stores/${id}`, { method: "DELETE" });
    await loadStores();
  }

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          midtoneColor: 0xff00b4,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ minHeight: "100vh", padding: 40 }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Store Provisioning Dashboard</h1>

        <button
          onClick={createStore}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#fff",
            color: "#000",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          {loading ? "Provisioning..." : "Create New Store"}
        </button>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
          }}
        >
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Status</th>
              <th align="left">Domain</th>
              <th align="left">Created</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.status}</td>
                <td>
                  <a
                    href={`http://${s.domain}`}
                    target="_blank"
                    style={{ color: "#ff00b4" }}
                  >
                    {s.domain}
                  </a>
                </td>
                <td>{new Date(s.created).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => deleteStore(s.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stores.length === 0 && <p>No stores yet</p>}
      </div>
    </div>
  );
}





