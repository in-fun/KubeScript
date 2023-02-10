## Install
Install flux following [this guide](https://fluxcd.io/flux/gitops-toolkit/source-watcher/). Note that the commands are adjusted.
1. Create the working directory with
   ```shell
   DIR=agent/manifests/flux
   mkdir -p $DIR
   cd $DIR
   ```
1. Export manifests of flux installation for review.
   ```shell
   flux install \
    --namespace=flux-system \
    --network-policy=false \
    --export \
    > agent/manifests/flux/flux-system.yml
    ```
1. Apply the manifests.
   ```shell
   kubectl apply -f agent/manifests/flux/flux-system.yml
   ```

1. Create a git source.
   ```shell
   flux create source git podinfo \
    --url=https://github.com/stefanprodan/podinfo \
    --branch=master \
    --interval=30s \
    --export > agent/manifests/flux/podinfo-source.yaml
   ```

1. Create a kustomization manifest.
   ```shell
   flux create kustomization podinfo \
    --target-namespace=default \
    --source=podinfo \
    --path="./kustomize" \
    --prune=true \
    --interval=5m \
    --export > agent/manifests/flux/podinfo-kustomization.yaml
   ```

1. Install Weave GitOps
   ```shell
    PASSWORD="123456"
    gitops create dashboard ww-gitops \
    --password=$PASSWORD \
    --export > agent/manifests/flux/weave-gitops-dashboard.yaml
   ```

1. Expose the GitOps dashboard.
   ```shell
   kubectl port-forward svc/ww-gitops-weave-gitops -n flux-system 9001:9001
   ```
