
# การอัพเดท GitHub Actions Workflow ไปหลายๆ Branch พร้อมกัน

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