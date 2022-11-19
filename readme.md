## Introduction

`kube-script` is a *infrastructure as code* solution to k8s ops.

### Status

**Proof of Concept**

## Quickstart


1. Generate k8s yaml files via `./gen.ts example/nginx`.
2. Show diff from current settings via `env=production ./gen.ts example/nginx | kubectl diff -f -`.
3. Apply k8s resources via `env=production ./gen.ts example/nginx | kubectl apply -f -`.


