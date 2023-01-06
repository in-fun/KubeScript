import {
  ContainerPort,
  Deployment,
  merge,
  Service,
  ServicePort,
} from "../mod.ts";

export class WebService {
  deployment: Deployment;
  service: Service;

  constructor(name: string, image: string, replica: number) {
    const labels = { app: name };
    this.deployment = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: name,
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
    };

    this.service = {
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: name,
      },
      spec: {
        clusterIP: "None",
        selector: labels,
      },
    };
  }

  setContainerPorts(
    container: string,
    ports: Array<ContainerPort>,
  ): WebService {
    const containers = this.deployment.spec?.template.spec?.containers;
    const target = (containers ?? []).find((c) => c.name == container);
    if (target) {
      target.ports = ports;
    } else {
      throw new Error(`${container} is not defined`);
    }
    return this;
  }

  setServicePorts(ports: Array<ServicePort>): WebService {
    this.service.spec!.ports = ports;
    return this;
  }
}
