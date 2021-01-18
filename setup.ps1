# Add PSGallery
Write-Host 'Add PSGallery repository'
Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted

Write-Host 'Installing PSake for current user'
Install-Module -Name psake -MaximumVersion 4.9.0 -Scope CurrentUser

Write-Host 'Install RoundhousE dotnet tool globally'
dotnet tool install dotnet-roundhouse -g --version 1.2.1

Write-Host 'Install minver-cli'
dotnet tool install --global minver-cli --version 2.3.1
