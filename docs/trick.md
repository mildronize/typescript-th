---
sidebar_position: 8
---

# Trick

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