FROM golang:1.19 as builder

WORKDIR /src

COPY go.mod /src/go.mod
COPY go.sum /src/go.sum

RUN go mod download

# Perform the build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /dist/gitops .

# Deno image
# ARG DENO_VERSION=1.29.2
# ARG BIN_IMAGE=denoland/deno:bin-${DENO_VERSION}

# # FROM ${BIN_IMAGE} AS bin
# FROM denoland/deno:bin-1.29.2 AS bin

# Runtime env
# FROM alpine/git:v2.24.3
FROM denoland/deno:alpine-1.29.2
COPY --from=builder /dist/gitops /usr/local/bin/gitops

# Install deno
# COPY --from=bin /deno /bin/deno

RUN apk add --no-cache curl git
# Install KubeScript
RUN deno install --unstable -A --root /usr/local -n ks https://deno.land/x/kube_script/main.ts
