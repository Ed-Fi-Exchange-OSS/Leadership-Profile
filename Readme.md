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

## Setting up the development environment

### Required software

* .net 5 sdk (https://dotnet.microsoft.com/download/dotnet/5.0)
* SQL Server 2019 (https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
* node.js (https://nodejs.org/)
* docker
* powershell

### Setup

* Run the `setup.ps1` powershell script to install the required powershell modules and tools needed to build
the application.
* Unzip and restore the backup in `testdata/EdFi_TPDM_v08_20201109.zip` to your local SQL Server instance.
* Run the database migrations by running this powershell command from the project root folder:
```
Invoke-Psake UpdateLocalDatabase
```

## Building the application

From the project root directory, run this powershell command: `Invoke-Psake Publish`.
This command will create two zip files in the `artifacts` folder:

* LeadershipProfile-API
* LeadershipProfile-Frontend

## Testing the application

These are the available powershell commands to test the application (run them from the projec root directory):

* `Invoke-Psake TestAPI`: Runs the API related tests. It runs a docker container with a test database and then runs the API
  test suite.
* `Invoke-Psake TestFrontend`: Runs the frontend tests.
* `Invoke-Psake Test`: Runs the all the tests.

## Running API
### Setting the secrets locally for Ed-Fi ODS
Take a look at Microsoft's recommended way managing secret storage [here](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets) and follow the steps below:

1. Navigate to directory where CSPROJ exists and run

 `dotnet user-secrets init`

2. After running the command above, you should see `UserSecretId` in csproj file:
![screenshot](/docs/images/screenshot-secrets-csproj.png)

3. To set the Client Id run 

  `dotnet user-secrets set "ODS-API:Client-Id" "{ClientId from Swagger}"` 

4. To set the Client Secret run

`dotnet user-secrets set "ODS-API:Client-Secret" "{ClientSecret from Swagger}"` 

    
## Available React Scripts

In the Web project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.