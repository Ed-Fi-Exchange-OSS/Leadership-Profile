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

function Update-Database($server, $port, $user, $password, $db_name, $env) {
    $roundhouseConnString="host=$server;port=$port;user id=$user;password=$password;database=$db_name;"
    exec { rh --dt=postgres -f="./db/" -c="$roundhouseConnString" -dc --env $env --noninteractive  } -workingDirectory .
}