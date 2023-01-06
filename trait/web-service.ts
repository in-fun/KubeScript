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

  constructor(webService: string, image: string, replica: number) {
    const labels = { app: webService };
    this.deployment = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: webService,
        labels: labels,
      },
      spec: {
        selector: { matchLabels: { app: webService } },
        replicas: replica,
        template: {
          metadata: {
            labels: labels,
          },
          spec: {
            containers: [{
              name: webService,
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
        name: webService,
      },
      spec: {
        clusterIP: "None",
        selector: { app: webService },
      },
    };
  }

  withContainerPorts(
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

  withServicePorts(ports: Array<ServicePort>): WebService {
    this.service.spec!.ports = ports;
    return this;
  }
}
