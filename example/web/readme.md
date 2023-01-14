## A minimal web service example

### Deployment

1. Preview the resources.
   ```bash
   ks example/web
   ```
1. View the differences.
   ```bash
   ks example/web | k -f - diff
   ```
1. Apply the changes.
   ```bash
   ks example/web | k -f - apply
   ```

### Test

1. Port forward to the k8s.
   ```bash
   k port-forward service/web 8080:80
   ```
1. Connect to the service by opening [this link](http://localhost:8080/).
