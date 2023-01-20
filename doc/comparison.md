## Comparison to other solutions

All the solutions listed below share a common character: they generate
kubernetes manifests as yaml files. In other words, they are all compile-to-yaml
tools.

### Kustomize

[Kustomize](https://kustomize.io/) creates a domain specific language (DSL)
based on YAML, and calls it _Kustomization_. A kustomization (file) describes
how to generate or transform other
[Kubernetes Resource Model](https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/resource-management.md)
objects. Everything in Kustomize
[is a transformer](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/#everything-is-a-transformer).
The most commonly used transformer is
[patch](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/patches/).

With Kustomize, sometimes hacks are necessary to work around the limit of
existing transformers. In addition, since a kustomization file references other
YMAL resources or kustomization files, and each of them could be patched
elsewhere, the final result is actually determined by a transformer tree. In
real world complex kustomization file, we found it hard to comprehend and
maintain.

Instead of creating a DSL, KubeScript utilizes TypeScript to do the same job.
TypeScript is more expressive and more extendable than the _Kustomization DSL_.
In addition, we follow functional programming design in KubeScript, making
KubeScript code easy to read and understand. Furthermore, TypeScript has been
proved to be good at programming-in-the-large.

### cdk8s

[**cdk8s**](https://cdk8s.io/docs/latest/#importing-constructs-for-the-kubernetes-api)
is a software development framework for defining Kubernetes applications and
reusable abstractions using familiar programming languages. At the time of
writing, it supports TypeScript, Python, Java and Go. **cdk8s** apps are
structured as a tree of [constructs](https://github.com/aws/constructs).

_Compared to **cdk8s** (TypeScript), **KubeScript** is more lightweight, and
easier to use_.

1. **cdk8s** uses [constructs](https://github.com/aws/constructs) as the
   building blocks, and manages depedencies upon them. **KubeScript** does not
   reinvent the wheels here, and uses TypeScript modules to represent resources.
   Resource dependencies are then equivalent to module dependencies, that are
   handled by Deno natively without effort.
2. **cdk8s** runs on Node.js thus requires a package manager eg.
   [npm](https://www.npmjs.com/). To generate YMAL manifests, multpile commands
   have to be run, as we can see on
   [one official example of cdk8s](https://github.com/cdk8s-team/cdk8s/blob/master/examples/typescript/web-service/README.md).
   On the other hand, with **KubeScript** only one command like `ks example/web`
   suffices.

   ```shell
   yarn gen
   yarn install -L
   yarn build
   yarn synth
   ```

### Tanda

[Grafana Tanka](https://tanka.dev/) is a robust configuration utility for
Kubernetes cluster, powered by the [Jsonnet](https://jsonnet.org/) language.
Jsonnet is less well-known and less expressive than TypeScript.

### KusionStack

[KusionStack](https://kusionstack.io/) is a highly flexible programmable
technology stack to enable unified application delivery and operation. It aims
to help enterprises build an application-centric configuration management plane
and DevOps ecosystem.

KusionStack uses the KCL (Kusion Configuration Language) for configuration, but
[KCL](https://github.com/KusionStack/KCLVM) is still an early-stage language.

### KubeVela/Open Application Model

[KubeVela](https://kubevela.io/) is a modern software delivery platform that
makes deploying and operating applications across today's hybrid, multi-cloud
environments easier, faster and more reliable.

KubeVela is built on the [Open Application Model](https://oam.dev/), or OAM for
short. _OAM_ brings modular, extensible, and portable design for modeling
application deployment with higher level yet consistent API. This model is well
thought and designed, and there is even a spec of it. However, a spec could not
cover all use cases, so it comes with an addon mechanism.

As a reference implementation of OAM, KubeVela includes some addons for common
functionalities. But in a real world project, even a minor difference of the
requirements would make an addon unsuitable. Thus addons must be customized or
created. Unfortunately, the cost of
[making your own addon](https://kubevela.io/docs/platform-engineers/addon/intro)
is high.

On the other hand, KubeScript's reusable constructs are just TypeScript
functions or objects, it's easy to customize them for your needs.
