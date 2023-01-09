import { env, WebServiceBuilder, WebService, EnvVar, Probe, ResourceRequirements, VolumeMount } from "./deps.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const container = "ranking";
const monitorName = "ranking-k8s";
const initialDelaySeconds = 20;
const timeoutSeconds = 5;

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

const annotations = {
  "consul.hashicorp.com/service-name": monitorName
}

const readinessProbe: Probe = {
  exec: {
    command: [
      "/bin/grpc_health_probe",
      "-addr=:50051",
      "-service=ranking",
    ]
  },
  initialDelaySeconds: initialDelaySeconds,
  timeoutSeconds: timeoutSeconds,
}

const resourceRequirements: ResourceRequirements = {
  limits: {
    "cpu": "4000m",
    "memory": "8Gi",
  },
  requests: {
    "cpu": "2000m",
    "memory": "4Gi",
  }
}

const volumeMounts: VolumeMount[] = [
  {
    mountPath: "/tmp",
    name: "tmp",
  }
]

const livenessProbe: Probe = JSON.parse(JSON.stringify(readinessProbe));

const res: WebService = WebServiceBuilder
  .create(container, "370025973162.dkr.ecr.us-east-2.amazonaws.com/ranking:2.13.5", replicas[env])
  .withNamespace("staging-delphi")
  .withMonitorName(monitorName)
  .withServicePorts([{ port: 50051 }])
  .withDatadogFullAnnotation()
  .withServiceAnnotations(annotations)
  .withEnv(container, envs)
  .withCommonEnv(container)
  .withArgs(container, args)
  .withReadinessProbe(container, readinessProbe)
  .withLivenessProbe(container, livenessProbe)
  .withCommonLifeCycle(container)
  .withResourceRequirements(container, resourceRequirements)
  .withVolumeMount(container, volumeMounts)
  .withEnvoy()
  .withCustomResource(`example/ranking/files/pod-disruptive-budget-${env}.yaml`)
  .withCustomResource(`example/ranking/files/hpa-${env}.yaml`)
  .withCustomResource(`example/ranking/files/virtual-server-${env}.yaml`)
  .build();

export default res;
