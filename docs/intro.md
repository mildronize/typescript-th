---
sidebar_position: 1
---

# Book Oultine

:::note

มาดูกันว่าในปี 2022 ในภาษา JavaScript/TypeScript เค้ามักจะใช้อะไรกันบ้าง

นึกไม่ออก เอามากองตรงนี้ไว้ก่อน

:::


ผมไม่ใช่แฟนภาษา JS แอบออกจะเกลียดด้วยซ้ำในวันแรกๆ ที่หัดเขียน

หนังสือเล่มนี้อาจจะไม่ครบทุกมุมมอง แต่ผมลองรวบรวมเท่าที่เยอะที่สุดเท่าที่จะทำได้แล้ว เนื้อหาส่วนใหญ่เป็นเรื่อง Node.js / TypeScript / React / DevOps ถ้าใครอยากเสริมเรื่องไหนบอกกันมาได้

# Libraries

## Type for TypeScript

### Type challenges/ Practices

- [https://github.com/type-challenges/type-challenges](https://github.com/type-challenges/type-challenges) (26.5k ⭐️ )
    - Collection of TypeScript type challenges with online judge
    - Solution: [https://ghaiklor.github.io/type-challenges-solutions/en/](https://ghaiklor.github.io/type-challenges-solutions/en/)
- [https://github.com/g-plane/type-gymnastics](https://github.com/g-plane/type-gymnastics)
    - Collection of wonderful TypeScript type gymnastics code snippets.

### Utility Types:

- [https://github.com/millsp/ts-toolbelt](https://github.com/millsp/ts-toolbelt) (4.9k ⭐️)— 👷 TypeScript's largest type utility library
- [https://github.com/piotrwitek/utility-types](https://github.com/piotrwitek/utility-types)

### Utility:

- [https://github.com/mistlog/typetype](https://github.com/mistlog/typetype) — A programming language designed for typescript type generation
    - Example: [https://github.com/mistlog/typetype-examples](https://github.com/mistlog/typetype-examples)

### Unknown

[https://github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern) (4k ⭐️)

## Zod

tRPC

# React

## State

- Server State
- Global State
- Form
- UI Components

## Frameworks

- Next.js

# Web Backend

Express

Nest.js

DI

- Inversify
- Tsyringe

Express Router

- routing-controllers
- inversify-express-utils

# Build Tools / DX

- Webpack
- esbuild
- Vite
- SWC
- tsc (typescript)
- ts-node
- ts-node-dev
- nodemon
- [tsup](https://github.com/egoist/tsup) 4k ⭐ - Bundle your TypeScript library with no config, powered by esbuild.
- [tsdx](https://tsdx.io/) 10.4k ⭐ - TSDX Zero-config CLI for TypeScript package development, powered by Rollup

# Code Editor / IDE

## VS Code

### Extension:

# DevOps

- GitHub Actions

# Readings

## Videos / Talks

- [Type Level Programming in Typescript](https://www.youtube.com/watch?reload=9&v=vGVvJuazs84)
    - Web: [https://type-level-typescript.com/](https://type-level-typescript.com/)
    - Slide: [https://docs.google.com/presentation/d/18Y0M4SRjKoJGR3ePSBBn8yPlpkE5biufZRdHo1Ka2AI/edit?usp=sharing](https://docs.google.com/presentation/d/18Y0M4SRjKoJGR3ePSBBn8yPlpkE5biufZRdHo1Ka2AI/edit?usp=sharing)

## Articles

- [Learn Advanced TypeScript Types](https://medium.com/free-code-camp/typescript-curry-ramda-types-f747e99744ab) (3.7k claps)
- [The Art of Type Programming](https://mistlog.medium.com/the-art-of-type-programming-cfd933bdfff7) (92 claps)
- [Type Query: jQuery Style Type Manipulation](https://mistlog.medium.com/type-query-jquery-style-type-manipulation-497ce26d93f) (17 claps)****

## Books

- [Effective TypeScript](https://effectivetypescript.com/) - [E-book at oreilly](https://learning.oreilly.com/library/view/effective-typescript/9781492053736/) / Book
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## YouTube Channels:
- [Andrew Burgess](https://www.youtube.com/c/andrew8088) -- TypeScript ฟังง่าย ยกตัวอย่างประกอบชัดเจนดี
- [basarat](https://www.youtube.com/@basarat) -- TypeScript, Next.js, Cypress, Playwright, React Native, React


## Blog
- https://bobbyhadz.com/



## ไม่รู้จะวางไว้ไหน

เริ่มจาการที่นิยาม Type `FilterRecord<T, U>`

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

```

```typescript
export type FilterRecord<T, U extends keyof T> = { [K in U]: T[K] };

// Demo FilterRecord

interface IPost {
  id: string;
  title: string;
}
type PostID = FilterRecord<IPost, 'id'>;
//  ^-- We will get type `PostID`
// type PostID = {
//     id: string;
// }

// `PostID` property will be required.
const postID: PostID = {
  id: '123'
}
```

จากนั้น ถ้าเราทำให้ Property ของ FilterRecord เป็น optional กัน โดยเอา `Partial<Type>` ไปครอบ `FilterRecord<T, U>` อีกที

```typescript
// Use Partial for using some element
export type PartialFilterRecord<T, U extends keyof T> = Partial<
  FilterRecord<T, U>
>;

// Demo PartialFilterRecord<T, U>

interface IPost {
  id: string;
  title: string;
}
type PostID = PartialFilterRecord<IPost, 'id'>;
//  ^-- We will get type `PostID`
// type PostID = {
//     id?: string | undefined;
// }

// `PostID` allow us to create empty object
const postID: PostID = {};
```

จากนั้นนิยาม function `filterRecord` สำหรับเลือกบาง Property จาก Record
สาเหตุที่เลือกใช้ Partial ของ FilterRecord จะทำให้สร้าง Object ว่างๆ ได้นั่นเอง แล้วค่อยเลือก Property ทีหลัง
