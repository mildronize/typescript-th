# Intro to FP

<https://github.com/gcanti/fp-ts> -- Functional programming in TypeScript (8.6k ⭐️)

fp-ts is a library for typed functional programming in TypeScript.

## Cookbook

### Convert array into object

https://stackoverflow.com/questions/66962576/the-proper-fp-ts-way-to-convert-array-into-object

```typescript
import * as A from 'fp-ts/ReadonlyArray'
import * as R from 'fp-ts/ReadonlyRecord'
import { pipe } from 'fp-ts/function'

const arrayToRecord = <A>(
  items: ReadonlyArray<A>,
  keyGetter: (i: A) => string,
): Readonly<Record<string, A>> =>
  pipe(
    items,
    A.reduce({}, (acc, item) => pipe(acc, R.upsertAt(keyGetter(item), item))),
  )

const xs = [
  { id: 'abc', date: new Date() },
  { id: 'snt', date: new Date() },
]
const res = arrayToRecord(xs, (x) => x.id)

console.log(res)
// {
//   abc: { id: 'abc', date: 2021-04-06T13:09:25.732Z },
//   snt: { id: 'snt', date: 2021-04-06T13:09:25.732Z }
// }
```