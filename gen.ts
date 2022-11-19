#!/usr/bin/env -S deno run --allow-read --allow-env

import {yaml} from './deps.ts'
// import objects from './example/nginx/mod.ts'

const dir = Deno.args[0]
const module = await import(`./${dir}/mod.ts`)
const objects = module.default
for (const object of objects) {
    const s = yaml.stringify(object as Record<string, unknown>)
    console.log(s)
    console.log('---')
}