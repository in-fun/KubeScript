import { Deployment, env } from "../../deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const nginxLabels = { app: "nginx" };
const name = "nginx";
const nginx: Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: name,
    labels: nginxLabels,
  },
  spec: {
    selector: { matchLabels: nginxLabels },
    replicas: replicas[env],
    template: {
      metadata: { labels: nginxLabels },
      spec: {
        containers: [{
          name: "nginx",
          image: "nginx:1.7.9",
          ports: [{ containerPort: 80 }],
        }],
      },
    },
  },
};

export default nginx;
