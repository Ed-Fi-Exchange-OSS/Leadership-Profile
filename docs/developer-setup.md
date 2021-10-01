# Developer Setup

## Environment Setup

Install the **Required Software** from [Readme.md](../Readme.md)

- Docker can be used for local database, see more info below
- [Papercut](https://github.com/ChangemakerStudios/Papercut-SMTP) can be used for local email testing

Run the `setup` powershell script to install the required powershell modules and tools needed to build
the application.

```powershell
./setup.ps1
```

### Database Setup

From the project root folder, open a PowerShell prompt, then execute the following.

#### Local SQL Server Instance

- Run `Invoke-Psake DownloadDbTestData` to download the latest sample data backup
- Unzip and restore the backup in `testdata/EdFi_Ods_Populated_Template_TPDM_10.zip` to your local SQL Server instance
- Run `Invoke-Psake UpdateLocalDatabase` to migrate the database to the latest version
  - Run `Invoke-Psake SeedLocalDatabase` to seed the database with test data

#### Docker

Instead of a typical SQL Server installation, you can use Docker for the local database, similar to the test DB.
**MSSQL Docker database is not recommended for use in a production environment.**

- Run `Invoke-Psake ResetLocalDockerDatabase` to download and restore the latest sample backup, as well as migrate it
  - Run `Invoke-Psake SeedLocalDockerDatabase` to seed the database with test data
- Run `Invoke-Psake SetLocalDockerConnectionString` to replace the API configuration connection string one for use with Docker

### Build and Run the API

The API can be run directly from your IDE, such as Visual Studio. It can be launched alone and interacted with via Swagger, or in most cases you will want to also run the Web UI. The solution can be found at `src/API/LeadershipProfileAPI/LeadershipProfileAPI.sln`.

- If using Visual Studio, set Startup to launch `LeadershipProfileAPI` (using dotnet and Kestrel, not IIS Express)

### Build and Run the Web App

#### Available React Scripts

In the Web project directory, you can run the below scripts.
You may need to manually install the `react-scripts` tool first:

```shell
npm i react-scripts
```

##### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

##### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Testing the Application

### API Tests

To run the back-end tests, run `Invoke-Psake TestAPI` from the repository root.

- When running from the command line, tests execute against a seeded database that runs as a Docker Container.
- When running from Visual Studio, tests execute against the default dev database. You can change this in the settings

Test Data is seeded for automated tests on the Test Database by default. To seed the dev database, run the migrations scripts under the `TEST` environment using `Invoke-Psake SeedLocalDatabase`.

### Web Front-End Tests

From `src/Web/` run `npm test`

This launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) in the React Docs for more information.
