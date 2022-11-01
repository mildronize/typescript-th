- Azure Function docker doesn't support arm like Macbook M1 
	- In the [Official Documentaion](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-function-linux-custom-image?tabs=in-process%2Cbash%2Cazure-cli&pivots=programming-language-typescript) don't tell about that info.


## Function.json

### HTTP Type
```json
{
    "bindings": [
        {
            "authLevel": "function",
            "type": "httpTrigger",
            "direction": "in",
            "name": "req",
            "methods": [
                "get",
                "post"
            ]
        },
        {
            "type": "http",
            "direction": "out",
            "name": "res"
        }
    ],
    "scriptFile": "../dist/HttpExample/index.js" // don't forget the scriptFile
}
```

## Resources
- [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](https://learn.microsoft.com/en-us/training/modules/shift-nodejs-express-apis-serverless/)
	- Source Code via [GitHub](https://github.com/MicrosoftDocs/mslearn-module-shifting-nodejs-express-apis-to-serverless/tree/solution)

## Examples

- [CRUD RESTful API](https://github.com/mildronize/typescript-th/tree/main/examples/with-azure-functions/crud-restful-api)