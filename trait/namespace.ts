import { k8s } from "../deps.ts";

interface Resource {
  "metadata"?: k8s.V1ObjectMeta;
}

export default (namespace: string) =>
(resources: Array<Resource>): Array<Resource> => {
  return resources.map((resource) => {
    if (!resource.metadata) {
      resource.metadata = {};
    }
    resource.metadata.namespace = namespace;
    return resource;
  });
};
