function Remove-Directory-Silently($path) {
	if (test-path $path) {
		write-host "Deleting $path"
		Remove-Item $path -recurse -force -ErrorAction SilentlyContinue | out-null
	}
}

function Exist-Container($name) {
    if (docker container ls -f Name=$name -aq) {
        return $true
    }
    return $false
}

function Recreate-Docker-Db($containerName, $dbPort, $dbPass) {
    if(Exist-Container $containerName) {
        Write-Host "Removing $containerName"
        exec { docker rm "$containerName" -f }
    }

    Write-Host "Creating $containerName"
    exec { docker run -e 'ACCEPT_EULA=Y' --name "$containerName" -e "SA_PASSWORD=$dbPass" -p "${dbPort}:1433" -d "mcr.microsoft.com/mssql/server:2019-latest" }
    Write-Host "Pausing for DB to come online"
    Start-Sleep -s 15
    Write-Host "DB ready at $containerName"
}

function Restore-Docker-Db($containerName, $bakDir, $bakFilename, $dbPass, $bakDb, $destDb) {
    exec { docker exec "$containerName" mkdir -p "/var/opt/mssql/backup"}
    Write-Host "Copying $bakDir/$bakFilename to container $containerName"
    exec { docker cp "$bakDir/$bakFilename" "${containerName}:/var/opt/mssql/backup/$bakFilename" }

    $restoreQuery = "RESTORE DATABASE $destDb FROM DISK='/var/opt/mssql/backup/$bakFilename' WITH REPLACE, MOVE '$bakDb`_log' TO '/var/opt/mssql/data/$destDb`_log.ldf', MOVE '$bakDb' TO '/var/opt/mssql/data/$destDb.mdf'"
    $restoreQuery | Out-File "$bakDir/restore.sql"
    Write-Host "Copying restore script to container $containerName"
    exec { docker cp "$bakDir/restore.sql" "${containerName}:/var/opt/mssql/backup/restore.sql" }

    Write-Host "Executing restore on $containerName"
    exec { docker exec "$containerName" /opt/mssql-tools/bin/sqlcmd -S localhost -U 'sa' -P "$dbPass" -i '/var/opt/mssql/backup/restore.sql' }
}


function Update-Database($roundhouseConnString) {
    exec { rh -f="./src/API/DatabaseMigrations/scripts" -c="$roundhouseConnString" -dc --env $env --noninteractive  } -workingDirectory .
}
