# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFle         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    #StaffSourceFle          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
    StaffSourceFle          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffOrgAssignSourceFle = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFle   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFle          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"

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

# ================================================================================================
# TODO: Move code to get token out of this function and reuse the token in multiple calls to PostToEdfi
function PostToEdfi($dataJSON, $endPoint, $valuesType="Records", [Scriptblock]$getId) {
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
        $percent = [Math]::Round((($i * 100) / $totalCount), 1, [MidpointRounding]::ToEven)
        Write-Progress -Activity "Posting $valuesType" -Status "Item $i/$totalCount [$percent %]" -PercentComplete $percent
        $record = ConvertTo-Json $rowJSOn
        try {
            $result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $record
        }
        catch {
            $ErrorMesg = [PSCustomObject]@{
                Reg      = $i
                RecordId = $(&$getId $record)
                Error    = $_.messsage
                Uri      = $uri
            }

            Write-Output $ErrorMesg
        }
    }
    # ================================================================================================

    Write-Host "*** DONE ***"   
}
# ================================================================================================

function Load-Staff() {  
    Write-Host "Working file '$($Config.StaffSourceFle)'"
    $dataJSON = (
        Import-Csv $Config.StaffSourceFle -Header StaffUSI, StaffUniqueId, FirstName, MiddleName, LastSurname, 
        StaffClassification, YearsOfProfessionalExperience, BirthDate, SexDescriptor, RaceDescriptor, 
        Email, StateAbbreviationDescriptor, City, PostalCode | 
        Select-Object -Skip 1 -Unique StaffUSI, StaffUniqueId, FirstName, MiddleName, LastSurname, StaffClassification, 
        @{Name = "YearsOfProfessionalExperience"; Expression = { [int64]$_.YearsOfProfessionalExperience } }, 
        @{Name = "BirthDate"; Expression = { [datetime]$_.BirthDate } },
        SexDescriptor, RaceDescriptor, Email, StateAbbreviationDescriptor, City, PostalCode
    )
    return $dataJSON 
}

<# function NLoad($headers, $filterFn, $transformFn, $postFn) {

} #>

function Post-Staff($jsonData) {
    $endPoint = "/ed-fi/staffs"
    $staffClassification = @{}

    $records = ($jsonData | ForEach-Object {
            $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
            $staffClassification[$staffUniqueId] = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim()
        
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

            [PSCustomObject]@{
                StaffUniqueId                      = $staffUniqueId
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

    #PostToEdfi $records $endPoint "Staff"
    return $staffClassification
    #$records
}

function Load-School() {  
    Write-Host "Working file '$($Config.SchoolSourceFle)'"
    $dataJSON = (
        Import-Csv $Config.SchoolSourceFle -Header SchoolId, DistrictId, NameOfInstitution, ShortnameOfInstitution, 
        SchoolCategory, AddressStreet, AddressCity, AddressZipCode, PhoneNumber |
        Select-Object -Skip 1 @{Name = "SchoolId"; Expression = { [int64]$_.SchoolId } }, 
        @{Name = "DistrictId"; Expression = { [int64]$_.DistrictId } }, 
        NameOfInstitution, ShortnameOfInstitution, SchoolCategory, AddressStreet, AddressCity, AddressZipCode, PhoneNumber  
    )
    return $dataJSON
}

function Post-School($jsonData) {
    $endPoint = "/ed-fi/schools"

    $records = ($jsonData | ForEach-Object {
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


            $phoneNumber = [System.Security.SecurityElement]::Escape($_.PhoneNumber)
            $institutionTelephones = if($phoneNumber.Trim() -ne "") { (,, [PSCustomObject]@{
                    InstitutionTelephoneNumberTypeDescriptor = "uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"
                    TelephoneNumber                          = [System.Security.SecurityElement]::Escape($_.PhoneNumber)
                })
            } else { $null }

            [PSCustomObject]@{
                SchoolId                        = $_.SchoolId
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
        })

    PostToEdfi $records $endPoint "Schools"
    #$records
}

function Load-StaffSchoolAssociation() {  
    Write-Host "Working file $($Config.StaffOrgAssignSourceFle)"
    $dataJSON = (
        Import-Csv $Config.StaffOrgAssignSourceFle -Header StaffUniqueId, SchoolId, PositionTitle, BeginDate, EndDate, 
        SeparationReasonDescriptor | Select-Object -Skip 1 StaffUniqueId, 
        @{Name = "SchoolId"; Expression = { [int64][System.Security.SecurityElement]::Escape($_.SchoolId) } },
        PositionTitle, 
        @{Name = "BeginDate"; Expression = { [datetime]$_.BeginDate } },
        @{Name = "EndDate"; Expression = { [datetime]$_.EndDate } },
        SeparationReasonDescriptor
    )
    return $dataJSON
}

function Post-StaffEducationOrganizationAssignmentAssociations($jsonData, $staffClassificationMap) {
    $endPoint = "/ed-fi/staffEducationOrganizationAssignmentAssociations"

    $records = ($jsonData | ForEach-Object {
            $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
            $staffClassification = $staffClassificationMap[$staffUniqueId]

            $staffClassificationDescriptor = if($staffClassification){ "uri://ed-fi.org/StaffClassificationDescriptor#$staffClassification" } else { $null}

            [PSCustomObject]@{
                EducationOrganizationReference  = [PSCustomObject]@{ EducationOrganizationId = [int64][System.Security.SecurityElement]::Escape($_.SchoolId) }
                StaffReference                  = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
                BeginDate                       = ($_.BeginDate | Get-Date -Format 'yyyy-MM-dd')
                EndDate                         = if($_.EndDate){($_.EndDate | Get-Date -Format 'yyyy-MM-dd')} else { $null }
                PositionTitle                   = [System.Security.SecurityElement]::Escape($_.PositionTitle)
                StaffClassificationDescriptor   = $staffClassificationDescriptor # Missing in StaffOrgAssignSourceFle, found in StaffSourceFle
            }
        })

    PostToEdfi $records $endPoint "Staff-Education Organization Assignment Associations" { param($staff) $staff.StaffUniqueId }
    #$records   
}

function Load-User() {  
    Write-Host "Working file '"  $Config.UsersSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.UsersSourceFle -Header StaffUSI, DistrictId , FirstName, MiddleName, LastName, Email, 
        SexDescriptor, StaffClassification, IsSupportStaff | Select-Object -Skip 1 
    )
    return $dataJSON
}


Function Main() {


    $staffData = Load-Staff   
    $staffClassification = Post-Staff $staffData
 
    #$schoolData = Load-School
    #Post-School $schoolData "School"
    
    $staffSchoolData = Load-StaffSchoolAssociation
    Post-StaffEducationOrganizationAssignmentAssociations $staffSchoolData $staffClassification

    # $userData = Load-User
    # $userData
}

Main