
# Easy

Based on 
- https://github.com/type-challenges/type-challenges
- https://ghaiklor.github.io/type-challenges-solutions/en/

## Pick

สร้าง Type ใหม่ โดยเลือก key จาก `K` จาก object `T` (โดยปกติ TypeScript จะมี built-in `Pick<T, K>` อยู่แล้ว)

For example:

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

**Explanation**

```ts
type MyPick<T, K extends keyof T> = { 
    [P in K]: T[P] 
};
```

สร้าง Type ที่ชื่อ `MyPick` โดยที่มี parameter เป็น `T` และ `K`  ซึ่ง `K` เป็น type `keyof T` เท่านั้น

สมมติ `T` เป็น `Todo` ดังนั้น `keyof T` จะเป็น type `'title' | 'description' | 'completed'`

ในส่วนของการ return type (`{ [P in K]: T[P] }`)หมายถึงให้สร้าง Mapped Types โดยที่มี
  - Key (`[P in K]`): หมายถึงการ Foreach `P` in `K`
    - ในโจทย์ `K` คือ `"title" | "completed"`
    - ดังนั้น `P` จะมีได้ 2 ค่า คือ `title` และ `completed`
  - Value (`T[P]` ): เป็น Lookup Types `T[P]` โดยเอา `P` ที่มาจากการ Foreach ใน Key ไป โดยเอา Type จาก `T[P]`
    - ถ้า `P` เป็น **"title"** ดังนั้น `T[P]` คือ **string**
    - ถ้า `P` เป็น **"completed"** ดังนั้น `T[P]` คือ **boolean**


อ่านเพิ่ม
- [Keyof Type Operator](/docs/basic/type-manipulation#keyof)


**References**

- [Lookup Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## Readonly

สร้าง Type ใหม่ เพื่อแปลงให้ทุก key ของ object เป็น readonly หรือก็คือ ไม่สามารถ Assign (โดยปกติ TypeScript จะมี built-in `Readonly<T>` อยู่แล้ว)

For example:

```ts
interface Todo {
  title: string;
  description: string;
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
todo.description = "barFoo"; // Error: cannot reassign a readonly property
```

**Explanation**

```ts
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K] 
};
```

It can explain in pseudo-code (TypeScript Like) 

```ts
// This is not TypeScript Syntax
function MyReadonly(T: unknown){
    return map(T, K => ({
        readonly K: T[K]
    }));
}
```


## Footnoote

**\*** ไม่แน่ใจว่า ถ้าเราไม่กำหนด Type ให้ Generic มันจะเป็น `unknown` หรือ `any`
