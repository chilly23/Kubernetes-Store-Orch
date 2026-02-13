import express from "express";
import { exec } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const DB_FILE = "./stores.json";
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");

function readStores() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeStores(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/stores", (req, res) => {
  res.json(readStores());
});

app.post("/stores", (req, res) => {
  const id = "store-" + uuidv4().slice(0, 8);
  const domain = `${id}.localhost`;

  const stores = readStores();
  stores.push({ id, domain, status: "Provisioning", created: new Date().toISOString() });
  writeStores(stores);

  const cmd = `helm install ${id} ../helm/store-chart \
    --set storeName=${id} \
    --set domain=${domain} \
    --namespace ${id} --create-namespace`;

  exec(cmd, (err) => {
    const s = readStores();
    const idx = s.findIndex(x => x.id === id);
    if (err) {
      s[idx].status = "Failed";
    } else {
      s[idx].status = "Ready";
    }
    writeStores(s);
  });

  res.json({ id, domain, status: "Provisioning" });
});

app.delete("/stores/:id", (req, res) => {
  const { id } = req.params;
  exec(`helm uninstall ${id} -n ${id} && kubectl delete ns ${id}`, () => {});
  let stores = readStores();
  stores = stores.filter(s => s.id !== id);
  writeStores(stores);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
