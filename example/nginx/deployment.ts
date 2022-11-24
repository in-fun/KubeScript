import { Deployment, env } from "./deps.ts";
import labels from "./labels.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const name = labels.app;
const image = "nginx:1.7.9";

const res: Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name,
    labels,
  },
  spec: {
    selector: { matchLabels: labels },
    replicas: replicas[env],
    template: {
      metadata: { labels },
      spec: {
        containers: [{
          name: "nginx",
          image: image,
          ports: [{ containerPort: 80 }],
        }],
      },
    },
  },
};

export default res;
