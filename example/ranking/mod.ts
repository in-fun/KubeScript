import webService from "./web-service.ts";

export default [
  webService.deployment,
  webService.service,
  ... webService.customResources ? [webService.customResources!] : [],
];
