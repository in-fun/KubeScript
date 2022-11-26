import * as k8s from 'npm:@kubernetes/client-node';

export * as k8s from 'npm:@kubernetes/client-node';
export * as yaml from "https://deno.land/std@0.165.0/encoding/yaml.ts"; // or 'npm:yaml'
export type Deployment = k8s.V1Deployment;
export type Service = k8s.V1Service;
export type StatefulSet = k8s.V1StatefulSet;

export type EnvType = 'staging' | 'production'
export const env = Deno.env.get("env") as EnvType || 'staging'

import {deepmerge} from 'https://deno.land/x/deepmergets@v4.2.2/dist/deno/mod.ts';

export const merge = deepmerge;
