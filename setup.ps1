# Add PSGallery
Write-Host 'Add PSGallery repository'
Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted

Write-Host 'Installing PSake for current user'
Install-Module -Name psake -MaximumVersion 4.9.0 -Scope CurrentUser

Write-Host 'Install RoundhousE dotnet tool globally'
dotnet tool install dotnet-roundhouse -g --version 1.2.1

Write-Host 'Install minver-cli'
dotnet tool install --global minver-cli --version 2.3.1

Write-Host 'Create envornment file for React'
if (Test-Path .\src\Web\.env -PathType leaf)
{
    Write-Host 'React env file already exists'
}
else
{
    New-Item -Name ".env" -ItemType "file" -Value "REACT_APP_ENCRYPTION_SECRET_KEY=123456" -Path .\src\Web\
}