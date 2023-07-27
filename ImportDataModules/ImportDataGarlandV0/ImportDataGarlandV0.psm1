using module ..\ImportDataBasicFunctions\ImportDataBasicFunctions.psm1

$ModuleVersion = '1.0.0'
$Description = 'Module with V0 of Garlands functions to import data using the ED-FI API'
$FunctionsToExport = 'Import-EdData'

# Region Garland Specific Functions
function TransformSchool {
    process {
        if ($_.SchoolId.Trim() -eq '') {
            return [ImportError]@{            
                Record   = $_
                ErrorDetails    = "SchoolId is null"
            }
        }

        $schoolCategory = [System.Security.SecurityElement]::Escape($_.SchoolCategory)
        $schoolCategory = switch ($schoolCategory) {
            'ES'    { 'Elementary School' }
            'MS'    { 'Middle School' }
            'HS'    { 'High School' }
            'CO'    { 'Other Combination' }
            Default { $_ }
        }
        [Array]$gradeLevels = GetGradeLevels $schoolCategory

        return [EdFiSchool]@{
            SchoolId                        = [int64]$_.SchoolId
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
        
        # Used in app, must be added to descriptors: Hispanic, Two or More Races
        $race = switch ($race) {
            'Asian'                             { 'Asian' }
            'Amer Ind or Alaska Native'         { 'American Indian - Alaska Native' }
            'Black or African American'         { 'Black - African American' }
            'Black or African-American'         { 'Black - African American' }
            'Hispanic/Latino'                   { 'Hispanic' }
            'Native Hawaiian/Other Pac Isl'     { 'Native Hawaiian - Pacific Islander' }
            'Two or More Races'                 { 'Two or More Races' }
            'White'                             { 'White' }
            Default                             { $_ }
        }
        $races = if ($race -ne '') { (,, [PSCustomObject]@{raceDescriptor = 'uri://ed-fi.org/RaceDescriptor#' + $race } ) } else { $null }

        $levelOfEducation = switch(){

        }

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
                'Retirement'            { 'Other' }
                'Attrition'             { 'Involuntary separation' }
                'Transfer'              { 'Mutual agreement' }
                'Promotion'             { 'Mutual agreement' }
                Default                 { 'Other' }
            })
        } else { $null }

        # Used in app, must be added to descriptors: Attrition, Internal Transfer, Internal Promotion
        [object]$separationReasonDescriptor = if ($_.EndDate -ne 'CURRENT') {
            'uri://ed-fi.org/SeparationReasonDescriptor#' + $(switch ($_.SeparationReason) {
                'Retirement'            { 'Retirement' }
                'Attrition'             { 'Attrition' }
                'Transfer'              { 'Internal Transfer' }
                'Promotion'             { 'Internal Promotion' }
                ''                      { 'Unknown' }
                Default                 { 'Other' }
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
            'AP'                        { 'Assistant Principal' }
            'Central Office Admin'      { 'LEA Administrator' }
            'Central Office Specialist' { 'LEA Specialist' }
            Default                     { $_ }
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
#             PositionTitle                  = [System.Security.SecurityElement]::Escape($_.PositionTitle)
#            PositionTitle                  = [System.Security.SecurityElement]::Escape($_.StaffClassification)
            StaffClassificationDescriptor  = $staffClassificationDescriptor
        }    
    }
}

function Transform([scriptblock]$OnError) {
  process {
    $school = ($_ | TransformSchool)
    if($school -is  [ImportError]){ 
        if ($OnError) {
            &$OnError $school
        }
        
        return $school
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
    'EndDate', 'SeparationReason', 'School Year', 'Age', 'YearsOfProfessionalExperience', 'SexDescriptor', 'RaceDescriptor', 'Degree Level', 'Email'

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