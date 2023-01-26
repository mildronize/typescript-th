# Array and Tuples

ลองอ่านเว็บนี้ [Type Level TypeScript / Arrays & Tuples](https://type-level-typescript.com/arrays-and-tuples) มาก่อนแล้วจะเข้าใจมากขึ้น

## Basic Tuples

### Extracting type from indices of a tuple
```ts
type TupleMember = ["Thada", 30];

type Name = TupleMember[0]; // "Thada"
type Age = TupleMember[1]; // 30
```

#### Extracting type from several indices

```ts
type TupleMember = ["Thada", 30, true];

type NameOrAge = TupleMember[0 | 1]; // "Thada" | 30
```

### Extracting type from tuples 
```ts
type TupleMember = ["Thada", 30, true];

type TupleElementType = TupleMember[number]; // "Thada" | 30 | true
```

### Concat Tuples

```ts
type Tuple1 = [4, 5];
type Tuple2 = [1, 2, 3, ...Tuple1]; // => [1, 2, 3, 4, 5]
```

## Basic Arrays

```ts
type Names = string[];

type Users = Array<string>; // same as `string[]`

type UnionArray = (string | number)[]; // Accept arrays of string or number
```

### Extracting the type in an Array

```ts
type Names = string[];
type ContentType = Names[number];  // string
```

## Getting Prepare to More Advance Type

### Tail of Array always be array

```ts
type CheckTailStatus<T extends any[]> = T extends [infer Head, ...infer Tail]
  ? Tail extends any[]
    ? 'Tail is an array'
    : 'Tail is not an array'
  : 'Empty array';

// Test Assertion
import type { Equal, Expect, ExpectFalse } from '@type-challenges/utils'
type cases = [
  Expect<Equal<'Empty array', CheckTailStatus<[]>>>,
  Expect<Equal<'Tail is an array', CheckTailStatus<['cat']>>>,
  Expect<Equal<'Tail is an array', CheckTailStatus<['cat', 'dog']>>>,
  ExpectFalse<Equal<'Tail is not an array', CheckTailStatus<['cat']>>>
];
```

[playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBDAnmApnA3nAogRwK4CGANgDTYAeqAxjGVpSjQGLEDOaAvnAGZQQhwA5AAEkqALRUAFsSIoAdgHMUrAPR4YwIq0EAoXWLQBhKYwDWAFQJaAyjAIw8rADwW4KcjAUATVnALyiADaALoAfHAAvHBuHl7yvnBBwPLcKFBwABIoBN5kAHSFKWkZVlohunBwAPwx1kTunj5+AcEVVVW1gmUNwC3y-lBQBIh6HXAAXEI9cH1w8hDwAYPDo5WTQljgSCsjggDc+qqqMSrwAIKs7LDAEPIGyGhUBOx+0UHr9NQwzriERM5BFswDsCEM9mQTOYenYHE5nKEwkiSJ8GDRfvhiICZnNlmDVoJIaYqJZ6rDHC4goJnjBBOFkajvhj-tj6rN+rtRkToWT7BSEdSHIShN4IIo6UiwijGYwYCxtChmVjumy5gslgN8RC4FCSTC+fCqTSJUjdCF9kA)

## Loop in Array (Using Recursive)

### Recursive Array

```ts
type RecursiveArray<T> = T extends [infer Head, ...infer Tail]
  ? [Head, ...RecursiveArray<Tail>]
  : [];

// Test Assertion
import type { Equal, Expect, ExpectFalse } from '@type-challenges/utils'
type cases = [
  Expect<Equal<RecursiveArray<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<RecursiveArray<"cat">, []>>,
  Expect<Equal<RecursiveArray<1>, []>>,
  ExpectFalse<Equal<RecursiveArray<[1]>, []>>,
]
```

[playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAShDGBXATgZwJYDcIEFnIEMQAeAFQD4oBeKUqCAD2AgDsATVKAbXRYDMIyKAAkIBNgBooAOlm8BQ0gXQAbALoAoKFAD83UeKmzpcJGiy58RMspXlN2gFzc1Abg0aA9J9oRUwKBxUVEFgdAB7Fg10AFswcOQA0EgoAG8oAFEAR0QCFSkMhkh4YAKihGAAMTyQqABfKD5kcJioAHIAAWSIAFp4AAs8lVYAcz9PRDCVVDaNbqh4AhDOGi4tTPKS4mzclWJTFAxsPEISLgBGKQAmKQBmNXIpC+u7h8f1wuLgbZy8-YRDhYTtYAESLYAgx4ucjvbSfCo-Xb-MxHSynYjnKFcN4SD6bKo1CCIv4HczHKxnc4PJ44jRqIA)

### Reverse Array

```ts
type ReverseArray<T> = T extends [infer Head, ...infer Tail]
  ? [...ReverseArray<Tail>, Head]
  : [];

// Test Assertion
import type { Equal, Expect, ExpectFalse } from '@type-challenges/utils'
type cases = [
  Expect<Equal<ReverseArray<[1, 2, 3]>, [3, 2, 1]>>,
  Expect<Equal<ReverseArray<"cat">, []>>,
  Expect<Equal<ReverseArray<1>, []>>,
  ExpectFalse<Equal<ReverseArray<[1]>, []>>,
]
```
[playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAShBuEBOBnCBBJSCGIA8AKgHxQC8UBUEAHsBAHYAmKUA2gJb0BmyUAEhGyMANFAB0EzjyQVs7ADYBdAFBQoAfjYSxcRKgxZchOfKKiBQlWoBcbRQG5lygPTOKEFMCjoUaJMHYAe3pldgBbMED-KFBIKABvKABRAEcAV2x5USTqSABjYGzciAKAMUy0KABfKC4kQLCoAHIAAViIAFo8gAtM+QYAcw9nNID5FCbldqg87DQWclZVZOKCvFSM+TxdZDRMHHxWAEZRACZRAGZFMzYLs9Ej67NlnPzgdfTM7YRdgwO8ABEs2AAJurCewheq3eGy+O30+yMRzBEKhb3K4wgH023z0e0Mh0eKKIz0UQA)

# Read More
