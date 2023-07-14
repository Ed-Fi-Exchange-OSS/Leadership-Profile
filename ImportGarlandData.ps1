# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFile         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    #StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
    StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffOrgAssignSourceFile = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFile   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"

    OAuthUrl                = "/oauth/token"
    # BaseApiUrl              = 'https://api.ed-fi.org/v5.3/api'
    BaseApiUrl              = 'https://pc-slayerwood:443/WebApi'
    EdFiUrl                 = "/data/v3"
    # Key                     = "RvcohKz9zHI4"
    # Secret                  = "E1iEFusaNf81xzCxwHfbolkC"
    Key                     = "abqdlvFektKS"
    Secret                  = "ec6NlGHpxT09lNisWmMmzViP"

    NamesPace               = "uri://mybps.org"
    logRootPath             = "Logs"

    ISD                     = "Garland ISD"
    ISDCounty               = "Dallas"
    ISDStateAbbreviation    = "TX"

    lastDataInfoFile        = "lastDataInfo.json"
    errorsInfoFile          = "lastDataErrors.json" # TODO
}


$StaffFileHeaders = 'StaffUSI', 'StaffUniqueId', 'FirstName', 'MiddleName', 'LastSurname', 'StaffClassification', 
                    'YearsOfProfessionalExperience', 'BirthDate', 'SexDescriptor', 'RaceDescriptor', 
                    'Email', 'StateAbbreviationDescriptor', 'City', 'PostalCode' 

$SchoolFileHeaders = 'SchoolId', 'DistrictId', 'NameOfInstitution', 'ShortnameOfInstitution', 
                     'SchoolCategory', 'AddressStreet', 'AddressCity', 'AddressZipCode', 'PhoneNumber'

$StaffOrgAssignFileHeaders = 'StaffUniqueId', 'SchoolId', 'PositionTitle', 'BeginDate', 'EndDate', 'SeparationReasonDescriptor'              

# ================================================================================================
# Reuse token
$EdfiToken = $null
function GetToken {
    if( [String]::IsNullOrWhiteSpace($EdfiToken)){
        $OAuthUrl = "$($Config.BaseApiUrl)$($Config.OAuthUrl)"
            
        $FormData = @{
            Client_id     = $Config.Key
            Client_secret = $Config.Secret
            Grant_type    = 'client_credentials'
        }

        $OAuthResponse = Invoke-RestMethod -Uri "$OAuthUrl" -Method Post -Body $FormData
        $EdfiToken = $OAuthResponse.access_token
    }
    return $EdfiToken    
}

function Load-User() {  
    Write-Host "Working file '"  $Config.UsersSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.UsersSourceFle -Header StaffUSI, DistrictId , FirstName, MiddleName, LastName, Email, 
        SexDescriptor, StaffClassification, IsSupportStaff | Select-Object -Skip 1 
    )
    return $dataJSON
}

function NLoad($headers, $sourceFilePath) {
    return Import-Csv $sourceFilePath -Header $headers | Select-Object -Skip 1
}

function NPost(){
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline = $true)]
        $InputObject,
        [Parameter(Mandatory = $true)]
        $EndPoint,
        [ScriptBlock]
        $OnError,
        [ScriptBlock]
        $GetRecordId
    )    

    begin {
        $BaseApiUrl = $Config.BaseApiUrl
        $EdFiUrl = $Config.EdFiUrl
    
        # * Get a token *
        $token = GetToken
        # ================================================================================================
    
        $Headers = @{
            "Accept"        = "application/json"
            "Authorization" = "Bearer $token"
            "Content-Type"  = "application/json"
        }
    
        $uri = "$BaseApiUrl$EdFiUrl$EndPoint"

        $global:PostErrors = 0
        $i = 0
    }
    process {
        $jsonRecord = ConvertTo-Json $InputObject
        try {
            $i++
            $result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $jsonRecord
        }
        catch {
            $global:PostErrors++
            $recordId = if($GetRecordId){ &$GetRecordId $InputObject }
            $ErrorObj = [PSCustomObject]@{
                Reg      = $i
                #Record   = $InputObject
                RecordId = $recordId
                Uri      = $uri
                Error    = ($_.ErrorDetails.Message | ConvertFrom-Json ).message
            }

            if($OnError){
                &$OnError $ErrorObj
            } else {
                #Write-Error "Reg $i, RecordId '$recordId' EndPoint '$EndPoint', Error: $($ErrorObj.Error)"
            }
        }
        return $result
    }
}

function Tap {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline = $true)]
        $InputObject,
        [Parameter(Mandatory = $true)]
        [ScriptBlock]
        $ScriptBlock
    )    

    process {
        &$ScriptBlock $InputObject
        return $InputObject
    }
}

function ShowProggress($valuesType) {
    begin { 
      $i =  0 
      $sw = [System.Diagnostics.Stopwatch]::StartNew()    
    }
    process {
      if ($sw.Elapsed.TotalMilliseconds -ge 500) {
          Write-Progress -Activity "Processing Staff" -Status "Posting $valuesType" -CurrentOperation "Item $i$(if($PostErrors -gt 0){" [$PostErrors errors]"})" -PercentComplete -1
          $sw.Reset(); $sw.Start()
      }
      $i++

      return $_
    }
}

function TransformStaff() {
    process {
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

        #$StaffClassificationMap[$staffUniqueId] = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim()

        $sexDescriptor = switch ([System.Security.SecurityElement]::Escape($_.SexDescriptor)) {
            "F" { "uri://ed-fi.org/SexDescriptor#Female" }
            "M" { "uri://ed-fi.org/SexDescriptor#Male" }
        }
        $middleName = if ([System.Security.SecurityElement]::Escape($_.MiddleName) -eq "") { $null } else { $_.MiddleName }

        $race = [System.Security.SecurityElement]::Escape($_.RaceDescriptor)
        $hispanicLatinoEthnicity = if ($race -eq "Hispanic/Latino") { $true } else { $null }
        $race = switch ($race) {
            "African American" { "Black - African American" }
            "American Indian" { "American Indian - Alaska Native" }
            "Native Hawaiian Pacific Islander" { "Native Hawaiian - Pacific Islander" }
            "Hispanic/Latino" { "Other" }
            "Two or More" { "Other" }
            Default { $race }
        }
        $races = if ($race -ne "") { (, , [PSCustomObject]@{raceDescriptor = 'uri://ed-fi.org/RaceDescriptor#' + $race } ) } else { $null }

        $address = if (($_.StateAbbreviationDescriptor + $_.City + $_.PostalCode).Trim() -eq "") { $null } else {
            (, , [PSCustomObject]@{
                StateAbbreviationDescriptor = [System.Security.SecurityElement]::Escape($_.StateAbbreviationDescriptor)
                City                        = [System.Security.SecurityElement]::Escape($_.City)
                PostalCode                  = [System.Security.SecurityElement]::Escape($_.PostalCode)
            })
        }

        return [PSCustomObject]@{
            StaffUniqueId                      = $staffUniqueId
            # FirstName     = "Secret"
            # LastSurname   = "Secret"
            FirstName                          = [System.Security.SecurityElement]::Escape($_.FirstName)
            LastSurname                        = [System.Security.SecurityElement]::Escape($_.LastSurname)
            MiddleName                         = $middleName
            BirthDate                          = ([System.Security.SecurityElement]::Escape($_.BirthDate) | Get-Date -Format 'yyyy-MM-dd')
            SexDescriptor                      = $sexDescriptor
            Races                              = $races
            HispanicLatinoEthnicity            = $hispanicLatinoEthnicity
            YearsOfPriorProfessionalExperience = [int][System.Security.SecurityElement]::Escape($_.YearsOfProfessionalExperience)
            Email                              = [System.Security.SecurityElement]::Escape($_.Email)
            Address                            = $address
        }    
    }
}

function TransformSchool {
    process {
        $schoolCategory = [System.Security.SecurityElement]::Escape($_.SchoolCategory)
        $gradeLevels = switch ($schoolCategory) {
            "Elementary School" {
                (
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Kindergarten" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#First grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Second grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Third grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Fourth grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Fifth grade" }
                )
            }
            "Middle School" {
                (
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Sixth grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Seventh grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Eighth grade" }
                )
            }
            "High School" {
                (
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Ninth grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Eleventh grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Tenth grade" },
                    [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Twelfth grade" }
                )
            }
            "All Levels" { (, , [PSCustomObject]@{ GradeLevelDescriptor = "uri://ed-fi.org/GradeLevelDescriptor#Other" }) }
            Default { $null }
        }

        $phoneNumber = [System.Security.SecurityElement]::Escape($_.PhoneNumber).Trim()
        $institutionTelephones = if ([String]::IsNullOrWhiteSpace($phoneNumber)) {
            (, , [PSCustomObject]@{
                InstitutionTelephoneNumberTypeDescriptor = "uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"
                TelephoneNumber                          = [System.Security.SecurityElement]::Escape($_.PhoneNumber)
            })
        }
        else { $null }

        return [PSCustomObject]@{
            SchoolId                        = [int64][System.Security.SecurityElement]::Escape($_.SchoolId)
            NameOfInstitution               = [System.Security.SecurityElement]::Escape($_.NameOfInstitution)
            ShortnameOfInstitution          = [System.Security.SecurityElement]::Escape($_.ShortnameOfInstitution)
            LocalEducationAgencyReference   = [PSCustomObject]@{
                #LocalEducationAgencyId = $_.DistrictId
                LocalEducationAgencyId = 4820340
            }
            EducationOrganizationCategories = (, [PSCustomObject]@{
                    EducationOrganizationCategoryDescriptor = "uri://ed-fi.org/EducationOrganizationCategoryDescriptor#School"
                })
            Addresses                       = (, [PSCustomObject]@{
                    AddressTypeDescriptor       = "uri://ed-fi.org/AddressTypeDescriptor#Physical"
                    City                        = [System.Security.SecurityElement]::Escape($_.AddressCity)
                    PostalCode                  = [System.Security.SecurityElement]::Escape($_.AddressZipCode)
                    StateAbbreviationDescriptor = "uri://ed-fi.org/StateAbbreviationDescriptor#" + $Config.ISDStateAbbreviation
                    StreetNumberName            = [System.Security.SecurityElement]::Escape($_.AddressStreet.Trim())
                    NameOfCounty                = $Config.ISDCounty
                })
            InstitutionTelephones           = $institutionTelephones
            SchoolCategories                = (, [PSCustomObject]@{ SchoolCategoryDescriptor = "uri://ed-fi.org/SchoolCategoryDescriptor#" + [System.Security.SecurityElement]::Escape($_.SchoolCategory) })
            GradeLevels                     = $gradeLevels
            Discriminator                   = "edfi.School"
        }    
    }
}

function TransformStaffEducationOrganizationAssignmentAssociations($staffClassificationMap) {
  process {
    $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
    $staffClassification = $staffClassificationMap[$staffUniqueId]

    $staffClassificationDescriptor = if( ![String]::IsNullOrWhiteSpace($staffClassification)){ 
        "uri://ed-fi.org/StaffClassificationDescriptor#$staffClassification" 
    } else { $null}

    [PSCustomObject]@{
        EducationOrganizationReference  = [PSCustomObject]@{ EducationOrganizationId = [int64][System.Security.SecurityElement]::Escape($_.SchoolId) }
        StaffReference                  = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
        BeginDate                       = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format 'yyyy-MM-dd')
        EndDate                         = if($_.EndDate){([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd')} else { $null }
        PositionTitle                   = [System.Security.SecurityElement]::Escape($_.PositionTitle)
        StaffClassificationDescriptor   = $staffClassificationDescriptor # Missing in StaffOrgAssignSourceFle, found in StaffSourceFle
    }    
  }
}
function AddToErrorFile([PSCustomObject]$errors) {
    Add-Content -Path ".\errors.txt" -Value ($errors | Format-List | Out-String).Trim()
}

Function Main() {
    Set-Content -Path ".\errors.txt" -Value ""

    <#
    #>
    Write-Progress -Activity "Processing Schools" -PercentComplete -1
    NLoad $SchoolFileHeaders $Config.SchoolSourceFile | 
        TransformSchool |
        NPost -EndPoint "/ed-fi/schools" -GetRecordId { param($school) $school.SchoolId } -OnError ${function:AddToErrorFile} |
        ShowProggress -valuesType "School" 

    Write-Progress -Activity "Processing Staff" -PercentComplete -1
    $StaffClassificationMap = @{}
    NLoad $StaffFileHeaders $Config.StaffSourceFile | 
        Tap -ScriptBlock { $StaffClassificationMap[[System.Security.SecurityElement]::Escape($_.StaffUniqueId)] = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim() } | 
        TransformStaff | 
        NPost -EndPoint "/ed-fi/staffs" -GetRecordId { param($staff) $staff.StaffUniqueId } -OnError  ${function:AddToErrorFile} |
        ShowProggress -valuesType "Staff" 

    # Write-Progress -Activity "Loading Staff" -PercentComplete -1
    # $res = NLoad $StaffFileHeaders $Config.StaffSourceFile | 
    #     Tap -ScriptBlock { $StaffClassificationMap[[System.Security.SecurityElement]::Escape($_.StaffUniqueId)] = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim() } |
    #     ShowProggress -valuesType "Staff" 

    Write-Progress -Activity "Processing Staff-Education Organization Assignment Associations" -PercentComplete -1
    NLoad $StaffOrgAssignFileHeaders $Config.StaffOrgAssignSourceFile |
        TransformStaffEducationOrganizationAssignmentAssociations $StaffClassificationMap |
        NPost -EndPoint "/ed-fi/staffEducationOrganizationAssignmentAssociations" -GetRecordId { param($staffEdOrg) 
            $staffEdOrg.StaffReference.StaffUniqueId } -OnError ${function:AddToErrorFile} |
        ShowProggress -valuesType "Staff-Education Organization" 

    # $userData = Load-User
    # $userData
}

Main