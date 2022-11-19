### Introduction
`kube-script` is a _infrastructure as code_ solution to k8s ops.

### Quickstart
1. Generate k8s yaml files via `./gen.ts example/nginx`.
2. Show diff from current settings, `env=production ./gen.ts example/nginx | kubectl diff -f -`.