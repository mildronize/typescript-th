---
sidebar_position: 1
---

# intro

- git
- jq/yq
- Azure CLI (`az`)

## google/zx

https://github.com/google/zx

Bash is great, but when it comes to writing scripts, people usually choose a more convenient programming language. JavaScript is a perfect choice, but standard Node.js library requires additional hassle before using. The `zx` package provides useful wrappers around `child_process`, escapes arguments and gives sensible defaults.

```js
#!/usr/bin/env zx

await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}`
```