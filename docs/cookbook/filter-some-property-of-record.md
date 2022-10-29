# Filter some property of Record

```typescript
// Read More: https://rossbulat.medium.com/typescript-typing-dynamic-objects-and-subsets-with-generics-44ba3988a91a

/**
 * Get only some keys and return the correct key
 */
// Use Partial for using some element
export type FilterRecord<T, U extends keyof T> = { [K in U]: T[K] };
export type PartialFilterRecord<T, U extends keyof T> = Partial<
  FilterRecord<T, U>
>;

export function filterRecord<T, U extends keyof T>(obj: T, keys: U[]) {
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