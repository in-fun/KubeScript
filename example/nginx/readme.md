## Nginx example

### Deployment

1. Preview the resources.
   ```bash
   ks example/nginx
   ```
1. View the differences.
   ```bash
   ks example/nginx | k -f - diff
   ```
1. Apply the changes.
   ```bash
   ks example/nginx | k -f - apply
   ```

### Test

1. Port forward to the k8s.
   ```bash
   k port-forward service/nginx 8080:80
   ```
1. Connect to the service by opening `localhost:8080/`.
1. Update the config file `default.conf`, and change the upstream host. You can
   also do it via a command
   `sed -i bak "s/google.com/baidu.com/g" default.conf`.
1. Redeploy the example, and refresh that page at `localhost:8080/`, to see the
   changes.
