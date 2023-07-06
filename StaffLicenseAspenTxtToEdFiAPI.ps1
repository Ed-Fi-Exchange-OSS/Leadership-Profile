
# Configuration: Set appopriate values
$Config = @{
	CSVWorkingFile="your_file_here"
	OAuthUrl="/oauth/token"
	BaseApiUrl='https://api.ed-fi.org/v5.3/api'
	EdFiUrl="/data/v3"
	EndPoint="/my-bps/staffLicenses"	
	Key="your_key_here"
	Secret="your_secret_here"
    NamesPace="uri://mybps.org"
    logRootPath="Logs"
}


# Configuration: Set appopriate values
$totalCount = -1

Function PostToEdfi($dataJSON) 
{
    # extract the requiered parameters from the config file.
    $BaseApiUrl= $Config.BaseApiUrl
    $EdFiUrl= $Config.EdFiUrl
    $OAuthUrl= "$BaseApiUrl" + $Config.OAuthUrl
    $EndPoint= $Config.EndPoint
    Write-Host " *** Getting Token ******** "
    # * Get a token *
    $FormData = @{
        Client_id = $Config.Key
        Client_secret = $Config.Secret
        Grant_type = 'client_credentials'
    }

    $OAuthResponse = Invoke-RestMethod -Uri "$OAuthUrl" -Method Post -Body $FormData
    $token = $OAuthResponse.access_token

    $Headers = @{
		"Accept" = "application/json"
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $uri = "$BaseApiUrl" + "$EdFiUrl$EndPoint"
    
    Write-Host "OAuthUrl    *** $OAuthUrl"
    Write-Host "url  ***********$uri"
	
	$i=0
	
	foreach ($rowJSOn in $dataJSON)
	{  
		$i++
		$staffLicense= ConvertTo-Json $rowJSOn
		try {
			$result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $staffLicense
			
			if($i % 500 -eq 0) {
				Write-Host " Processing $i of $totalCount total Staff Licenses ... "   
			}
		}
		catch {
			Write-Host "$i) An error occurred: $uri"
			Write-Host "$staffLicense"
            Write-Host $_
		}
	}

    Write-Host "*** DONE ***"
    
}

Function Create-Json()
{  
      Write-Host "Working file '"  $Config.CSVWorkingFile "'"
      $NamesPace=$Config.NamesPace
      $dataJSON = (
                Import-Csv $Config.CSVWorkingFile  -delimiter "`t"   -Header StaffId,EmplRecord,Name,DeptId,Descr,Accomp,Description,GradeLevel,Stage,
                                                                                  LicenseNo,IssueDate,ExpireDate,LicenseStatus,DateLoaded|Select-Object -Skip 1|
                    ForEach-Object {
                     $GradeLevel =NormalizeGradeLevels $_.'GradeLevel'
                     $LicenseStage =NormalizeStage $_.Stage
                     $LicenseStatus =NormalizeStatus $_.LicenseStatus
                     $LicenseDescription =NormalizeLicenseDescription $_.Description
                     
                           [PSCustomObject]@{                           
                            StaffReference= @{staffUniqueId=[System.Security.SecurityElement]::Escape($_.StaffId)}
                            LicenseApplicableGradeLevels =[System.Security.SecurityElement]::Escape($GradeLevel)                          
                            LicenseNumber=[System.Security.SecurityElement]::Escape($_.LicenseNo)    
                            LicenseIssueDate = [System.Security.SecurityElement]::Escape($_.IssueDate)           
                            LicenseStateIdentifier = [System.Security.SecurityElement]::Escape('MA')
                            LicenseExpirationDate = [System.Security.SecurityElement]::Escape($_.ExpireDate)
                            LicenseEffectiveDate= [System.Security.SecurityElement]::Escape($_.IssueDate)
							LicenseTitle= [System.Security.SecurityElement]::Escape($_.Description) 
                            LicenseDescription=[System.Security.SecurityElement]::Escape($LicenseDescription)
                            Accomp=[System.Security.SecurityElement]::Escape($_.Accomp)
                            LicenseStageDescriptor= "$NamesPace/LicenseStageDescriptor#" + [System.Security.SecurityElement]::Escape($LicenseStage)
                            LicenseStatusDescriptor="$NamesPace/LicenseStatusDescriptor#" + [System.Security.SecurityElement]::Escape($LicenseStatus)
                            LicensingOrganization= [System.Security.SecurityElement]::Escape("org")
                          
                        }

                    })
        $totalCount = ($dataJSON.length)
		Write-Host "**** THERE ARE " ($dataJSON.length)
        PostToEdfi  $dataJSON		
		
 }
 ##Normalize Sheltered English Immersion - Teacher    
 Function NormalizeLicenseDescription($LicenseDescription)
{
    if($LicenseDescription -Contains "Sheltered Eng Immersion - Tch"){
      $LicenseDescription  ="Sheltered English Immersion - Teacher"
    }
    return $LicenseDescription
}


 #NormalizeGradeLevels funtion converts Grade to Grades

Function NormalizeGradeLevels($GradeLevel)
{
    if($GradeLevel -Contains "Grade"){
        if( -not($GradeLevel.Contains("Grades"))){
            $GradeLevel -replace "Grade", "Grades"
        }
    }
    return $GradeLevel
}

#NormalizeStage converts Initial - Extension to  Initial Extension
Function NormalizeStage($Stage)
{
    if($Stage -Contains "Initial - Extension"){
        $Stage ="Initial Extension"
    }
     if($Stage -Contains "Emergency - Extension"){
        $Stage ="Emergency"
    }
    
    return $Stage
}

Function NormalizeStatus($Status)
{
    if(($Status -Contains "Invalid: RETELL/SEI Restricted") -or ($Status -Contains "Invalid: RETELL/SEI Restricted") ){
        $Status ="Invalid: RETELL/SEI R"
    }
     if(($Status -Contains "Licensed: RETELL/SEI Restricte")-or ($Status -Contains "Licensed: RETELL/SEI Restricted") ){
        $Status ="Licensed: RETELL/SEI R"
    }
    if(($Status -Contains "Inactive/Invalid: RETELL/SEI Restricted") ){
        $Status ="Inactive/Invalid: RETELL/SEI R"
    }
    
    return $Status
}

Function RenameLogOnError($logPath)
{
	if($error){		
		Write-Host "*** An ERROR occured. Renaming Log file... ***"
		$date = Get-Date -Format "MM-dd-yyyy-H-m-s"
		$errorLogPath = Join-Path -Path $Config.logRootPath -ChildPath "ERROR_StaffLicenses_Log_$date.log"
		#Rename-Item -Path $logPath -NewName $errorLogPath
        Move-Item -Path $logPath -Destination $errorLogPath

		return $errorLogPath
	}
}

Function Clean20DayOldLogs()
{
	$limit = (Get-Date).AddDays(-20)
	$path = "Logs"
	Get-ChildItem -Path $path -Recurse -Force -Include *.log | Where-Object { !$_.PSIsContainer -and $_.CreationTime -lt $limit } | Remove-Item -Force
}

Function CopyErrorLogToDestination($errorLogPath){
	if($error){	
		$destination = "D:\\BPS Pub\\ftproot\\PeopleSoftFiles\\Logs\\"
		Copy-Item $errorLogPath -Destination $destination
		
		#Clean files older than 5 days in the destination.
		$limit = (Get-Date).AddDays(-5)
		Get-ChildItem -Path $path -Recurse -Force -Include ERROR_StaffLicenses_Log_*.log | Where-Object { !$_.PSIsContainer -and $_.CreationTime -lt $limit } | Remove-Item -Force
	}
}

Function Init()
{   
	$error.clear()
	
    # Enable Logging
    New-Item -ItemType Directory -Force -Path $Config.logRootPath
    $date = Get-Date -Format "MM-dd-yyyy-H-m-s"
    $logPath = Join-Path -Path $Config.logRootPath -ChildPath  "StaffLicenses_Log_$date.log"
    Start-Transcript -Path $logPath

    Write-Host "*** Initializing Ed-Fi > Staff Certification CSV Processing. ***" -ForegroundColor Cyan
    Write-Host "Cheking if the required permisions exists"

    Write-Host "Creating a Json Object"
    Create-Json

    Stop-Transcript
	
	$errorLogPath = RenameLogOnError $logPath
	CopyErrorLogToDestination $errorLogPath
	
	Clean20DayOldLogs
}
# Execute\Init the task
Init
