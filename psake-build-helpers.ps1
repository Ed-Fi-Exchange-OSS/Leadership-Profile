function Remove-Directory-Silently($path) {
	if (test-path $path) {
		write-host "Deleting $path"
		Remove-Item $path -recurse -force -ErrorAction SilentlyContinue | out-null
	}
}
