import { Deployment, Container, EnvVar } from "../mod.ts";

export function findContainer(deployment: Deployment, container: string): Container {
  const containers = deployment.spec!.template.spec!.containers;
  const target = containers.find((c) => c.name == container);
  if (target) {
    return target
  } else {
    throw new Error(`container ${container} is not defined`);
  }
}

export function withContainerEnv(deployment: Deployment, container: string, appendEnvs: EnvVar[]): Deployment {
  const copy: Deployment = JSON.parse(JSON.stringify(deployment));
  const target = findContainer(copy, container);
  const envs: EnvVar[] = target.env ?? [];
  target.env = appendEnvs.concat(envs);
  return copy
}