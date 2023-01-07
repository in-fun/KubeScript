import { env, WebServiceBuilder, WebService, EnvVar } from "./deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const container = "ranking";

const envs: Array<EnvVar> = [
  {
    name: "RS_ROLE",
    value: "api",
  }
]

const args: Array<string> = [
  "-J-XX:InitialRAMPercentage=25.0",
  "-J-XX:MaxRAMPercentage=80.0",
  "-J-XX:+PreserveFramePointer",
  "-Drs.api.ports.grpc=8000",
]

const res: WebService = WebServiceBuilder
  .create(container, "370025973162.dkr.ecr.us-east-2.amazonaws.com/ranking:2.13.5", replicas[env])
  .withNamespace("staging-delphi")
  .withMonitorName("ranking-k8s")
  .withServicePorts([{ port: 50051 }])
  .withEnvoy()
  .withDatadog()
  .withConsul()
  .withEnv(container, envs)
  .withCommonEnv(container)
  .withArgs(container, args)
  .withCustomResource(`example/ranking/files/virtual-server-${env}.yaml`)
  .build();

export default res;
