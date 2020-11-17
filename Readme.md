# Leadership-Profile

{Detailed description TBD}


## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.

## Running API
### Setting the secrets locally for Ed-Fi ODS
Take a look at Microsoft's recommended way managing secret storage [here](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets) and follow the steps below:

1. Navigate to directory where CSPROJ exists and run

 `dotnet user-secrets init`

2. After running the command above, you should see `UserSecretId` in csproj file:
[Image]

3. To set the Client Id run 

  `dotnet user-secrets set "ODS-API:Client-Id" "{ClientId from Swagger}"` 

4. To set the Client Secret run

`dotnet user-secrets set "ODS-API:Client-Secret" "{ClientSecret from Swagger}"` 

    
