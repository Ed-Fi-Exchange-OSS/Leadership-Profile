$ISD = "Garland ISD"
$lastDataInfoFile= "lastDataInfo.json"

# Configuration: Set appopriate values
$Config = @{
	CSVWorkingFile="all_data.csv"
	OAuthUrl="/oauth/token"
	BaseApiUrl='https://api.ed-fi.org/v5.3/api'
	EdFiUrl="/data/v3"
	# EndPoint="/ed-fi/staffs"
	Key="RvcohKz9zHI4"
	Secret="E1iEFusaNf81xzCxwHfbolkC"
    NamesPace="uri://mybps.org"
    logRootPath="Logs"
}


# Configuration: Set appopriate values
$totalCount = -1

Function PostToEdfi($dataJSON, $endPoint) 
{
    # Extract the requiered parameters from the config file.
    $BaseApiUrl= $Config.BaseApiUrl
    $EdFiUrl= $Config.EdFiUrl
    $OAuthUrl= "$BaseApiUrl" + $Config.OAuthUrl
    # $EndPoint= $Config.EndPoint
    $EndPoint= $endPoint
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
		$staffRecord = ConvertTo-Json $rowJSOn
		try {
			$result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $staffRecord
            Write-Host "*** RESULT:  $result ***"
			
			if($i % 500 -eq 0) {
				Write-Host " Processing $i of $totalCount total Staff Assignments... "   
			}
		}
		catch {
			Write-Host "$i) An error occurred: $uri"
			Write-Host "$staffRecord"
            Write-Host $_
		}
	}

    Write-Host "*** DONE ***"
    
}

Function Create-Json()
{  
      Write-Host "Working file '"  $Config.CSVWorkingFile "'"
    #   $NamesPace = $Config.NamesPace
      $dataJSON = (
                Import-Csv $Config.CSVWorkingFile -Header SchoolYear, SchoolLevel, SchoolNumber, SchoolName, Job,
                     PositionTitle, EmployeeID, FirstName, LastName, StartDate, EndDate,
                     ReasonEndDate, Age, TotYrsExp, Gender, Race, TRSYrs, RetElig |Select-Object -Skip 1|
                    ForEach-Object {
                     
                           [PSCustomObject]@{
                            SchoolYear = [System.Security.SecurityElement]::Escape($_.SchoolYear)
                            SchoolLevel = [System.Security.SecurityElement]::Escape($_.SchoolLevel)
                            SchoolNumber = [System.Security.SecurityElement]::Escape($_.SchoolNumber)
                            SchoolName = [System.Security.SecurityElement]::Escape($_.SchoolName)
                            Job = [System.Security.SecurityElement]::Escape($_.Job)
                            PositionTitle = [System.Security.SecurityElement]::Escape($_.PositionTitle)
                            StaffUniqueId =[System.Security.SecurityElement]::Escape($_.EmployeeID)
                            FirstName = [System.Security.SecurityElement]::Escape($_.FirstName)
                            LastSurname = [System.Security.SecurityElement]::Escape($_.LastName)
                            StartDate = [System.Security.SecurityElement]::Escape($_.StartDate)
                            EndDate = [System.Security.SecurityElement]::Escape($_.EndDate)
                            ReasonEndDate = [System.Security.SecurityElement]::Escape($_.ReasonEndDate)
                            Age = [System.Security.SecurityElement]::Escape($_.Age)
                            TotYrsExp = [System.Security.SecurityElement]::Escape($_.TotYrsExp)
                            Gender = [System.Security.SecurityElement]::Escape($_.Gender)
                            Race = [System.Security.SecurityElement]::Escape($_.Race)
                            TRSYrs = [System.Security.SecurityElement]::Escape($_.TRSYrs)
                            RetElig = [System.Security.SecurityElement]::Escape($_.RetElig)
                            # LicenseStageDescriptor= "$NamesPace/LicenseStageDescriptor#" + [System.Security.SecurityElement]::Escape($LicenseStage)
                            # LicenseStatusDescriptor="$NamesPace/LicenseStatusDescriptor#" + [System.Security.SecurityElement]::Escape($LicenseStatus)
                          
                        }

                    })
        $totalCount = ($dataJSON.length)
		Write-Host "**** THERE ARE " ($dataJSON.length)
		Write-Host "**** THIS ARE " $dataJSON
        # PostToEdfi  $dataJSON
        ProcessStaff $dataJSON
        ProcessSchools $dataJSON
        ProcessAssignments $dataJSON
		
 }

    ##Process Staff
    Function ProcessStaff($jsonData) {
        Write-Host "**** PROCESSING STAFF ***"
    
        $staffRecords = ($jsonData | ForEach-Object {
            [PSCustomObject]@{
                StaffUniqueId =[System.Security.SecurityElement]::Escape($_.StaffUniqueId)
                FirstName = [System.Security.SecurityElement]::Escape($_.FirstName)
                LastSurname = [System.Security.SecurityElement]::Escape($_.LastSurname)
            }
        })
    
        Write-Host "**** Posting STAFF *** $staffRecords"
    
        $endPoint = "/ed-fi/staffs"
    
        PostToEdfi $staffRecords $endPoint
    
    }
    ##Process EducationOrganization
    Function ProcessSchools($jsonData) {
        Write-Host "**** PROCESSING STAFF ***"
    
        $schoolRecords = ($jsonData | ForEach-Object {
            [PSCustomObject]@{
                EducationOrganizationId = [System.Security.SecurityElement]::Escape($_.SchoolNumber)
                NameOfInstitution =[System.Security.SecurityElement]::Escape($_.SchoolName)
                Discriminator = "edfi.School"
            }
        })
    
        Write-Host "**** Posting STAFF *** $schoolRecords"
    
        $endPoint = "/ed-fi/schools"
    
        PostToEdfi $schoolRecords $endPoint
    
    }    ##Process EducationOrganizationAssignments
    Function ProcessSchools($jsonData) {
        Write-Host "**** PROCESSING STAFF ***"
    
        $schoolRecords = ($jsonData | ForEach-Object {
            [PSCustomObject]@{
                EducationOrganizationId = [System.Security.SecurityElement]::Escape($_.SchoolNumber)
                NameOfInstitution =[System.Security.SecurityElement]::Escape($_.SchoolName)
                Discriminator = "edfi.School"
            }
        })
    
        Write-Host "**** Posting STAFF *** $schoolRecords"
    
        $endPoint = "/ed-fi/schools"
    
        PostToEdfi $schoolRecords $endPoint
    
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
		$destination = "C:\\Users\\Juan\\Workspace\\DDN\\Leadership-Profile\\Logs"
		# $destination = "D:\\BPS Pub\\ftproot\\PeopleSoftFiles\\Logs\\"
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

    Write-Host "*** Initializing Ed-Fi > Staff CSV Processing. ***" -ForegroundColor Cyan
    Write-Host "Cheking if the required permisions exists"

    Write-Host "Creating a Json Object"
    Create-Json

    Write-Host "Creating JSon file with ingest info"
    UpdateLastDataInfoFile $ISD $totalCount $lastDataInfoFile

    Stop-Transcript
	
	$errorLogPath = RenameLogOnError $logPath
	CopyErrorLogToDestination $errorLogPath
	
	Clean20DayOldLogs
}

Function UpdateLastDataInfoFile()
{
    Param (
        [Parameter(Mandatory=$true)]
        [string] $isd,
        [Parameter(Mandatory=$true)]
        [int] $ItemsProccessed,
        [Parameter(Mandatory=$true)]
        [string] $File
        )

    $lastDataInfo = @"
{
    "ISD": "Garland ISD",
    "Date": "$(Get-Date (Get-Date).ToUniversalTime() -UFormat '+%Y-%m-%dT%H:%M:%S.000Z')",
    "ItemsProccessed": $ItemsProccessed
}
"@

    Write-Host $lastDataInfo
    $lastDataInfo | Out-File $File
}

# Execute\Init the task
Init
