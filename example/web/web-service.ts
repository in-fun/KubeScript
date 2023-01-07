import { env, WebServiceBuilder, WebService } from "./deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const container = "nginx";

const res: WebService = WebServiceBuilder.create(container, "nginx:1.7.9", replicas[env])
  .withPorts(container, [{ containerPort: 80 }])
  .withServicePorts([{ port: 80 }]);

export default res;
