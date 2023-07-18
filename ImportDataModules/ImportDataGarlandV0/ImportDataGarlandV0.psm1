using module ..\ImportDataBasicFunctions\ImportDataBasicFunctions.psm1

$ModuleVersion = '1.0.0'
$Description = 'Module with V0 of Garlands functions to import data using the ED-FI API'
$FunctionsToExport = 'Import-EdData'

# Region Garland Specific Functions
function TransformSchool {
    process {
        $schoolCategory = [System.Security.SecurityElement]::Escape($_.SchoolCategory)
        $schoolCategory = switch ($schoolCategory) {
            'ES' { 'Elementary School' }
            'MS' { 'Middle School' }
            'HS' { 'High School' }
            'CO' { 'Other Combination' }
            Default { $_ }
        }
        [Array]$gradeLevels = GetGradeLevels $schoolCategory
        $schoolId = if ($_.SchoolId -eq '') { $null } else { [System.Nullable[int64]]$_.SchoolId }

        return [EdFiSchool]@{
            SchoolId                        = $schoolId
            NameOfInstitution               = [System.Security.SecurityElement]::Escape($_.NameOfInstitution)
            LocalEducationAgencyReference   = [PSCustomObject]@{
                #LocalEducationAgencyId = $_.DistrictId
                LocalEducationAgencyId = 4820340
            }
            EducationOrganizationCategories = (, [PSCustomObject]@{
                    EducationOrganizationCategoryDescriptor = 'uri://ed-fi.org/EducationOrganizationCategoryDescriptor#School'
                })
            
            SchoolCategories                = (, [PSCustomObject]@{ SchoolCategoryDescriptor = 'uri://ed-fi.org/SchoolCategoryDescriptor#' + [System.Security.SecurityElement]::Escape($schoolCategory) })
            GradeLevels                     = $gradeLevels
        }    
    }
}

function TransformStaff() {
    process {
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

        $sexDescriptor = switch ([System.Security.SecurityElement]::Escape($_.SexDescriptor)) {
            'F' { 'uri://ed-fi.org/SexDescriptor#Female' }
            'M' { 'uri://ed-fi.org/SexDescriptor#Male' }
        }
        $fullName = [System.Security.SecurityElement]::Escape($_.FullName).Trim() -split ", " -split " "

        $race = [System.Security.SecurityElement]::Escape($_.RaceDescriptor)
        $hispanicLatinoEthnicity = if ($race -eq 'Hispanic/Latino') { $true } else { $null }
        $race = switch ($race) {
            'Black or African American'         { 'Black - African American' }
            'Amer Ind or Alaska Native'         { 'American Indian - Alaska Native' }
            'Native Hawaiian/Other Pac Isl'     { 'Native Hawaiian - Pacific Islander' }
            'Hispanic/Latino'                   { 'Other' }
            'Two or More Races'                 { 'Other' }
            Default { $race }
        }
        $races = if ($race -ne '') { (,, [PSCustomObject]@{raceDescriptor = 'uri://ed-fi.org/RaceDescriptor#' + $race } ) } else { $null }

        return [EdFiStaff]@{
            StaffUniqueId                      = $staffUniqueId

            LastSurname                        = $fullName[0]
            FirstName                          = $fullName[1]
            MiddleName                         = $fullName[2]
            #BirthDate                          = ([System.Security.SecurityElement]::Escape($_.BirthDate) | Get-Date -Format 'yyyy-MM-dd')
            SexDescriptor                      = $sexDescriptor
            Races                              = $races
            HispanicLatinoEthnicity            = $hispanicLatinoEthnicity
            YearsOfPriorProfessionalExperience = [int][System.Security.SecurityElement]::Escape($_.YearsOfProfessionalExperience)
            Email                              = [System.Security.SecurityElement]::Escape($_.Email)
            #Address                            = $address
        }    
    }
}

function TransformStaffEducationOrganizationAssignmentAssociations($staffClassificationMap) {
    process {
        if($_.SchoolId -eq "") { return }
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

        $staffClassification = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim()
        $staffClassification = switch ($staffClassification) {
            "AP" { "Assistant Principal" }
            "Central Office Admin" { "LEA Administrator" }
            "Central Office Specialist" { "LEA Specialist" }
            Default { $_ }
        }
        $staffClassificationDescriptor = if ( ![String]::IsNullOrWhiteSpace($staffClassification)) { 
            "uri://ed-fi.org/StaffClassificationDescriptor#$staffClassification" 
        }
        else { $null }

        return [EdFiStaffOrgAssociations]@{
            EducationOrganizationReference = [PSCustomObject]@{ EducationOrganizationId = [int64]($_.SchoolId) }
            StaffReference                 = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
            BeginDate                      = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format 'yyyy-MM-dd')
            EndDate                        = if ($_.EndDate -ne "CURRENT") { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd') } else { $null }
            PositionTitle                  = [System.Security.SecurityElement]::Escape($_.PositionTitle)
            StaffClassificationDescriptor  = $staffClassificationDescriptor
        }    
    }
}

function Transform([scriptblock]$OnError) {
  process {
    $school = ($_ | TransformSchool)
    if(!$school.SchoolId){ 
        $importError = [ImportError]@{            
            Record   = $_
            ErrorDetails    = "SchoolId is null"
        }
        if ($OnError) {
            &$OnError $importError
        } else {
            Write-Output $importError
        }
        return
    }
    Write-Output $school

    Write-Output ($_ | TransformStaff )

    $assign = ($_ | TransformStaffEducationOrganizationAssignmentAssociations)
    if($assign) { Write-Output $assign }
  }
}

Function Import-EdData($Config) {
    $Headers = 'StaffUniqueId', 'FullName', 'SchoolId', 'SchoolCategory', 'NameOfInstitution', 'StaffClassification', 'BeginDate', 
    'EndDate', 'ReasonEndDate', 'School Year', 'PositionTitle', 'Age', 'YearsOfProfessionalExperience', 'SexDescriptor', 'RaceDescriptor', 'Degree Level', 'Email'

    Set-Content -Path $Config.ErrorsOutputFile -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"
    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.SchoolSourceFile)`r`n"

    Write-Progress -Activity "Importing data from $($Config.SchoolSourceFile)" -PercentComplete -1

    $res = NLoad $Headers $Config.V0SourceFile | 
        Transform |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq "EdFiSchool"} -GetIdScriptBlock { $args.SchoolId } |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq "EdFiStaffs"} -GetIdScriptBlock { $args.StaffUniqueId } |
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.ErrorsOutputFile |
        CountResults |
        ShowProggress -Activity "Importing data from $($Config.SchoolSourceFile)" |
        Select-Object -Last 1 @{Name='ISD';Expression={"Garland ISD"}},@{Name='Date';Expression={Get-Date}}, *

    $res | ConvertTo-Json
}

Export-ModuleMember -Function Import-EdData