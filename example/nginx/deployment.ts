import { Deployment, env, withDebugger } from "./deps.ts";
import labels from "./labels.ts";
import configMap from './config-map.ts'

const replicas = {
  staging: 1,
  production: 2,
};

const name = labels.app;
const image = "nginx:1.7.9";
const configMapName = configMap.metadata?.name;

const configVolume = "configs";

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
          volumeMounts: [{ name: configVolume, mountPath: "/etc/nginx/conf.d" }],
        }],
        volumes: [{ name: configVolume, configMap: { name: configMapName } }],
      },
    },
  },
};

export default env == 'staging' ? withDebugger(res) : res;
