---
sidebar_position: 1
---

# การจัดการกับ Object



## Record<Keys, Type>

```typescript
const nameRecord: Record<string, number> = {
  john: 1,
  micky: 2,
};
 
nameRecord['Lilly'] = 5; // We can add new property in object becuase 'Lilly' is string

nameRecord[true] = 5; // ❌ Error: Type 'true' cannot be used as an index type
```

### Record with Type Union (All Properties are required)

`Record<Type>` จำเป็นต้องกำหนด key ของ property ให้ครบ แต่ถ้าจะเป็นแบบ Partial [ตอนนี้ TypeScript ยังไม่ได้ support](https://github.com/microsoft/TypeScript/issues/43918)

```typescript
type Activities = 'Running' | 'Walking' | 'Swimming';
const countActivities: Record<Activities, number> = {
  Running: 0,
  Swimming: 1,
  Walking: 5
}

// The key of object `countActivities` must match to type `Activities`
```

### Record with Type Union (All Properties are optional)

```typescript
// กำหนด PartialRecord<Type> เพื่อใช้งานเอง
type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type Activities = 'Running' | 'Walking' | 'Swimming';
const countActivities: PartialRecord<Activities, number> = {
  Running: 0,
}
 
countActivities.Walking = 5; // It work!
countActivities.Cycling = 4; // ❌ Error: Property 'Cycling' does not exist on type 'Partial<Record<Activities, number>>'
```
