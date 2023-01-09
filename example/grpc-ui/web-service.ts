import { env, WebServiceBuilder, WebService, EnvVar } from "./deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const container = "grpc-ui";

const annotations = {
  "consul.hashicorp.com/service-sync": "false",
}

const res: WebService = WebServiceBuilder
  .create(container, "lilac/grpcox:v1.0.0", replicas[env])
  .withNamespace("staging-delphi")
  .withMonitorName(container)
  .withServicePorts([{ port: 6969 }])
  .withDatadogSlimAnnotation()
  .withServiceAnnotations(annotations)
  .withCustomResource(`example/grpc-ui/files/virtual-server-${env}.yaml`)
  .build();

export default res;
