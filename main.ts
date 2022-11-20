#!/usr/bin/env -S deno run --unstable --allow-net --allow-read --allow-env

import {yaml} from './mod.ts'
// import objects from './example/nginx/mod.ts'

const path = Deno.realPathSync(Deno.args[0])
const isDir = Deno.statSync(path).isDirectory
const modPath = isDir ? `${path}/mod.ts` : path
const module = await import(`file://${modPath}`)
const objects = module.default
for (const object of objects) {
    const s = yaml.stringify(object as Record<string, unknown>)
    console.log(s)
    console.log('---')
}