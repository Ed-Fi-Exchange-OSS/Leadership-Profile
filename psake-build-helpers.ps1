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

function Update-Database($roundhouseConnString) {
    exec { rh -f="./src/API/DatabaseMigrations/scripts" -c="$roundhouseConnString" -dc --env $env --noninteractive  } -workingDirectory .
}
