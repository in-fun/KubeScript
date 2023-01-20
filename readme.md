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

https://user-images.githubusercontent.com/705652/211314587-d5ed7bb2-3e28-4afe-960f-c0b26e0fd7a4.mov


## Quickstart

### Prerequisites

1. Install deno by following
   [the official guide](https://deno.land/manual@v1.28.1/getting_started/installation).
2. Install `KubeScript` by running the following command.

   ```bash
   deno install --unstable -A --root /usr/local -n ks https://deno.land/x/kube_script/main.ts
   ```

### Quick demo

You can try `KubeScript` without writing any code.

```bash
ks https://deno.land/x/kube_script/example/web/mod.ts
```

### A full example

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

## FAQ
1. Kubernetes resource manifests are declarative, why adding a scripting layer?

   I agree declarative style is preferable, if the problem domain is not complex. But when things goes to some level of complexity, all so called declarative solution turns out to be procedural or requires procedural style hacks. I will give an example to illustrate it below.
   
   This is a [helm manifest](https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/templates/argocd-server/deployment.yaml) for argocd-server deployment. As we can see, it uses procedural style statements including for loop (range), and if-else branching. The end result is mixing 2 languages in one: yaml and mustache; so it's even more complicated than a scripting language.

   Our opinion is that real-world kubernetes manifests are so complex, that a fully declarative style of writing is almost impossible. On the other hand, procedural style is more flexible, easier to maintain, thus better.

1. Why use deno instead of node.js?
 
   Deno is more developer friendly than node.js. For example, deno resolves dependencies on the fly, so no `npm install` any more.

1. How does KubeScript comopare to other solutions?

   We have summarized that in [this doc](doc/comparison.md).
