import * as k8s from 'npm:@kubernetes/client-node';

export * as k8s from 'npm:@kubernetes/client-node';
export * as yaml from 'https://deno.land/std/encoding/yaml.ts'; // or 'npm:yaml'
export type Deployment = k8s.V1Deployment;
export type Service = k8s.V1Service;

export type EnvType = 'staging' | 'production'
export const env = Deno.env.get("env") as EnvType || 'staging'
