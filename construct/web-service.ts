import datadog from "../trait/datadog.ts";
import commonEnv from "../trait/common-env.ts";
import {
  ContainerPort,
  Deployment,
  Service,
  ServicePort,
  EnvVar,
  envoy,
  env,
  findContainer,
  withContainerEnv,
} from "./deps.ts";

import { yaml } from "../deps.ts";
import { relativePath } from "../trait/gen-config-map.ts";

export class WebService {
  deployment!: Deployment;
  service!: Service;
  customResources?: unknown[];

  constructor(deployment: Deployment, service: Service, customResources?: unknown[]) {
    this.deployment = deployment
    this.service = service
    this.customResources = customResources
  }
}

export class WebServiceBuilder {
  deployment!: Deployment;
  service!: Service;
  customResources?: unknown[];
  monitorName?: string;

  public build(): WebService {
    return new WebService(this.deployment, this.service, this.customResources)
  }

  public static create(name: string, image: string, replica: number): WebServiceBuilder {
    const labels = { app: name }
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
            }],
          },
        },
      },
    }

    const service: Service = {
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: name,
        annotations: {
          "environment": env
        },
        labels: labels,
      },
      spec: {
        clusterIP: "None",
        selector: labels,
      },
    }

    return new WebServiceBuilder(deployment, service)
  }

  private constructor(deployment: Deployment, service: Service) {
    this.deployment = deployment
    this.service = service
  }

  withNamespace(namespace: string): WebServiceBuilder {
    this.service.metadata!.namespace = namespace;
    this.deployment.metadata!.namespace = namespace;
    return this
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
    return this
  }

  withServicePorts(ports: Array<ServicePort>): WebServiceBuilder {
    this.service.spec!.ports = ports;
    return this
  }

  withMonitorName(monitorName: string): WebServiceBuilder {
    this.monitorName = monitorName;
    return this;
  }

  withEnvoy(): WebServiceBuilder {
    return this.withDeployment(envoy(this.deployment))
  }

  withDatadog(): WebServiceBuilder {
    if (!this.monitorName) {
      throw new Error(`monitor name ${this.monitorName} is not defined`);
    }
    const mergedDeployment = datadog(this.deployment, this.monitorName);
    return this.withDeployment(mergedDeployment)
  }

  withDeployment(deployment: Deployment): WebServiceBuilder {
    this.deployment = deployment;
    return this
  }

  withService(service: Service): WebServiceBuilder {
    this.service = service;
    return this
  }

  withConsul(): WebServiceBuilder {
    this.service.metadata!.annotations!["consul.hashicorp.com/service-name"] = this.monitorName!;
    return this
  }

  withCommonEnv(container: string): WebServiceBuilder {
    return this.withDeployment(commonEnv(this.deployment, container))
  }

  withArgs(container: string, args: Array<string>): WebServiceBuilder {
    const target = findContainer(this.deployment, container);
    target.args = args;
    return this
  }

  withCustomResource(path: string): WebServiceBuilder {
    console.log(relativePath(import.meta.url, path));
    const content = Deno.readTextFileSync(path);
    const resources = this.customResources ?? [];
    resources.push(yaml.parse(content));
    this.customResources = resources;
    return this;
  }

}
