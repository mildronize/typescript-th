---
tags: [Private Repository]
sidebar_position: 2
---

# การใช้งาน GitHub Action แบบ Private Repo

## Understanding Usage

This repo using technique following [actions/checkout@v2](https://github.com/actions/checkout) docs: 

### Checkout multiple repos (nested)
``` 
- name: Checkout
  uses: actions/checkout@v2

- name: Checkout tools repo
  uses: actions/checkout@v2
  with:
    repository: my-org/my-tools
    path: my-tools
```

## Warning

:::caution

AVOID USING `actions/checkout@v2` without `path` inside the composite actions 

:::

because the working directory will be changed 
So, it makes the workflow working directory changing before exit
   
Example:

1. Calling a composite action name "AwesomeAction" with path `/cat` using action path `/cat/action.yml`
2. Using `actions/checkout@v2` without path 
    - it will change the entirely workflow working directory to another path like `/cat/my-repo`
3. When "AwesomeAction" is done, the system will call "Post" action to clean up all stuff in "AwesomeAction" action.
    - the Post action is automatically called by the system, we cannot change the working directory directly
  so, the system will use `/cat/my-repo/action.yml`, but this path is not found, the system will throw error with 
  
        > "Can't find 'action.yml', 'action.yaml' or 'Dockerfile' under '/the/path/which/error'. Did you forget to run actions/checkout before running your local action?"
