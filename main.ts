#!/usr/bin/env -S deno run --unstable --allow-net --allow-read --allow-env

import { yaml } from "./mod.ts";

let url = Deno.args[0];
if (url.search(":") < 0) {
  // a local path
  const path = Deno.realPathSync(url);
  const isDir = Deno.statSync(path).isDirectory;
  const modPath = isDir ? `${path}/mod.ts` : path;
  url = `file://${modPath}`;
}
const module = await import(url);
const objects = module.default;
for (const object of objects) {
  const s = yaml.stringify(object as Record<string, unknown>);
  console.log(s);
  console.log("---");
}
