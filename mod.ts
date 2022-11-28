import { k8s, object_hash } from "./deps.ts";

export { deepmerge as merge, k8s, url, yaml } from "./deps.ts";

export type Deployment = k8s.V1Deployment;
export type Service = k8s.V1Service;
export type StatefulSet = k8s.V1StatefulSet;
export type ConfigMap = k8s.V1ConfigMap;

export type EnvType = "staging" | "production";
export const env = Deno.env.get("env") as EnvType || "staging";

export const hash = object_hash.default;
