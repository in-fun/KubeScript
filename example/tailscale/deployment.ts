import { Deployment, env } from "./deps.ts";
import labels from "./labels.ts";

const replicas = {
  staging: 1,
  production: 2,
};

const name = labels.app;
const image = "ghcr.io/tailscale/tailscale:latest";

const res: Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name,
    labels,
  },
  spec: {
    selector: { matchLabels: labels },
    replicas: replicas[env],
    template: {
      metadata: { labels },
      spec: {
        containers: [{
          name: name,
          image: image,
          command: ["/bin/sh"],
          args: [
            /* For debug
            '/bin/sleep',
            'infinity',
            // 'tail -f /dev/null',
            */
            "-c",
            `tailscaled --tun=userspace-networking &
             tailscale up --advertise-exit-node & sleep infinity
             `,
          ],
          env: [
            {
              name: "TS_USERSPACE",
              value: "true",
            },
          ],
        }],
      },
    },
  },
};

export default res;