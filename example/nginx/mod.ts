import deployment from "./deployment.ts";
import service from "./service.ts";
import configMap from './config-map.ts';

export default [
  deployment,
  service,
  configMap
];
