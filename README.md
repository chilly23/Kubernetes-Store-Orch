# Kubernetes Store Orchestrator (Urumi Round 1)

This is a small store provisioning platform that runs on local Kubernetes and also on a VPS using the same Helm charts. There is a Node backend that provisions stores, a React dashboard to control them, and a Helm chart that deploys WordPress + MariaDB per store in its own namespace.

## Local setup

You need Docker, kubectl, Helm, and a local cluster like k3s, kind, k3d, or minikube. Make sure `kubectl get nodes` works.

Set kubeconfig if you are on k3s:

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

Start the backend:

cd backend
npm install
node index.js


This starts the API on http://localhost:3000

Start the dashboard:

cd dashboard-react
npm install
npm run dev


Open http://localhost:5173

## Production-like setup (VPS with k3s)

Install k3s on the VPS. Copy this repo. Use the same Helm chart. Only change values like domain, ingress, and storage class in a values-prod.yaml. The flow stays the same. The backend still talks to the cluster and Helm still installs charts.

## How to create a store and place an order

Open the dashboard at http://localhost:5173 and click Create Store. The backend creates a namespace and installs the Helm chart. Wait until the store shows Ready. Open the store URL. Finish the WordPress setup, install WooCommerce, add a product, add it to cart, and checkout using a dummy or COD method. You can see the order in WooCommerce admin. To delete a store, use Delete in the dashboard and the namespace and all resources are removed.

## What is in this repo

There is a Node backend API, a React dashboard, and a Helm chart. The Helm chart includes WordPress, MariaDB, Services, Ingress, Secrets, and PVCs. There are separate values for local and production.

## System design and tradeoffs

Each store runs in its own namespace for isolation and clean teardown. The backend is stateless and only orchestrates Helm, so it can scale horizontally. The database uses a PVC for persistence. Store creation is safe to retry at the namespace and Helm release level. If something fails, you can delete and recreate cleanly. For production, the main changes are DNS, ingress, storage class, and secret strategy. The charts stay the same and Helm handles upgrades and rollbacks.






