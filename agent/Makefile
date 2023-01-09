EXE := podman
TAG := ghcr.io/in-fun/ks-agent:0.1.1

.PHONY: dep default image test push

default: image push

dep:
	deno install --unstable -A --root /usr/local -n ks https://deno.land/x/kube_script/main.ts

image:
	$(EXE) build . -t $(TAG)

test:
	go test .

push:
	$(EXE) push $(TAG)