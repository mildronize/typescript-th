# Keyof

```ts
type Post = {
  title: string;
  date: Date;
};

const myPost: Post = {
  title: "TypeScript is great!",
  date: new Date(),
};
```
1. ต้องการสร้าง Function ที่ดึง Value ออกมาจาก Key ของ Object

    ```ts
    getPostByKey1("title", myPost); // TypeScript is great!
    ```
2. เราไม่สามารถใช้ key เป็น string ได้ เพราะ string ไม่ใช่ title หรือ date
    ```ts
    function getPostByKey2(key: string, postData: Post) {
      return postData[key];
    }
    ```
3. แสดงว่า key ต้องเป็น union type => 'title' | 'date'
    ```ts
    function getPostByKey3(key: "title" | "date", postData: Post) {
      return postData[key];
    }
    ```
4. keyof จะได้ union ของ key ของ Object
    ```ts
    type KeyOfPost = keyof Post; // 'title' | 'date'
    ```

5. ทำให้ function generic มากขึ้น สามารถ reusable ได้
    ```ts
    function getObjectByKey<T>(key: keyof T, data: T) {
      return data[key];
    }
    getObjectByKey('date', myPost);
    ```

ลองเล่นใน [Playground](https://www.typescriptlang.org/play?#code/CYUwxgNghgTiAEAzArgOzAFwJYHtXwHMQMAFHAZwwCEBPAaRBoEYAKAa0YC5403UcA7qgA08AA4UM3MpQCU3XvyEBuAFCqMNMQhkZ4AXngBvVfHjYMEEN0owsqAmrPAoGa-AAirkGoC+a1TA8SngAWxpdaUkDY1NzLEt3ACIAFS0QAGUwOzE9LHJCOFcAQiThOJc3blQQAU9vFlly-1UAegAqdtN2+CYAOnhAVDhASThAWjhAcDhAQDhAJjhAYjhAKjhZ4enx+AAxNExcfEB0OEBWOEAJOEAUOEA2OFWANSgIZARR0cnAQjhpwAg4acn4Bhp4QCA4CfgAeQARgArcAYbqtVREUiSWifVhJCxWMphCKSWTKeCtVrwNLaLI5PIFAhFDDFNqdbrwABMA0AAnCzaaAETgHgd5tMnrNAGhwgGE4QBQcMN4BwvnTANhwgHE4QCYcPBbPYCPAmUdBXTAHhwjMADHAyjB2BwK1n8g7xRLwQDUcLNAOxwo3glRAENUKHQ2DwhGIujhjGp7C4Wp1BFEEkoXgwUCicliZmx8AAAhhyABaEAAD20mATMBgOBgcTgGGQMHwAYwQagAG1hQBdPwUrrwHoAZgGgEE4eZHcaAcjgDtMhYwhmNxmKpTxUNtzOkDAA+eAAciRICn8AAPtObVO7Q6ts7oW76Iw616aNxEQlkYv4EkbSjC8XQxhZOH4Dm8wXJMWy4xK6pfNWqQAWAbCnBEHgZ51UVQU0BHX5VmFH4-iBUFMDtTRtA+Rh-kQXQYgAoDdExSMZ2POdTynFd1A6GsegAVgGHZAGY4HkTUFdcnXwIgajsMB4CeSZvhOYZpXZTkuQfEBkHIKBASsBUlTXTYWJdDB4LBd0aAAHhScd924bDcVESoQ1xO8TDMR982tVxSwrKtoSUzAVJYEjvCnURwl0DEgA)