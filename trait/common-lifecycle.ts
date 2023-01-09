import { Deployment, merge, StatefulSet, env } from "../mod.ts";
import { findContainer } from "../util/util.ts";

type T = Deployment;

export default (res: T, container: string) => {
  const target = findContainer(res, container);
  target.lifecycle = {
    preStop: {
      exec: {
        command: [
          "sh",
          "-c",
          `'while [ $(curl -s localhost:9901/stats | grep ''http.ingress.downstream_cx_active:
          0'' | wc -l | xargs) -eq 0 ]; do sleep 1; done'`,
        ]
      }
    }
  };
  return res
}