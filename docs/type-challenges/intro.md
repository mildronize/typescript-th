---
sidebar_position: 1
---

# Introduction

พยายามอธิบาย Type โดย pseudo-code

ผมขอเรียกว่า **"Type pseudo-code"** ละกัน

อ่าน Syntax ได้จาก [Type Expression](https://github.com/mildronize/type-exp)

## Map type of typescript to JavaScript Type

คิดว่า Type คือ Data ([Types are just data](https://type-level-typescript.com/02-types-are-just-data))

| TypeScript     | JavaScript      |
| -------------- | --------------- |
| Literal        | Primitive       |
| Primitive      | Primitive       |
| Union          | Set or Object |
| Intersection   | Set or Object |
| Data structure | Set or Object |

## Type pseudo-code

Map Syntax

```ts
type MyRecord<K extends keyof any, T> = {
    [P in K]: T;
};
```

- Function name: `MyRecord`
- Input: `K extends keyof any` and `T`
- Output: 
    ```ts
    {
        [P in K]: T;
    }
    ```

```ts
// Type pseudo-code
function MyRecord(K: keyof any, T: unknown){
    if(isPrimitive(K)) 
        return { K: T };
    return typeMap(K, [P, T] => ({
        P: T
    }));
}

// keyof any === 'string | number | symbol'
```

## Type pseudo-code Utility

```ts
// This is not TypeScript Syntax 
declare function isPrimitive<T>(Object: T): boolean;

declare function typeMap<T>(Object: T, Callback: [Key, Value] => );
```

