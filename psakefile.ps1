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
	$dbTestDataUrl = "https://odsassets.blob.core.windows.net/public/TPDM/EdFi_TPDM_v08_20201109.zip"
	$dbTestdataZipFile = "EdFi_TPDM_v08_20201109.zip"
	$dbTestdataBakFile = "EdFi_TPDM_v08_20201109.bak"
	$testDataFolder = "$projectRootDirectory/testdata"
	$dbName = "EdFi_Ods_Populated_Template"
}

task RemovePublishFolders -description "Removes the publish related folders" {
	remove-directory-silently $publish
	remove-directory-silently $artifactsFolder
	remove-directory-silently "$frontendAppFolder/build"
}

task Publish -description "Publish the primary projects for distribution" -depends RemovePublishFolders {
	$minVersion = minver -t v
	$env:MINVERVERSIONOVERRIDE = $minVersion
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

task TestAPI -description "Run API tests" -depends RecreateTestDatabase, UpdateTestDatabase {
	$env:LPTEST_ConnectionStrings__EdFi = "Server=localhost,$testDatabasePort;Database=$dbName;User Id=sa;Password=$testDatabasePassword;"
	exec { dotnet test "$apiTestProjectFile" }
}

task Test -description "Runs all tests" -depends TestFrontend, TestAPI

task RemoveDbTestContainer -description "Removes the database test container" {
	if (Exist-Container($testDatabaseContainerName)) {
		exec { docker rm "$testDatabaseContainerName" -f }
	}
}

task DownloadDbTestData -description "Downloads the DB test data from blob storage" {
	if (!(Test-Path "$testDataFolder/$dbTestDataZipFile" -PathType Leaf)) {
		Invoke-WebRequest "$dbTestDataUrl" -OutFile "$testDataFolder/$dbTestDataZipFile"
	}
}

task RecreateTestDatabase -description "Starts a docker container with the test database" -depends RemoveDbTestContainer, DownloadDbTestData {
	if (!(Test-Path "$testDataFolder/$dbTestDataBakFile" -PathType Leaf)) {
		Expand-Archive -Path "$testDataFolder/$dbTestDataZipFile" -DestinationPath "$testDataFolder"
	}

	Recreate-Docker-Db $testDatabaseContainerName $testDatabasePort $testDatabasePassword
	Restore-Docker-Db $testDatabaseContainerName $testDataFolder $dbTestDataBakFile $testDatabasePassword $dbName $dbName
}

task UpdateTestDatabase -description "Runs the migration scripts on the test database" {
    $roundhouseConnString="Server=localhost,$testDatabasePort;Database=$dbName;User Id=sa;Password=$testDatabasePassword;"
	Update-Database $roundhouseConnString
} 

task RunTestDatabase -description "Runs the docker container that has the test database" {
	exec { docker start $testDatabaseContainerName }
}

task UpdateLocalDatabase -description "Runs the migration scripts on the local database" {
	Update-Database "Server=localhost;Database=$dbName;Integrated Security=true;"
}

task Clean -description "Clean back to a fresh state" -depends RemoveDbTestContainer, RemovePublishFolders {
	dotnet clean $productSolution
}