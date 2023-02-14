// deno-lint-ignore-file no-explicit-any
import {
  ContainerPort,
  Deployment,
  env,
  EnvVar,
  findContainer,
  Probe,
  ResourceRequirements,
  Service,
  ServicePort,
  VolumeMount,
  withContainerEnv,
} from "./deps.ts";

import { yaml } from "../deps.ts";

export class WebService {
  deployment!: Deployment;
  service!: Service;
  customResources?: unknown[];

  constructor(
    deployment: Deployment,
    service: Service,
    customResources?: unknown[],
  ) {
    this.deployment = deployment;
    this.service = service;
    this.customResources = customResources;
  }

  manifest(): any[] {
    const res: any[] = [this.service, this.deployment];
    (this.customResources ?? []).forEach((r) => res.push(r));
    return res;
  }
}

export class WebServiceBuilder {
  deployment!: Deployment;
  service!: Service;
  customResources?: unknown[];

  build(): WebService {
    return new WebService(this.deployment, this.service, this.customResources);
  }

  static create(
    name: string,
    image: string,
    replica: number,
  ): WebServiceBuilder {
    const labels = { app: name };
    const deployment: Deployment = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: name,
        annotations: {
          "environment": env,
        },
        labels: labels,
      },
      spec: {
        selector: { matchLabels: labels },
        replicas: replica,
        template: {
          metadata: {
            labels: labels,
          },
          spec: {
            containers: [{
              name: name,
              image: image,
              imagePullPolicy: "IfNotPresent",
            }],
          },
        },
      },
    };

    const service: Service = {
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: name,
        annotations: {
          "environment": env,
        },
        labels: labels,
      },
      spec: {
        clusterIP: "None",
        selector: labels,
      },
    };

    return new WebServiceBuilder(deployment, service);
  }

  private constructor(deployment: Deployment, service: Service) {
    this.deployment = deployment;
    this.service = service;
  }

  withNamespace(namespace: string): WebServiceBuilder {
    this.service.metadata!.namespace = namespace;
    this.deployment.metadata!.namespace = namespace;
    return this;
  }

  withPorts(
    container: string,
    ports: Array<ContainerPort>,
  ): WebServiceBuilder {
    findContainer(this.deployment, container).ports = ports;
    return this;
  }

  withEnv(container: string, appendEnvs: Array<EnvVar>): WebServiceBuilder {
    this.deployment = withContainerEnv(this.deployment, container, appendEnvs);
    return this;
  }

  withServicePorts(ports: Array<ServicePort>): WebServiceBuilder {
    this.service.spec!.ports = ports;
    return this;
  }

  withDeployment(deployment: Deployment): WebServiceBuilder {
    this.deployment = deployment;
    return this;
  }

  withService(service: Service): WebServiceBuilder {
    this.service = service;
    return this;
  }

  withServiceAnnotations(
    appendAnnotations: { [key: string]: string },
  ): WebServiceBuilder {
    const annotations = this.service.metadata!.annotations ?? {};
    Object.entries(appendAnnotations).forEach((kv, _1, _2) =>
      annotations[kv[0]] = kv[1]
    );
    this.service.metadata!.annotations = annotations;
    return this;
  }

  withArgs(container: string, args: Array<string>): WebServiceBuilder {
    const target = findContainer(this.deployment, container);
    target.args = args;
    return this;
  }

  withReadinessProbe(container: string, probe: Probe): WebServiceBuilder {
    const target = findContainer(this.deployment, container);
    target.readinessProbe = probe;
    return this;
  }

  withLivenessProbe(container: string, probe: Probe): WebServiceBuilder {
    const target = findContainer(this.deployment, container);
    target.livenessProbe = probe;
    return this;
  }

  withVolumeMount(
    container: string,
    appendVolumeMounts: VolumeMount[],
  ): WebServiceBuilder {
    const target = findContainer(this.deployment, container);
    const volumeMounts = target.volumeMounts ?? [];
    target.volumeMounts = appendVolumeMounts.concat(volumeMounts);
    return this;
  }

  withResourceRequirements(
    container: string,
    resourceRequirements: ResourceRequirements,
  ): WebServiceBuilder {
    findContainer(this.deployment, container).resources = resourceRequirements;
    return this;
  }

  withCustomResource(path: string): WebServiceBuilder {
    const content = Deno.readTextFileSync(path);
    const resources = this.customResources ?? [];
    resources.push(yaml.parse(content));
    this.customResources = resources;
    return this;
  }

  withDeploymentTransformer<T>(
    transformer: (d: Deployment, param?: T) => Deployment,
    param?: T,
  ): WebServiceBuilder {
    this.deployment = transformer(this.deployment, param);
    return this;
  }

  withServiceTransformer<T>(
    transformer: (d: Service, param?: T) => Service,
    param?: T,
  ): WebServiceBuilder {
    this.service = transformer(this.service, param);
    return this;
  }
}
