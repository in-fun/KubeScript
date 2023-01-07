import { Deployment, merge, StatefulSet, env } from "../mod.ts";

type T = Deployment;

export default (res: T, datadogName: string) => {
  const patch: T = {
    metadata: {
      labels: {
        "tags.datadoghq.com/env": env,
        "tags.datadoghq.com/service": datadogName
      }
    },
    spec: {
      selector: {},
      template: {
        metadata: {
          annotations: {
            "ad.datadoghq.com/envoy.logs": `[{
              "source": "envoy",
              "service": "${datadogName}",
              "log_processing_rules": [{
                "type": "exclude_at_match",
                "name": "exclude_envoy_startup_logs",
                "pattern" : "^\\\\[[^\\\\]]+\\\\]\\\\[\\\\d\\\\]\\\\[(info|warning)\\\\]"
              }]
            }]`,
            "ad.datadoghq.com/tags": `{"service": "${datadogName}", "TUBI_PLATFORM": "kubernetes"}`,
            "control-plane-clustername": datadogName,
            "environment": env,
            "iam.amazonaws.com/role": `arn:aws:iam::370025973162:role/terraform/ec2/roles/tubi-${res.metadata?.name}-${env}`
          },
          labels: {
            "tags.datadoghq.com/env": env,
            "tags.datadoghq.com/service": datadogName
          }
        }
      }
    }
  }
  return merge(res, patch);
}

