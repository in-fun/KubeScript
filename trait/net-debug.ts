import { Deployment, merge, StatefulSet } from "../mod.ts";

type T = Deployment | StatefulSet;
const patch: T = {
  spec: {
    selector: {},
    template: {
      spec: {
        shareProcessNamespace: true,
        containers: [
          {
            name: "netshoot",
            image: "nicolaka/netshoot",
            imagePullPolicy: "Always",
            securityContext: {
              capabilities: {
                add: [
                  "SYS_PTRACE",
                ],
              },
            },
            stdin: true,
            tty: true,
          },
        ],
      },
    },
  },
};

export default (res: T) => {
  return merge(res, patch);
};
