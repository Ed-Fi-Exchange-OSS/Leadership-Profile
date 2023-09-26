# Leadership-Profile

This web portal built around Ed-Fi technology stack enables districts to bring
their Leadership Development Framework measures into the hands of district
leadership and staff.

## Setting up the development environment

* You will either have to Clone or Fork the repo.
* You will need to be added to the org and team to clone and work on the repo.
* For Fork, you won't need to be added to the org. If you wish to bring the changes back, you can create PR. The commits must be signed.
* If Commits are not signed, they can’t be merged. Please refer [this document](https://techdocs.ed-fi.org/display/ETKB/Signing+Git+Commits) for the setup.
* Caution: If your commits are not signed, and you want to do that after the fact, it can be an arduous process. It is highly recommended to make sure this works before starting real dev work.
* CLA must be signed [here](https://cla-assistant.io/Ed-Fi-Exchange-OSS/Leadership-Profile?pullRequest=3).

### Required software

* .net 5 sdk (https://dotnet.microsoft.com/download/dotnet/5.0)
* SQL Server 2019 (https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
  * Alternatively use Docker for local development, see more info below
* node.js (https://nodejs.org/)
* docker
* powershell
* Papercut for local email testing (https://github.com/ChangemakerStudios/Papercut-SMTP)

### Setup

* Run the `setup.ps1` powershell script to install the required powershell modules and tools needed to build
the application.
* Run `Invoke-Psake DownloadDbTestData` in powershell from the project root folder.
* Unzip and restore the backup in `testdata/EdFi_Ods_Populated_Template_TPDM_10.zip` to your local SQL Server instance.
* Run the database migrations by running this powershell command from the project root folder:

```shell
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
* `Invoke-Psake Test`: Runs all the tests.

### Test Data

* Test Data is seeded for automated tests on the Test Database by default. To seed your dev database, run the migrations scripts under the `TEST` environment using `Invoke-Psake SeedLocalDatabase`

## Running API

It can be run directly from the Editor, such as Visual Studio. It must be running along with the React Web application for full functionality.

* If using Visual Studio, set Startup to launch `LeadershipProfileAPI` (using dotnet and Kestrel, not IIS Express)

### Use Docker for Local DB

**Docker database is not recommended for use in a production environment.**

Instead of a typical SQL Server installation, you can use Docker for the local database, similar to the test DB.

* `Invoke-Psake RecreateLocalDockerDatabase`: Destroys and recreates a SQL Server container for local dev
* `Invoke-Psake RestoreLocalDockerDatabase`: Restores the backup to the local DB without recreating the container
* `Invoke-Psake UpdateLocalDockerDatabase`: Runs DB migration scripts against the Docker DB
* `Invoke-Psake SetLocalDockerConnectionString`: Sets up local API configuration to use Docker DB
* `Invoke-Psake ResetLocalDockerDatabase`: Combines all of the above to set or reset the Docker DB

## Available React Scripts

In the Web project directory, you can run the below scripts.
You may need to manually install the `react-scripts` tool first:

```shell
npm i react-scripts
```

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

## Email

The application is preconfigured to send emails to localhost.
The recommended tool to test the email sending functionality is Papercut SMTP.

For production, change the EmailSettings configuration block in `appsettings.json`:

```json
  "EmailSettings": {
    "Server": "127.0.0.1",
    "Port": 25,
    "Sender": "\"Leadership Portal\" <noreply@test.com>",
    "Username": "",
    "Password": ""
  }
```

Alternatively, you can create a class that implements the `IEmailSender` interface
in `src/API/LeadershipProfileAPI/Infrastructure/Email/IEmailSender.cs` and register it
on the `Startup` class instead of the `SmtpSender` class:

```csharp
  // Replace SmtpSender with your own implementation
  services.AddTransient<IEmailSender, SmtpSender>();
```

## Legal Information

Copyright (c) 2023 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.
