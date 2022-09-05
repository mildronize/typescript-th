---
sidebar_position: 8
---

# รวม Trick

อันไหนที่ยังหาหมวดหมู่ไม่ได้ ก็เอาลงมาที่นี่ก่อน

## การเขียนเงื่อนแบบ Multi-line

```yaml
if: >-
      github.event.state == 'error' ||
      github.event.state == 'failure'
```

## การซ่อน Secrets

use `mask`

## การจัดการไฟล์ JSON

yq, jq

## การจัดการไฟล์ JSON, Yaml, XML

yq

## การกำหนดตัวแปรใน Custom GitHub Actions แบบ Composite

เราไม่สามารถใช้ตัวแปลได้ แต่เราสามารถใช้ Env Var ได้ เช่น

echo "mildronize_action_decrypted_sops_file_age=sops-$(date +%s).yaml" >> $GITHUB_ENV

```yaml
steps:
  - run: echo "mildronize_action_decrypted_sops_file_age=sops-$(date +%s).yaml" >> $GITHUB_ENV
    shell: bash

  - run: rm -f ${{ env.mildronize_action_decrypted_sops_file_age }}
    shell: bash
```

## การอัพเดท GitHub Actions Workflow ไปหลายๆ Branch พร้อมกัน

บางครั้งถ้าเราใช้ Event ประเภท Pull Request มันจะติดอยู่กับ Branch นั้นเลย เราเลยจำเป็นต้อง Update ไปหลาย branch พร้อมๆ กัน

1. Fix at dev branch (Default Branch)
2. if any change on outside pipeline (`workflows`) e.g. composite, → cherry pick Merge to `hotfix`, `preview/hotfix` , `dev`, `preview/dev`
3. using script
  ```bash
  #!/bin/bash
  # Ref: https://www.freecodecamp.org/news/bash-array-how-to-declare-an-array-of-strings-in-a-bash-script/
  CurrentPath=$(pwd)
  Target=../Storm-web/.github
  CommitMessage="github action: STM-2843 Fix bug label bot for Preview/Hotfix"
  TargetBranch=("preview/hotfix")
  # "development.two" "preview/dev" "hotfix" "preview/hotfix"
  for branch in ${TargetBranch[@]};
  do
    echo "---------------------------------------------"
    echo $branch
    
    cd $Target
    git fetch
    git checkout $branch
    git pull
    ActiveBranch=$(git rev-parse --abbrev-ref HEAD)
    echo "Active Branch is $ActiveBranch"
    cd $CurrentPath
    cp -rf ./workflows $Target 
    cd $Target
    git add -A
    git commit -m "$CommitMessage"
  done
  ```

## ใน Matrix ไม่สามารถใส่ GitHub Expression ได้

เช่น แบบนี้จะทำไม่ได้

```yml
    strategy:
      fail-fast: false
      matrix:
        include:
          - env_name: customer_a
            bacpac_file: database_customer_a.bacpac

          - env_name: customer_b
            bacpac_file: database_customer_b.Storm_Demo.bacpac
            enabled: ${{ needs.get-pull-request-metadata.outputs.enable_customer_b}}
```

