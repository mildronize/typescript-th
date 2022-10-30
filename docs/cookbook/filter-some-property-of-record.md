# เลือกบาง Property จาก Record

Ref: https://rossbulat.medium.com/typescript-typing-dynamic-objects-and-subsets-with-generics-44ba3988a91a

เริ่มจาการที่นิยาม Type `FilterRecord<T, U>`

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

## มาดูตัวอย่างเต็มๆ กันดีกว่า

```typescript
export type FilterRecord<T, U extends keyof T> = { [K in U]: T[K] };
export type PartialFilterRecord<T, U extends keyof T> = Partial<
  FilterRecord<T, U>
>;
/**
 * Get only some keys and return the correct key
 */
export function filterRecord<T, U extends keyof T>(obj: T, keys: U[]) {
  // สาเหตุที่เลือกใช้ Partial ของ FilterRecord จะทำให้สร้าง Object ว่างๆ ได้นั่นเอง แล้วค่อยเลือก Property ทีหลัง
  const result: PartialFilterRecord<T, U> = {};
  keys.forEach((key) => {
    if (typeof obj[key] !== "undefined") {
      result[key] = obj[key];
    }
  });
  return result;
}

interface IPost {
  id: string;
  title: string;
}

const post: IPost = {
    id: '1',
    title: 'Go Lang'
}
const result = filterRecord(post, ['id']);

console.log(result.id);
console.log(result.title);  //  ❌ Error: Property 'title' does not exist on type 'Partial<FilterRecord<IPost, "id">>'
```