import { env, WebService } from "./deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const container = "nginx";

const res: WebService = new WebService(container, "nginx:1.7.9", replicas[env])
  .setContainerPorts(container, [{ containerPort: 80 }])
  .setServicePorts([{ port: 80 }]);

export default res;
