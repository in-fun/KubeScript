import { Deployment, env, EnvVar } from "../mod.ts";
import { withContainerEnv } from "../util/util.ts";

type T = Deployment;

export default (res: T, container: string) => {
  const envs: EnvVar[] = [
    {
      name: "DD_ENV",
      value: env,
    },
    {
      name: "TUBI_ENVIRONMENT",
      value: env,
    },
    {
      name: "TUBI_PLATFORM",
      value: "kubernetes",
    },
    {
      name: "DD_AGENT_HOST",
      valueFrom: {
        fieldRef: {
          fieldPath: "status.hostIP"
        }
      }
    },
    {
      name: "POD_NAME",
      valueFrom: {
        fieldRef: {
          fieldPath: "metadata.name"
        }
      }
    },
    {
      name: "DD_SERVICE",
      valueFrom: {
        fieldRef: {
          fieldPath: "metadata.labels['tags.datadoghq.com/service']"
        }
      }
    },
    {
      name: "KUBERNETES_LABEL_APP",
      valueFrom: {
        fieldRef: {
          fieldPath: "metadata.labels['app']"
        }
      }
    }
  ];
  return withContainerEnv(res, container, envs)
}