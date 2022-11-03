# การ Bump Version ของ Package.json โดยใช้ npm

	แก้ไขในส่วนของ `scripts` ของ `package.json` ดังนี้

```json
{
  "scripts": {
    "preversion": "npm test",
    "version": "npm run build && git add -A dist",
    "postversion": "git push && git push --tags && rm -rf build/temp"
  }
}
```

จากนั้นให้รัน command 
```bash
npm version patch --force -m "Bump Version %s"
```

## ลำดับการทำงาน
1. มันเรียกคำสั่ง `npm run preversion` อัตโนมัติจากนั้น
2. มันจะเริ่ม Bump ตามคำสั่งข้างบน ในกรณี คือ`npm version patch --force -m "Bump Version %s"`
3. มันจะรัน `npm run version`
4. มันจะ commit & ใส่ tag ให้เลย (เป็นจากคำสั่งในข้อ 2)
5. จากนั้น มันจะรัน `npm run postversion`

## การใช้คำสั่ง npm version

```bash
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
```

ตัวอย่างการทำงาน 
- `major` เช่น จาก `0.0.0`  เป็น `1.0.0`
- `minor` เช่น จาก `0.0.0`  เป็น `0.1.0`
- `patch` เช่น จาก `0.0.0`  เป็น `0.0.1`

Ref: https://docs.npmjs.com/cli/v8/commands/npm-version
