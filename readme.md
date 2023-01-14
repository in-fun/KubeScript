<div align="center">
<p align="center">
<img width="256" alt="cover" src="doc/image/cover_photo.png"/>

**`KubeScript` is a DRY _infrastructure as code_ solution to Kubernetes DevOps**

<img width="400" alt="demo" src="doc/image/service.ts.png"/>
</p>
</div>

<hr/>

### Status

**Beta**

### Features

- [No yaml files](https://noyaml.com/).
- No boilerplate or hack.
- Type based code completion with Typescript.
- Safe sandbox with Deno.

## Quickstart

### Prerequisites

1. Install deno by following
   [the official guide](https://deno.land/manual@v1.28.1/getting_started/installation).
2. Install `KubeScript` by running the following command.

   ```bash
   deno install --unstable -A --root /usr/local -n ks https://deno.land/x/kube_script@v0.2.0/main.ts
   ```

### Quick demo

You can try `KubeScript` without writing any code.

```bash
ks https://deno.land/x/kube_script/example/web/mod.ts
```

### Deploy Nginx

1. Checkout this project.
   ```bash
   git clone https://github.com/in-fun/KubeScript.git
   ```

1. Generate k8s yaml files.

   ```bash
   ks example/nginx
   ```
1. Show diff from current settings.

   ```bash
   ks example/nginx --env production | kubectl diff -f -
   ```
1. Apply k8s resources.

   ```bash
   ks example/nginx --env production | kubectl apply -f -
   ```
