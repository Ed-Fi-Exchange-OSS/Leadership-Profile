using module ..\ImportDataBasicFunctions\ImportDataBasicFunctions.psm1

$ModuleVersion = '1.0.0'
$Description = 'Module with V1 of Garlands functions to import data using the ED-FI API'
$FunctionsToExport = 'Import-EdData'

# Region Garland Specific Functions

function TransformSchool {
    process {
        $schoolCategory = [System.Security.SecurityElement]::Escape($_.SchoolCategory)
        [Array]$gradeLevels = GetGradeLevels $schoolCategory

        $phoneNumber = [System.Security.SecurityElement]::Escape($_.PhoneNumber).Trim()
        [Array]$institutionTelephones = if ([String]::IsNullOrWhiteSpace($phoneNumber) -eq $false) {
            (, [PSCustomObject]@{
                InstitutionTelephoneNumberTypeDescriptor = "uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"
                TelephoneNumber                          = [System.Security.SecurityElement]::Escape($_.PhoneNumber)
            })
        }
        else { $null }

        return [EdFiSchool]@{
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
        }    
    }
}

function TransformStaff() {
    process {
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

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

        [array]$address = if (($_.StateAbbreviationDescriptor + $_.City + $_.PostalCode).Trim() -eq "") { $null } else {
            (, [PSCustomObject]@{
                StateAbbreviationDescriptor = [System.Security.SecurityElement]::Escape($_.StateAbbreviationDescriptor)
                City                        = [System.Security.SecurityElement]::Escape($_.City)
                PostalCode                  = [System.Security.SecurityElement]::Escape($_.PostalCode)
            })
        }

        return [EdFiStaff]@{
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

function TransformStaffEducationOrganizationAssignmentAssociations($staffClassificationMap) {
  process {
    $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
    $staffClassification = $staffClassificationMap[$staffUniqueId]

    $staffClassificationDescriptor = if( ![String]::IsNullOrWhiteSpace($staffClassification)){ 
        "uri://ed-fi.org/StaffClassificationDescriptor#$staffClassification"
    } else { $null}

    return [EdFiStaffOrgAssociations]@{
        EducationOrganizationReference  = [PSCustomObject]@{ EducationOrganizationId = [int64][System.Security.SecurityElement]::Escape($_.SchoolId) }
        StaffReference                  = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
        BeginDate                       = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format 'yyyy-MM-dd')
        EndDate                         = if($_.EndDate){([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd')} else { $null }
        PositionTitle                   = [System.Security.SecurityElement]::Escape($_.PositionTitle)
        StaffClassificationDescriptor   = $staffClassificationDescriptor # Missing in StaffOrgAssignSourceFle, found in StaffSourceFle
    }    
  }
}

function Load-User() {  
    Write-Host "Working file '"  $Config.UsersSourceFle "'"
    $dataJSON = (
        Import-Csv $Config.UsersSourceFle -Header StaffUSI, DistrictId , FirstName, MiddleName, LastName, Email, 
        SexDescriptor, StaffClassification, IsSupportStaff | Select-Object -Skip 1 
    )
    return $dataJSON
}

Function Import-EdData($Config) {
    $SchoolFileHeaders = 'SchoolId', 'DistrictId', 'NameOfInstitution', 'ShortnameOfInstitution', 
        'SchoolCategory', 'AddressStreet', 'AddressCity', 'AddressZipCode', 'PhoneNumber'
    $StaffFileHeaders = 'StaffUSI', 'StaffUniqueId', 'FirstName', 'MiddleName', 'LastSurname', 'StaffClassification', 
    'YearsOfProfessionalExperience', 'BirthDate', 'SexDescriptor', 'RaceDescriptor', 
    'Email', 'StateAbbreviationDescriptor', 'City', 'PostalCode' 
    $StaffOrgAssignFileHeaders = 'StaffUniqueId', 'SchoolId', 'PositionTitle', 'BeginDate', 'EndDate', 'SeparationReasonDescriptor'     

    Set-Content -Path $Config.ErrorsOutputFile -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"

    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.SchoolSourceFile)`r`n"

    Write-Progress -Activity "Importing data from $($Config.SchoolSourceFile)" -PercentComplete -1

    $res = NLoad $SchoolFileHeaders $Config.SchoolSourceFile | 
        TransformSchool |
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.ErrorsOutputFile |
        CountResults |
        ShowProggress -Activity "Importing data" -Status "Importing data from $($Config.SchoolSourceFile)" |
        Select-Object -Last 1

    #$res | ConvertTo-Json

    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.StaffSourceFile)`r`n"
    $StaffClassificationMap = @{}
    $res = NLoad $StaffFileHeaders $Config.StaffSourceFile | 
        Tap -ScriptBlock { $StaffClassificationMap[[System.Security.SecurityElement]::Escape($_.StaffUniqueId)] = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim() } | 
        TransformStaff | 
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.ErrorsOutputFile |
        CountResults -InitialValues $res  |
        ShowProggress -Activity "Importing data" -Status "Importing data from $($Config.StaffSourceFile)" |
        Select-Object -Last 1

    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.StaffOrgAssignSourceFile)`r`n"
    $res = NLoad $StaffOrgAssignFileHeaders $Config.StaffOrgAssignSourceFile |
        TransformStaffEducationOrganizationAssignmentAssociations $StaffClassificationMap |
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.ErrorsOutputFile |
        CountResults -InitialValues $res |
        ShowProggress -Activity "Importing data" -Status "Importing data from $($Config.StaffOrgAssignSourceFile)" |
        Select-Object -Last 1

    return (Select-Object @{Name='ISD';Expression={$Config.ISD}},@{Name='Date';Expression={Get-Date}}, *)
}

Export-ModuleMember -Function Import-EdData