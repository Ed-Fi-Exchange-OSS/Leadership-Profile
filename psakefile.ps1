include "./psake-build-helpers.ps1"

properties {
	$configuration = "Release"
	$env = "dev"
	$projectRootDirectory = "$(resolve-path .)"
	$publish = "$projectRootDirectory/Publish"
	$productSolution = "$projectRootDirectory/src/API/LeadershipProfileAPI/LeadershipProfileAPI.sln"
	$apiProjectFile = "$projectRootDirectory/src/API/LeadershipProfileAPI/LeadershipProfileAPI.csproj"
	$apiTestProjectFile = "$projectRootDirectory/src/API/LeadershiProfileAPI.Tests/LeadershipProfileAPI.Tests.csproj"
	$frontendAppFolder = "$projectRootDirectory/src/Web"
	$artifactsFolder = "$projectRootDirectory/artifacts"
	$testDatabasePassword = "yourStrong(!)Password"
	$testDatabaseContainerName = "LeadershipProfileTestDb"
	$testDatabasePort = "1435"
	$dbTestdataZipFile = "EdFi_TPDM_v08_20201109.zip"
	$dbTestdataBakFile = "EdFi_TPDM_v08_20201109.bak"
	$testDataFolder = "$projectRootDirectory/testdata"
	$dbName = "EdFi_Ods_Populated_Template"
}


task Publish -description "Publish the primary projects for distribution." {
	$minVersion = minver -t v
	remove-directory-silently $publish
	remove-directory-silently $artifactsFolder
	remove-directory-silently "$frontendAppFolder/build"
	exec { dotnet publish -c $configuration "$apiProjectFile" -o $publish}
	pushd -Path $frontendAppFolder
	exec { npm install }
	exec { npm run build }
	popd
	New-Item -ItemType Directory -Force -Path "$artifactsFolder"
	Compress-Archive -Path "$publish" -Destination "$artifactsFolder/LeadershipProfile-API-$minVersion.zip"
	Compress-Archive -Path "$frontendAppFolder/build" -Destination "$artifactsFolder/LeadershipProfile-Frontend-$minVersion.zip"
}

task TestFrontend -description "Run frontend tests" {
	pushd -Path $frontendAppFolder
	exec { npm install }
	exec {npm run test -- --watchAll=false --passWithNoTests --ci }
	popd
}

task TestAPI -description "Run API tests" {
	exec { dotnet test "$apiTestProjectFile" }
}

task Test -description "Runs all tests" -depends TestFrontend, TestAPI

task RecreateTestDatabase -description "Starts a docker container with the test database" {
	if (!(Test-Path "$testDataFolder/$dbTestDataZipFile" -PathType Leaf)) {
		Expand-Archive -Path "$testDataFolder/$dbTestDataZipFile" -DestinationPath "$testDataFolder"
	}

	if (Exist-Container($testDatabaseContainerName)) {
		exec { docker stop "$testDatabaseContainerName" }
		exec { docker rm "$testDatabaseContainerName" }
	}

	exec { docker run -e 'ACCEPT_EULA=Y' --name "$testDatabaseContainerName" -e "SA_PASSWORD=$testDatabasePassword" -p "${testDatabasePort}:1433" -d "mcr.microsoft.com/mssql/server:2019-latest" }
	Write-Host "Pausing for DB to come online"
	Start-Sleep -s 10
	exec { docker exec "$testDatabaseContainerName" mkdir "/var/opt/mssql/backup"}
	exec { docker cp "$testDataFolder/$dbTestDataBakFile" "${testDatabaseContainerName}:/var/opt/mssql/backup/$dbTestDataBakFile" }
	$restoreQuery = "RESTORE DATABASE $dbName FROM DISK='/var/opt/mssql/backup/$dbTestDataBakFile' WITH MOVE 'EdFi_Ods_Populated_Template_log' TO '/var/opt/mssql/data/EdFi_Ods_Populated_Template_log', MOVE 'EdFi_Ods_Populated_Template' TO '/var/opt/mssql/data/EdFi_Ods_Populated_Template.mdf'"
	$restoreQuery | Out-File "$testDataFolder/restore.sql"
	exec { docker cp "$testDataFolder/restore.sql" "${testDatabaseContainerName}:/var/opt/mssql/backup/restore.sql" }
	exec { docker exec "$testDatabaseContainerName" /opt/mssql-tools/bin/sqlcmd -S localhost -U 'sa' -P "$testDatabasePassword" -i '/var/opt/mssql/backup/restore.sql' }
}

task UpdateTestDatabase -description "Runs the migration scripts on the test database" {
	Update-Database localhost $testDatabasePort sa $testDatabasePassword $dbName $env
} 