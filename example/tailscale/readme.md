## Deploy tailscale to Okteto

[Okteto](https://cloud.okteto.com/) offers free kubernetes environment for
users. We can use it to test tailscale.

### Steps

1. Install okteto by following its
   [installation guide](https://www.okteto.com/docs/getting-started/).
2. Generate an auth key on Tailscale, by following
   [this guide](https://tailscale.com/kb/1185/kubernetes/#setup). Then save the
   key somewhere for future references.
3. Deploy tailscale to Okteto. Note to replace the `$TS_KEY` with the auth key
   you got from Tailscale.
   ```shell
   KEY=$TS_KEY okteto deploy
   ```
4. After the previous command runs successfully, you can go to the
   [machines page](https://login.tailscale.com/admin/machines) to verified that
   a new node has connected to your tailnet.

### Notes

1. Please do not abuse this free kubernetes environment.
2. If you found that this node goes offline, it's probably put to sleep by
   Okteto due to
   [inactivity](https://www.okteto.com/docs/administration/cleanup/).
