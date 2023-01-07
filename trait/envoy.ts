import { Deployment, merge, StatefulSet } from "../mod.ts";
import { relativePath, readConfigData, generateName } from "./gen-config-map.ts"

type T = Deployment;

const envoyConfigMap = generateName("envoy-config-dd-apm-otel", readConfigData(relativePath(import.meta.url, "files")));

const patch: T = {
  spec: {
    selector: {},
    template: {
      spec: {
        initContainers: [
          {
            name: "ec2-metadata",
            image: "370025973162.dkr.ecr.us-east-2.amazonaws.com/curlimages/curl:7.86.0",
            imagePullPolicy: "IfNotPresent",
            command: [ '/bin/sh'],
            args: [
              "-c",
              `curl http://169.254.169.254/latest/meta-data/placement/availability-zone/ > /etc/ec2-metadata/availability-zone
              cat /etc/ec2-metadata/availability-zone | rev | cut -c2- | rev > /etc/ec2-metadata/region
              sed "s/NODE_IP/$NODE_IP/" /etc/envoy/envoy.yaml | sed "s/SERVICE_NAME/$SERVICE_NAME/" > /etc/ec2-metadata/envoy.yaml`,
            ],
            env: [
              {
                name: "NODE_IP",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "status.hostIP"
                  }
                }
              },
              {
                name: "SERVICE_NAME",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "metadata.labels['app']"
                  }
                }
              }
            ],
            volumeMounts: [
              {
                name: "ec2-metadata",
                mountPath: "/etc/ec2-metadata"
              },
              {
                name: "envoy-config",
                mountPath: "/etc/envoy",
                readOnly: true
              }
            ]
          }
        ],
        containers: [
          {
            name: "envoy",
            image: "370025973162.dkr.ecr.us-east-2.amazonaws.com/envoy:v1.13.1",
            imagePullPolicy: "IfNotPresent",
            command: ["/bin/bash"],
            resources: {
              limits: { cpu: "500m" },
              requests: { cpu: "100m" },
            },
            args: [
              "-c",
              `AZONE=$(cat /etc/ec2-metadata/availability-zone)
              REGION=$(cat /etc/ec2-metadata/region)
              exec envoy \\
              --config-path /etc/ec2-metadata/envoy.yaml \\
              --config-yaml "{node: {id: $ENVOY_NODE_ID, cluster: \${ENVOY_CLUSTER_NAME_ANNOTATION:=$ENVOY_CLUSTER_NAME}, locality: {region: $REGION, zone: $AZONE}}, stats_config: {stats_tags: [{tag_name: service, fixed_value: \${ENVOY_CLUSTER_NAME_ANNOTATION:=$ENVOY_CLUSTER_NAME}}]}}" \\
              --parent-shutdown-time-s 15 --drain-time-s 10`,
            ],
            lifecycle: {
              preStop: {
                exec: {
                  command: [
                    "sh",
                    "-c",
                    "wget -qO- --post-data='' http://localhost:9901/healthcheck/fail && while [ $(curl -s localhost:9901/stats | grep 'http.ingress.downstream_cx_active: 0' | wc -l | xargs) -eq 0 ]; do sleep 1; done",
                  ],
                },
              },
            },
            env: [
              {
                name: "ENVOY_NODE_ID",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "metadata.name"
                  }
                }
              },
              {
                name: "ENVOY_CLUSTER_NAME",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "metadata.labels['app']"
                  }
                }
              },
              {
                name: "ENVOY_CLUSTER_NAME_ANNOTATION",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "metadata.annotations['control-plane-clustername']"
                  }
                }
              },
              {
                name: "DD_ENV",
                valueFrom: {
                  fieldRef: {
                    fieldPath: "metadata.annotations['environment']"
                  }
                }
              },
            ],
            volumeMounts: [
              {
                name: "envoy-config",
                mountPath: "/etc/envoy",
                readOnly: true
              },
              {
                name: "envoy-logs",
                mountPath: "/var/log/envoy",
              },
              {
                name: "envoy-runtime",
                mountPath: "/srv/runtime/current",
              },
              {
                name: "ec2-metadata",
                mountPath: "/etc/ec2-metadata",
              },
            ],
          },
        ],
        volumes: [
          {
            name: "envoy-config",
            configMap: {
              // TODO: the suffix comes from files/envoy.yaml
              name: 'envoy-config-dd-apm-otel-4544g5hmd8'
            }
          },
          {
            name: "envoy-logs",
            emptyDir: {}
          },
          {
            name: "envoy-runtime",
            emptyDir: {}
          },
          {
            name: "ec2-metadata",
            emptyDir: {}
          },
        ]
      },
    },
  },
};

export default (res: T) => {
  return merge(res, patch);
};
