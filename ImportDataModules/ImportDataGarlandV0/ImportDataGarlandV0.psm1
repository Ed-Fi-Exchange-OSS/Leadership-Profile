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
        $schoolId = if ($_.SchoolId -eq '') { $null } else { [int64]$_.SchoolId }

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
            'Female' { 'uri://ed-fi.org/SexDescriptor#Female' }
            'Male' { 'uri://ed-fi.org/SexDescriptor#Male' }
        }
        #$fullName = [System.Security.SecurityElement]::Escape($_.FullName).Trim() -split ", " -split " "

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

            LastSurname                        = [System.Security.SecurityElement]::Escape($_.LastSurname)
            FirstName                          = [System.Security.SecurityElement]::Escape($_.FirstName)
            MiddleName                         = if(![string]::IsNullOrWhiteSpace($_.MiddleName)){[System.Security.SecurityElement]::Escape($_.MiddleName)}else{$null}
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

function TransformStaffEducationOrganizationEmploymentAssociations {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject
    )
    process {
        if ($_.SchoolId -eq '') { return }
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

        $separationDescriptor = if ($_.EndDate -ne 'CURRENT') {
            'uri://ed-fi.org/SeparationDescriptor#' + $(switch ($_.SeparationReason) {
                'Retirement' { 'Other' }
                'Attrition' { 'Involuntary separation' }
                'Internal Transfer' { 'Mutual agreement' }
                'Internal Promotion' { 'Mutual agreement' }
                Default { 'Other' }
            })
        } else { $null }

        [object]$separationReasonDescriptor = if ($_.EndDate -ne 'CURRENT') {
            'uri://ed-fi.org/SeparationReasonDescriptor#' + $(switch ($_.SeparationReason) {
                'Retirement' { 'Retirement' }
                'Attrition' { 'Layoff' }
                'Internal Transfer' { 'Change of assignment' }
                'Internal Promotion' { 'Change of assignment' }
                Default { 'Other' }
            })
        } else { $null }  

        return [EdFiStaffOrgEmployment]@{
            EducationOrganizationReference = [PSCustomObject]@{ EducationOrganizationId = [int64]($_.SchoolId) }
            StaffReference                 = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
            EmploymentStatusDescriptor     = 'uri://ed-fi.org/EmploymentStatusDescriptor#Contractual'
            HireDate                       = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format 'yyyy-MM-dd')
            EndDate                        = if ($_.EndDate -ne 'CURRENT') { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd') } else { $null }
            SeparationDescriptor           = $separationDescriptor
            SeparationReasonDescriptor     = $separationReasonDescriptor
        }        
    }
}
  
function TransformStaffEducationOrganizationAssignmentAssociations($staffClassificationMap) {
    process {
        if($_.SchoolId -eq '') { return }
        $staffUniqueId = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()

        $staffClassification = [System.Security.SecurityElement]::Escape($_.StaffClassification).Trim()
        $staffClassification = switch ($staffClassification) {
            'AP' { 'Assistant Principal' }
            'Central Office Admin' { 'LEA Administrator' }
            'Central Office Specialist' { 'LEA Specialist' }
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
            EndDate                        = if ($_.EndDate -ne 'CURRENT') { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd') } else { $null }
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

    $employ = ($_ | TransformStaffEducationOrganizationEmploymentAssociations)
    if($employ) { Write-Output $employ }

    $assign = ($_ | TransformStaffEducationOrganizationAssignmentAssociations)
    if($assign) { Write-Output $assign }
  }
}

Function Import-EdData($Config) {
    $Headers = 'StaffUniqueId', 'LastSurname', 'FirstName', 'MiddleName', 'SchoolId', 'SchoolCategory', 'NameOfInstitution', 'StaffClassification', 'BeginDate', 
    'EndDate', 'SeparationReason', 'School Year', 'PositionTitle', 'Age', 'YearsOfProfessionalExperience', 'SexDescriptor', 'RaceDescriptor', 'Degree Level', 'Email'

    #Employee ID,Last Name,First Name,Middle Name,School Number,School Level,School Name,Role,Start Date,End Date,Reason End Date,School Year,Position Title,Age,Tot Yrs Exp,Gender,Ethnicity/Race,Degree Level,Email

    Set-Content -Path $Config.ErrorsOutputFile -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"
    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.V0SourceFile)`r`n"

    Write-Progress -Activity "Importing data from $($Config.V0SourceFile)" -PercentComplete -1

    $res = NLoad $Headers $Config.V0SourceFile | 
        Transform |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq 'EdFiSchool'} -GetIdScriptBlock { $args.SchoolId } |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq 'EdFiStaffs'} -GetIdScriptBlock { $args.StaffUniqueId } |
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.ErrorsOutputFile |
        CountResults |
        ShowProggress -Activity "Importing data from $($Config.V0SourceFile)" |
        Select-Object -Last 1

    return $res 
}

Export-ModuleMember -Function Import-EdData