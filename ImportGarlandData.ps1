# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFle       = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    StaffSourceFle        = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffSchoolSourceFle  = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFle = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFle        = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"
    
    OAuthUrl              = "/oauth/token"
    # BaseApiUrl            = 'https://api.ed-fi.org/v5.3/api'
    BaseApiUrl            = 'https://pc-slayerwood:443/WebApi'
    EdFiUrl               = "/data/v3"
    # Key                   = "RvcohKz9zHI4"
    # Secret                = "E1iEFusaNf81xzCxwHfbolkC"
    Key                   = "abqdlvFektKS"
    Secret                = "ec6NlGHpxT09lNisWmMmzViP"
    NamesPace             = "uri://mybps.org"
    logRootPath           = "Logs"
    ISD                  = "Garland ISD"
    lastDataInfoFile     = "lastDataInfo.json"    
}

# ================================================================================================
function PostToEdfi($dataJSON, $endPoint) {
    $BaseApiUrl = $Config.BaseApiUrl
    $EdFiUrl = $Config.EdFiUrl
    $OAuthUrl = "$BaseApiUrl" + $Config.OAuthUrl
    $EndPoint = $endPoint

    # Get Token ================================================================================================
    Write-Host " *** Getting Token ******** "
    # * Get a token *
    $FormData = @{
        Client_id     = $Config.Key
        Client_secret = $Config.Secret
        Grant_type    = 'client_credentials'
    }

    $OAuthResponse = Invoke-RestMethod -Uri "$OAuthUrl" -Method Post -Body $FormData
    $token = $OAuthResponse.access_token
    # ================================================================================================

    $Headers = @{
        "Accept"        = "application/json"
        "Authorization" = "Bearer $token"
        "Content-Type"  = "application/json"
    }

    $uri = "$BaseApiUrl" + "$EdFiUrl$EndPoint"
    
    Write-Host "Toke    *** $token"
    Write-Host "OAuthUrl    *** $OAuthUrl"
    Write-Host "url  ***********$uri"
	
    $i = 0
    $totalCount = ($dataJSON.length)
    # ================================================================================================
    # Post info

    foreach ($rowJSOn in $dataJSON) {  
        $i++
        Write-Progress -Activity 'Posting staff' -Status "Item $i/$totalCount" -PercentComplete (($i*100)/$totalCount)

        $staffRecord = ConvertTo-Json $rowJSOn
        try {
            Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $staffRecord
        }
        catch {
            Write-Host "$i) An error occurred: $uri"
            Write-Host "$staffRecord"
            Write-Host $_
        }
    }
    # ================================================================================================

    Write-Host "*** DONE ***"   
}
# ================================================================================================

function Load-Staff() {  
    Write-Host "Working file '"  $Config.StaffSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.StaffSourceFle -Header StaffUSI, StaffUniqueId, FirstName, MiddleName, LastSurname, 
        StaffClassification, YearsOfProfessionalExperience, BirthDate, SexDescriptor, RaceDescriptor, 
        Email, StateAbbreviationDescriptor, City, PostalCode | 
        Select-Object -Skip 1 -Unique StaffUSI, StaffUniqueId, FirstName, MiddleName, LastSurname, StaffClassification, 
        @{Name="YearsOfProfessionalExperience";Expression={[int64]$_.YearsOfProfessionalExperience}}, 
        @{Name="BirthDate";Expression={[datetime]$_.BirthDate}},         
        SexDescriptor, RaceDescriptor, Email, StateAbbreviationDescriptor, City, PostalCode
    )
    return $dataJSON 

}

function Post-Staff($jsonData) {
    $endPoint = "/ed-fi/staffs"

    $records = ($jsonData | ForEach-Object {
            $sexDescriptor = switch ([System.Security.SecurityElement]::Escape($_.SexDescriptor)) {
                "F" { "uri://ed-fi.org/SexDescriptor#Female" }
                "M" { "uri://ed-fi.org/SexDescriptor#Male" }
            }
            $middleName = if ([System.Security.SecurityElement]::Escape($_.MiddleName) -eq "") { $null } else { $_.MiddleName }

            $race = [System.Security.SecurityElement]::Escape($_.RaceDescriptor)
            $hispanicLatinoEthnicity = if($race -eq "Hispanic/Latino") { $true } else { $null }
            $race = switch ($race) {
                "African American" { "Black - African American" }
                "American Indian" { "American Indian - Alaska Native" }
                "Native Hawaiian Pacific Islander" { "Native Hawaiian - Pacific Islander" }
                "Hispanic/Latino" { "Other" }
                "Two or More" { "Other" }
                Default { $race }
            }
            $races = if($race -ne "") { ( ,,[PSCustomObject]@{raceDescriptor = 'uri://ed-fi.org/RaceDescriptor#' + $race})} else {$null}

            $address = if(($_.StateAbbreviationDescriptor + $_.City + $_.PostalCode).Trim() -eq "") { $null } else {
                (,[PSCustomObject]@{
                    StateAbbreviationDescriptor         = [System.Security.SecurityElement]::Escape($_.StateAbbreviationDescriptor)
                    City                                = [System.Security.SecurityElement]::Escape($_.City)
                    PostalCode                          = [System.Security.SecurityElement]::Escape($_.PostalCode)
                })
            }

            [PSCustomObject]@{
                StaffUniqueId                      = [System.Security.SecurityElement]::Escape($_.StaffUniqueId)
                # FirstName     = "Secret"
                # LastSurname   = "Secret"
                FirstName                          = [System.Security.SecurityElement]::Escape($_.FirstName)
                LastSurname                        = [System.Security.SecurityElement]::Escape($_.LastSurname)
                MiddleName                         = $middleName
                BirthDate                          = ($_.BirthDate | Get-Date -Format 'yyyy-MM-dd')
                SexDescriptor                      = $sexDescriptor
                Races                              = $races
                HispanicLatinoEthnicity            = $hispanicLatinoEthnicity
                YearsOfPriorProfessionalExperience = $_.YearsOfProfessionalExperience
                Email                              = [System.Security.SecurityElement]::Escape($_.Email)
                Address                            = $address
            }
        })

    PostToEdfi $records $endPoint
    #$records
}

function Load-School() {  
    Write-Host "Working file '"  $Config.SchoolSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.SchoolSourceFle -Header EducationOrganizationId, DistrictId, NameOfInstitution, ShortnameOfInstitution, 
        SchoolCategory, AddressStreet, AddressCity, AddressZipCode, PhoneNumber | Select-Object -Skip 1 
    )
    return $dataJSON
}

function Load-StaffSchool() {  
    Write-Host "Working file '"  $Config.StaffSchoolSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.StaffSchoolSourceFle -Header UniqueId, SchoolId, PositionTitle, BeginDate, EndDate, 
        SeparationReasonDescriptor | Select-Object -Skip 1 
    )
    return $dataJSON
}

function Load-User() {  
    Write-Host "Working file '"  $Config.UsersSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.UsersSourceFle -Header StaffUSI, DistrictId , FirstName, MiddleName, LastName, Email, 
        SexDescriptor, StaffClassification, IsSupportStaff | Select-Object -Skip 1 
    )
    return $dataJSON
}

function Post-School($jsonData) {
    $endPoint = "/ed-fi/schools"

    $records = ($jsonData | ForEach-Object {
            [PSCustomObject]@{
                EducationOrganizationId = [System.Security.SecurityElement]::Escape($_.SchoolNumber)
                NameOfInstitution       = [System.Security.SecurityElement]::Escape($_.SchoolName)
                Discriminator           = "edfi.School"
            }
        })

    PostToEdfi $records $endPoint
}

Function Main() {
    $staffData = (Load-Staff)
    Post-Staff $staffData
    #$staffData

    # $schoolData = Load-School
    # $schoolData
    
    # $staffSchoolData = Load-StaffSchool
    # $staffSchoolData

    # $userData = Load-User
    # $userData
}

Main