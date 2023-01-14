import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";

Deno.test("ks test", async () => {
  const cmd = ["./ks", "example/nginx"];

  // create subprocess
  const p = Deno.run({ cmd });

  // await its completion
  const status = await p.status();
  assertEquals(status.code, 0);
  p.close();
});

Deno.test("url test", () => {
  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");
});
