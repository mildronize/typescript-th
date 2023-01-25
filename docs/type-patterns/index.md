---
sidebar_position: 1
---

# Type Patterns

Utilty Type

```ts
// import type { Equal, Expect } from '@type-challenges/utils'
// https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
```

## Tail of Array always be array

```ts
import type { Equal, Expect } from '@type-challenges/utils'

type CheckTailStatus<T extends any[]> = T extends [infer Head, ...infer Tail]
  ? Tail extends any[]
    ? 'Tail is an array'
    : 'Tail is not an array'
  : 'Empty array';

// Test Assertion
type cases = [
  Expect<Equal<'Empty array', CheckTailStatus<[]>>>,
  Expect<Equal<'Tail is an array', CheckTailStatus<['cat']>>>,
  Expect<Equal<'Tail is an array', CheckTailStatus<['cat', 'dog']>>>,
  // @ts-expect-error
  Expect<Equal<'Tail is not an array', CheckTailStatus<['cat']>>>
];
```

## Recursive Type

```ts
type Recursive<T> = T extends [infer H, ...infer T] 
    ? [H, ...Recursive<T>] 
    : [];
```
