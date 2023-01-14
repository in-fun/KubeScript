import { generateName, k8s, readConfigData, relativePath } from "./deps.ts";
import labels from "./labels.ts";

const dir = relativePath(import.meta.url, "config");
const data = readConfigData(dir);
const name = generateName(labels.app, data);

const res: k8s.V1ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: name,
    labels,
  },
  data: data,
};

export default res;
