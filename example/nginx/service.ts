import { Service } from "./deps.ts";
import labels from "./labels.ts";

const name = "nginx";
const res: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    name,
  },
  spec: {
    clusterIP: "None",
    selector: labels,
    ports: [
      { port: 80 },
    ],
  },
};

export default res;
