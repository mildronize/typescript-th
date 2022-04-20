---
tags: [Vercel, Pull Request]
---

# สร้าง Pull Request แล้ว Deploy เว็บตัวอย่าง โดยใช้ Vercel

นี่เป็นตัวอย่างการใช้งานคร่าวๆ นะครับ

[Pull request example](https://github.com/mildronize/mildronize.github.io/pull/29)

![](preview.png)


## 1. ถ้ามีการเชื่อมต่อ Vercel กับ Github ให้ปิดการเชื่อมต่อก่อน
เพราะว่าเราต้องการให้ github actions build and deploy แทนที่ Vercel (ซึ่งโดยปกติ Vercel จะ build และ deploy ให้อัตโนมัติ) [Read More](https://github.com/marketplace/actions/vercel-action#disable-vercel-for-github)

  > The Vercel for GitHub integration automatically deploys your GitHub projects with Vercel, providing Preview Deployment URLs, and automatic Custom Domain updates. [link](https://vercel.com/docs/v2/git-integrations)

  Set `github.enabled`: false in `vercel.json`, see example `vercel.json` file below:

  ```json
  {
    "version": 2,
    "public": false,
    "github": {
      "enabled": false
    },
    "builds": [
      { "src": "./public/**", "use": "@now/static" }
    ],
    "routes": [
      { "src": "/(.*)", "dest": "public/$1" }
    ]
  }
  ```
  When set to false, Vercel for GitHub will not deploy the given project regardless of the GitHub app being installed.

## 2. คุณควรเชื่อมต่อ Github กับ Vercel ที่เครื่องของคุณ
https://github.com/marketplace/actions/vercel-action#project-linking

```bash
$ vercel

? Set up and deploy “~/web/my-lovely-project”? [Y/n] y
? Which scope do you want to deploy to? My Awesome Team
? Link to existing project? [y/N] y
? What’s the name of your existing project? my-lovely-project
🔗 Linked to awesome-team/my-lovely-project (created .vercel and added it to .gitignore)
```

Once set up, a new .vercel directory will be added to your directory. The .vercel directory contains both the organization(vercel-org-id) and project(vercel-project-id) id of your project.

```json
{"orgId":"example_org_id","projectId":"example_project_id"}
```

คุณสามารถเก็บ secret ได้ตาม [link](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

## 3. กำหนด Github Actions

> TL;DR: Combining `pull_request_target` workflow trigger with an explicit checkout of an untrusted PR is a dangerous practice that may lead to repository compromise. We use `pull_request` trigger. [Ref](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)

```yml
# https://github.com/marketplace/actions/vercel-action
name: Preview deploy
on:
  pull_request:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        id: vercel-action
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }} # Required
          github-token: ${{ secrets.PUBLIC_REPO_ACCESS_TOKEN }} #Optional
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID}}  #Required
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID}} #Required
      - name: preview-url
        run: |
          echo ${{ steps.vercel-action.outputs.preview-url }}
```

## 4. กำหนดค่าที่ต้องใช้ ทั้ง GitHub Secrets และ Vercel

  | Secret key               | Secret value                                                                                         |
  |--------------------------|------------------------------------------------------------------------------------------------------|
  | VERCEL_TOKEN             | ต้องสร้างจาก https://vercel.com/account/tokens                                                         |
  | PUBLIC_REPO_ACCESS_TOKEN | ต้องกำหนด **repo** access โดยกำหนด Token ของ github [read more](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)               |
  | VERCEL_ORG_ID            | ID ของ team ที่เราใช้ แต่ถ้าใช้ Personal ให้เอาจาก [account setting](https://vercel.com/account) ใน Your ID |
  | VERCEL_PROJECT_ID        | เอามาจาก Project ID ใน Project Setting                                                               |

สำหรับการตั้งค่าอื่นๆ เพิ่มเติมที่ [Vercel Action - GitHub Action](https://github.com/amondnet/vercel-action)

# Read More
- [Deploy your pull requests with GitHub Actions and GitHub Deployments](https://sanderknape.com/2020/05/deploy-pull-requests-github-actions-deployments/)
- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
---

*Cross published at [Thadaw.com](https://thadaw.com/%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%83%E0%B8%AB%E0%B9%89-github-actions-%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87-previews-deploy-%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B9%88%E0%B8%87-pull-request-%E0%B9%82%E0%B8%94%E0%B8%A2%E0%B9%83%E0%B8%8A%E0%B9%89-vercel-qocjeqb/)*

*Cross published at [.NET Thailand](https://www.dotnetthailand.com/programming-cookbook/github-actions/deploy-preview-when-pr)*

*Acknowledgement: Thank you .net thailand team to review this article: [dotnetthailand.github.io#139](https://github.com/dotnetthailand/dotnetthailand.github.io/pull/139)*
