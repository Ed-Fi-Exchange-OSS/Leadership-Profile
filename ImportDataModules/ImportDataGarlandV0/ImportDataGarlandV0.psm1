$ModuleVersion = '1.0.0'
$Description = 'Module with V0 of Garlands functions to import data using the ED-FI API'
$FunctionsToExport = 'Import-EdData'

# Region Garland Specific Functions
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

        return [PSCustomObject]@{
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
            ObjectType                         = "staffs"
        }    
    }
}

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

        return [PSCustomObject]@{
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
            ObjectType                      = "schools"
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

        [PSCustomObject]@{
            EducationOrganizationReference = [PSCustomObject]@{ EducationOrganizationId = [int64]($_.SchoolId) }
            StaffReference                 = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
            BeginDate                      = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format 'yyyy-MM-dd')
            EndDate                        = if ($_.EndDate -ne "CURRENT") { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format 'yyyy-MM-dd') } else { $null }
            PositionTitle                  = [System.Security.SecurityElement]::Escape($_.PositionTitle)
            StaffClassificationDescriptor  = $staffClassificationDescriptor
            ObjectType                     = "staffEducationOrganizationAssignmentAssociations"
        }    
    }
}

function Transform([scriptblock]$OnError) {
  process {
    $school = ($_ | TransformSchool)
    if(!$school.SchoolId){ 
        (&$OnError ([PSCustomObject]@{
            Record   = ($_ | ConvertTo-Json)
            Error    = "SchoolId is null"
        }))
        return 
    }
    Write-Output $school

    Write-Output ($_ | TransformStaff )

    $assign = ($_ | TransformStaffEducationOrganizationAssignmentAssociations)
    if($assign) { Write-Output $assign }
  }
}

Function Import-EdData($Config) {
    Import-Module .\ImportDataModules\ImportDataBasicFunctions -Force

    $Headers = 'StaffUniqueId', 'FullName', 'SchoolId', 'SchoolCategory', 'NameOfInstitution', 'StaffClassification', 'BeginDate', 
    'EndDate', 'ReasonEndDate', 'School Year', 'PositionTitle', 'Age', 'YearsOfProfessionalExperience', 'SexDescriptor', 'RaceDescriptor', 'Degree Level', 'Email'

    Set-Content -Path $Config.ErrorsOutputFile -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"

    $OnError = { param($errorObj) AddtoErrorFile -Errors $errorObj -FilePath $Config.ErrorsOutputFile }

    Write-Progress -Activity 'Processing Schools' -PercentComplete -1
    Add-Content -Path $Config.ErrorsOutputFile -Value "`r`n$($Config.SchoolSourceFile)`r`n"

    $res = NLoad $Headers $Config.V0SourceFile | 
        Transform -OnError $OnError |
        ForEach-Object -Process { if($_.ObjectType -eq "schools") { return (FilterDistinct -InputObject $_ -GetIdScriptBlock { $args.SchoolId }) } else { $_ } }|
        ForEach-Object -Process { if($_.ObjectType -eq "staffs") { return (FilterDistinct -InputObject $_ -GetIdScriptBlock { $args.StaffUniqueId }) } else { $_ } } |
        NPost -Config $Config -GetRecordId { param($rec) switch ($rec.ObjectType) {
                'schools' { $rec.SchoolId }
                'staffs' { $rec.StaffUniqueId }
                'staffEducationOrganizationAssignmentAssociations' { $rec.StaffUniqueId }
            } 
        } -OnError $OnError |
        ShowProggress -valuesType '' 

    # $res = NLoad $Headers $Config.V0SourceFile | 
    #     TransformSchool |
    #     FilterDistinct -GetIdScriptBlock { $args.SchoolId } |
    #     NPost -Config $Config -EndPoint '/ed-fi/schools' -GetRecordId { param($rec) $rec.SchoolId } -OnError $OnError |
    #     ShowProggress -valuesType 'School' 

    # $res = NLoad $Headers $Config.V0SourceFile | 
    #     TransformStaff |
    #     FilterDistinct -GetIdScriptBlock { $args.StaffUniqueId } |
    #     NPost -Config $Config -EndPoint '/ed-fi/staffs' -GetRecordId { param($rec) $rec.StaffUniqueId } -OnError $OnError |
    #     ShowProggress -valuesType 'Staff' 

    # $res = NLoad $Headers $Config.V0SourceFile | 
    #     TransformStaffEducationOrganizationAssignmentAssociations |
    #     NPost -Config $Config -EndPoint '/ed-fi/staffEducationOrganizationAssignmentAssociations' -GetRecordId { param($rec) $rec.StaffUniqueId } -OnError $OnError |
    #     ShowProggress -valuesType 'Staff Education Organization Assignment Associations' 

    Remove-Module -Name ImportDataBasicFunctions -Force
}

Export-ModuleMember -Function Import-EdData