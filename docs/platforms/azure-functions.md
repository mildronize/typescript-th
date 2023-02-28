## Creating Azure Functions
- Linux is limited feature of development lifecycle
	- [Read 1](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Cts%2Cportal%2Cbash#enable-streaming-logs)
- Window is fully support


- Azure Function docker doesn't support arm like Macbook M1 
	- In the [Official Documentaion](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-function-linux-custom-image?tabs=in-process%2Cbash%2Cazure-cli&pivots=programming-language-typescript) don't tell about that info.

## Getting Started

```bash
func init LocalFunctionProj --typescript
```

## ข้อควรระวัง 
ในหนึ่ง function จะมี 1 export หรือ 1 default export เท่านั้น !!!!!

### Minimal Project Structure
Example:
```
.
├── HttpTrigger1
│   ├── function.json
│   └── index.ts
├── host.json
├── local.settings.json
├── package.json
└── tsconfig.json

1 directory, 6 files
```

ใน file `HttpTrigger1/index.ts`  ต้องมี 1 Export หรือ default export เท่านั้น 

ไม่งั้นมันจะ Error แบบนี้
```
Worker was unable to load function <FunctionName>: 'Unable to determine function entry point. If multiple functions are exported, you must indicate the entry point, either by naming it 'run' or 'index', or by naming it explicitly via the 'entryPoint' metadata property.'
```
ตัวอย่างที่ทำให้ Error
```ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

// Don't export here !! ตรงนี้จะทำให้ Error
export const config = 'hello';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {};

export default httpTrigger;
```

## Function.json

### HTTP Type (anonymous)
```json
{
    "bindings": [
        {
            "authLevel": "anonymous",
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
    "scriptFile": "../dist/HttpExample/index.js"
}
```


## Storage Account Setting 
File: `local.settings.json`

Required Fields:
- `FUNCTIONS_WORKER_RUNTIME` need to be `node`
- `AzureWebJobsStorage`  need to config for following triggers:
	- httptrigger, kafkatrigger, rabbitmqtrigger, orchestrationTrigger, activityTrigger, entityTrigger
```json
{
    "IsEncrypted": false,
    "Values": {
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "AzureWebJobsStorage": "UseDevelopmentStorage=true"
    }
  }
```

Using Local Storage Account:
Need to install [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=npm)  for local development
```json
{
	"AzureWebJobsStorage": "UseDevelopmentStorage=true"
}
```

Using Storage Account on Azure
```json
{
	"AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=MyAccName;AccountKey=XXXXXXX==;EndpointSuffix=core.windows.net"
}
```



## Resources
- [Refactor Node.js and Express APIs to Serverless APIs with Azure Functions](https://learn.microsoft.com/en-us/training/modules/shift-nodejs-express-apis-serverless/)
	- Source Code via [GitHub](https://github.com/MicrosoftDocs/mslearn-module-shifting-nodejs-express-apis-to-serverless/tree/solution)

## Examples

- [CRUD RESTful API](https://github.com/mildronize/typescript-th/tree/main/examples/with-azure-functions/crud-restful-api)

## Thoubleshooting 

### Error: "Value cannot be null. (Parameter 'provider')" when run `func start`
```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
   "extensionBundle": {
     "id": "Microsoft.Azure.Functions.ExtensionBundle",
     "version": "[2.*, 3.0.0)"
  }
}
```

Don't forget to run

```bash
func extensions install
```

Ref: [Install all extensions - Offcial Azure Docs](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-all-extensions)

### Worker was unable to load entry point "xxxxx": Found zero files matching the supplied pattern

please make sure `main` in `package.json` is existing file. 

I've found the error from [Azure/azure-functions-nodejs-worker](https://github.com/Azure/azure-functions-nodejs-worker/blob/45865da3f5f9b09de9a6cbeb6dbf1d1bb4ee0284/src/startApp.ts#L49)

But I don't know how the `main` entrypoint file working.

### Local Dev

### Enable streaming logs

```bash
# Only Windows-based Azure Function
func azure functionapp logstream <FunctionAppName> 
```

####  Live Metrics Stream 
```bash
func azure functionapp logstream <FunctionAppName> --browser
```

### Download App Setting From Azure Function
```bash
func azure functionapp fetch-app-settings <functionAppName>
```

```
Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than httptrigger, kafkatrigger, rabbitmqtrigger, orchestrationTrigger, activityTrigger, entityTrigger. You can run 'func azure functionapp fetch-app-settings <functionAppName>', specify a connection string in local.settings.json, or use managed identity to authenticate.
```