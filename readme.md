## Introduction

`kube-script` is a *infrastructure as code* solution to k8s ops.

### Status

**Proof of Concept**

### Features

* [No yaml files](https://noyaml.com/).
* Type safe with Typescript.
* Safe sandbox with Deno.

## Quickstart

### Prerequisites


1. Install deno by following [the official guide](https://deno.land/manual@v1.28.1/getting_started/installation).
2. Install `kube-script` by running the following command.

   ```bash
   deno install --unstable -A --root /usr/local -n ks https://deno.land/x/kube_script@v0.1.0/main.ts
   ```
### Quick demo

You can try `kube-script` without writing any code.
```bash
ks https://deno.land/x/kube_script/example/nginx/mod.ts
```

### Deploy Nginx

1. Checkout this project.
   ```bash
   git clone https://github.com/in-fun/kube-script.git
   ```

1. Generate k8s yaml files.

   ```bash
   ks example/nginx
   ```
2. Show diff from current settings.

   ```bash
   env=production ks example/nginx | kubectl diff -f -
   ```
3. Apply k8s resources.

   ```bash
   env=production ks example/nginx | kubectl apply -f -
   ```


