import deployment from "./deployment.ts";
import service from "./service.ts";
import configMap from "./config-map.ts";
import transformNamespace from "../../trait/namespace.ts";

const namespace = "default";

export default transformNamespace(namespace)([
  deployment,
  service,
  configMap,
]);
