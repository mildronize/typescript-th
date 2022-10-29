---
sidebar_position: 1
---

# Types ที่ใช้งานเป็นประจำ

## Type Assertions

const assertions in Typescript
https://mainawycliffe.dev/blog/const-assertion-in-typescript/

```typescript
const person = {
    name: "John Doe",
    age: 25,
};

const person = {
    name: "John Doe",
    age: 25,
} as const;

// (Note: This is not TypeScript Syntax)
// const person: {
//     readonly name: "John Doe";
//     readonly age: 25;
// }
```