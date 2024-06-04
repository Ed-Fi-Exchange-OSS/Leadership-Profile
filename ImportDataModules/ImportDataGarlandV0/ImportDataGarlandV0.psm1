# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

using module ..\ImportDataBasicFunctions\ImportDataBasicFunctions.psm1

$ModuleVersion = '1.0.0'
$Description = 'Module with V0 of Garlands functions to import data using the ED-FI API'
$FunctionsToExport = 'Import-EdData'
#====================================
# $dateFormat = 'dd-MM-yyyy'
$dateFormat = 'yyyy-MM-dd'

# ===========================================================================
# P-TESS Configuration
$LocalEducationAgencyId = 4820340
$SchoolYear = 2022
$PerformanceEvaluationTitle          = 'TPESS Fall Evaluation'
$PerformanceEvaluationTypeDescriptor = 'uri://tpdm.ed-fi.org/PerformanceEvaluationTypeDescriptor#Formal Evaluation'
$EvaluationDate                      = '2021-10-01T16:00:00.0Z'
$EvaluationTitle                     = 'Texas Principal Evaluation & Support Systems'
$EvaluationPeriodDescriptor          = 'uri://tpdm.ed-fi.org/EvaluationPeriodDescriptor#BOY'
$TermDescriptor                      = 'uri://ed-fi.org/TermDescriptor#Fall Semester'
$SourceSystemDescriptor              = 'uri://ed-fi.org/SourceSystemDescriptor#District'

$Domains = (
    [PSCustomObject]@{
        Name = 'Domain 1: Strong School Leadership and Planning'
        Indicators = (
            'Indicator 1.1: Ethics and Standards',
            'Indicator 1.2: Schedules for Core Leadership Tasks',
            'Indicator 1.3: Strategic Planning',
            'Indicator 1.4: Change Facilitation',
            'Indicator 1.5: Coaching, Growth, Feedback, and Professional Development'
        )
    },
    [PSCustomObject]@{
        Name = 'Domain 2: Effective, Well-Supported Teachers'
        Indicators = (
            'Indicator 2.1: Human Capital',
            'Indicator 2.2: Talent Management',
            'Indicator 2.3: Observations, Feedback, and Coaching',
            'Indicator 2.4: Professional Development'
        )
    },
    [PSCustomObject]@{
        Name = 'Domain 3: Positive School Culture'
        Indicators = (
            'Indicator 3.1: Safe Environment and High Expectations',
            'Indicator 3.2: Behavioral Expectations and Management Systems',
            'Indicator 3.3: Proactive and Responsive Student Support Services',
            'Indicator 3.4: Involving Families and Community'
        )
    },
    [PSCustomObject]@{
        Name = 'Domain 4: High-Quality Curriculum'
        Indicators = (
            'Indicator 4.1: Standards-based Curricula and Assessments',
            'Indicator 4.2: Instructional Resources and Professional Development'
        )
    },
    [PSCustomObject]@{
        Name = 'Domain 5: Effective Instruction'
        Indicators = (
            'Indicator 5.1: High-Performing Instructional Leadership Team',
            'Indicator 5.2: Objective-Driven Plans',
            'Indicator 5.3: Effective Classroom Routines and Instructional Strategies',
            'Indicator 5.4: Data-Driven Instruction',
            'Indicator 5.5: Response to Intervention'
        )
    }
)

# ===========================================================================
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
            'CAMPUS_EL'    { 'Elementary School' }
            'CAMPUS_MS'    { 'Middle School' }
            'CAMPUS_HS'    { 'High School' }
            'CAMPUS_CO'    { 'Other Combination' }
            Default { $_ }
        }
        [Array]$gradeLevels = GetGradeLevels $schoolCategory

        return [EdFiSchool]@{
            SchoolId                        = [int64]$_.SchoolId
            NameOfInstitution               = [System.Security.SecurityElement]::Escape($_.NameOfInstitution)
            LocalEducationAgencyReference   = [PSCustomObject]@{
                #LocalEducationAgencyId = $_.DistrictId
                LocalEducationAgencyId = $LocalEducationAgencyId
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
            'F' { 'uri://ed-fi.org/SexDescriptor#Female' }
            'M' { 'uri://ed-fi.org/SexDescriptor#Male' }
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

        $levelOfEducation = if ($_.highestCompletedLevelOfEducationDescriptor -eq '') {
            'uri://ed-fi.org/LevelOfEducationDescriptor#' + $(switch ($_.highestCompletedLevelOfEducationDescriptor) {
                    'Bachelors Degree'  { "Bachelor's" }
                    'Doctors Degree'    { 'Doctorate' }
                    'Masters Degree'    { "Master's" }
                    Default             { $_ }
                })
        }

        $email = [System.Security.SecurityElement]::Escape($_.Email).Trim()
        $emails = if (-not [String]::IsNullOrWhiteSpace($email)){(,, [PSCustomObject]@{
            ElectronicMailTypeDescriptor = "uri://ed-fi.org/ElectronicMailTypeDescriptor#Organization"
            ElectronicMailAddress        = $email
        })} else { $null }

        return [EdFiStaff]@{
            StaffUniqueId                              = $staffUniqueId
            LastSurname                                = [System.Security.SecurityElement]::Escape($_.LastSurname)
            FirstName                                  = [System.Security.SecurityElement]::Escape($_.FirstName)
            MiddleName                                 = if(![string]::IsNullOrWhiteSpace($_.MiddleName)){[System.Security.SecurityElement]::Escape($_.MiddleName)}else{$null}
            BirthDate                                  = ([System.Security.SecurityElement]::Escape($_.BirthDate) | Get-Date -Format $dateFormat)
            SexDescriptor                              = $sexDescriptor
            Races                                      = $races
            HispanicLatinoEthnicity                    = $hispanicLatinoEthnicity
            YearsOfPriorProfessionalExperience         = [int][System.Security.SecurityElement]::Escape($_.YearsOfProfessionalExperience)
            ElectronicMails                            = $emails
            #Address                                    = $address
            HighestCompletedLevelOfEducationDescriptor = $levelOfEducation
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

        $separationReasonDescriptorCodeValue = if ( $_.EndDate -ne 'CURRENT' -and ($_.EndDate ?? 'CURRRENT' | Get-Date -Format 'MM-dd') -eq '06-30') { 'Finished Year' } else { $null }

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
        [object]$separationReasonDescriptor = if ($_.EndDate -ne 'CURRENT' ) {
            'uri://ed-fi.org/SeparationReasonDescriptor#' + $(switch ($_.SeparationReason) {
                'Retirement'            { 'Retirement' }
                'Attrition'             { 'Attrition' }
                'Transfer'              { 'Internal Transfer' }
                'Promotion'             { 'Internal Promotion' }
                ''                      { $separationReasonDescriptorCodeValue ?? 'Unknown' }
                Default                 { 'Other' }
            })
        } else { $null }

        return [EdFiStaffOrgEmployment]@{
            EducationOrganizationReference = [PSCustomObject]@{ EducationOrganizationId = [int64]($_.SchoolId) }
            StaffReference                 = [PSCustomObject]@{ StaffUniqueId = $staffUniqueId }
            EmploymentStatusDescriptor     = 'uri://ed-fi.org/EmploymentStatusDescriptor#Contractual'
            HireDate                       = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format $dateFormat)
            EndDate                        = if ($_.EndDate -ne 'CURRENT') { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format $dateFormat) } else { $null }
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
            BeginDate                      = ([System.Security.SecurityElement]::Escape($_.BeginDate) | Get-Date -Format $dateFormat)
            EndDate                        = if ($_.EndDate -ne 'CURRENT') { ([System.Security.SecurityElement]::Escape($_.EndDate) | Get-Date -Format $dateFormat) } else { $null }
#             PositionTitle                  = [System.Security.SecurityElement]::Escape($_.PositionTitle)
            PositionTitle                  = [System.Security.SecurityElement]::Escape($_.StaffClassification)
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
function GetPerformanceEvaluationReference() {
    return
}

function TransformPerformanceEvaluationRating {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject
    )

    process {
        $average =  [float]$InputObject.Average
        $ratingResultTitle = GetRatingResultTitle ([float]::Truncate($average))

        return [EdFiPerformanceEvaluationRating]@{
            PerformanceEvaluationReference             = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                SchoolYear                          = $SchoolYear
                TermDescriptor                      = $TermDescriptor
            }
            PersonReference                            = [PSCustomObject]@{
                PersonId               = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
                SourceSystemDescriptor = $SourceSystemDescriptor
            }
            ActualDate                                 = $EvaluationDate.Substring(0,10)
            PerformanceEvaluationRatingLevelDescriptor = "uri://tpdm.ed-fi.org/PerformanceEvaluationRatingLevelDescriptor#$ratingResultTitle"
            Results                                    = (, [PSCustomObject]@{
                Rating                       = $average
                RatingResultTitle            = $ratingResultTitle
                ResultDatatypeTypeDescriptor = 'uri://ed-fi.org/ResultDatatypeTypeDescriptor#Decimal'
            })
        }
    }
}

function TransformEvaluationRating {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject
    )

    process {
        return [EdFiEvaluationRating]@{
            EvaluationDate                       = $EvaluationDate
            EvaluationReference                  = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                EvaluationTitle                     = $EvaluationTitle
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                SchoolYear                          = $SchoolYear
                TermDescriptor                      = $TermDescriptor
            }
            PerformanceEvaluationRatingReference = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                PersonId                            = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
                SourceSystemDescriptor              = $SourceSystemDescriptor
                SchoolYear                          = $SchoolYear
                TermDescriptor                      = $TermDescriptor
            }
        }
    }
}

function TransformEvaluationObjectiveRating {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject,
        [parameter(Mandatory)]
        [string]$Domain
    )

    process {
        return [EdFiEvaluationObjectiveRating]@{
            EvaluationObjectiveReference   = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationObjectiveTitle            = $Domain
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                EvaluationTitle                     = $EvaluationTitle
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                SchoolYear                          = $SchoolYear
                TermDescriptor                      = $TermDescriptor
            }
            EvaluationRatingReference      = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationDate                      = $EvaluationDate
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                EvaluationTitle                     = $EvaluationTitle
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                PersonId                            = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
                SchoolYear                          = $SchoolYear
                SourceSystemDescriptor              = $SourceSystemDescriptor
                TermDescriptor                      = $TermDescriptor
            }
        }
    }
}

function TransformEvaluationElementRating {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject,
        [parameter(Mandatory)]
        [string]$Domain,
        [parameter(Mandatory)]
        [string]$Indicator
    )

    process {
        $rating =  [float]$InputObject."$Indicator"
        $ratingResultTitle = GetRatingResultTitle ([int][float]::Truncate($rating))

        return [EdFiEvaluationElementRating]@{
            EvaluationElementReference             = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationElementTitle              = $Indicator
                EvaluationObjectiveTitle            = $Domain
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                EvaluationTitle                     = $EvaluationTitle
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                SchoolYear                          = $SchoolYear
                TermDescriptor                      = $TermDescriptor
            }
            EvaluationObjectiveRatingReference     = [PSCustomObject]@{
                EducationOrganizationId             = $LocalEducationAgencyId
                EvaluationDate                      = $EvaluationDate
                EvaluationObjectiveTitle            = $Domain
                EvaluationPeriodDescriptor          = $EvaluationPeriodDescriptor
                EvaluationTitle                     = $EvaluationTitle
                PerformanceEvaluationTitle          = $PerformanceEvaluationTitle
                PerformanceEvaluationTypeDescriptor = $PerformanceEvaluationTypeDescriptor
                PersonId                            = [System.Security.SecurityElement]::Escape($_.StaffUniqueId).Trim()
                SchoolYear                          = $SchoolYear
                SourceSystemDescriptor              = $SourceSystemDescriptor
                TermDescriptor                      = $TermDescriptor
            }
            EvaluationElementRatingLevelDescriptor = "uri://tpdm.ed-fi.org/EvaluationElementRatingLevelDescriptor#$ratingResultTitle"
            Results                                = (,[PSCustomObject]@{
                Rating                       = ([float]::Truncate($rating))
                RatingResultTitle            = $ratingResultTitle
                ResultDatatypeTypeDescriptor = 'uri://ed-fi.org/ResultDatatypeTypeDescriptor#Integer'
            })
        }
    }
}
function TransformTPESS(){
    process {
        Write-Output ($_ | TransformPerformanceEvaluationRating)

        Write-Output ($_ | TransformEvaluationRating)

        foreach ($domain in $Domains) {
            Write-Output ($_ | TransformEvaluationObjectiveRating -Domain $domain.Name)
            foreach ($indicator in $domain.Indicators) {
                Write-Output ($_ | TransformEvaluationElementRating -Domain $domain.Name -Indicator $indicator)
            }
        }
    }
}

Function GetPersonId($Obj){
    return $(switch ($Obj.GetType().Name) {
        'EdFiPerformanceEvaluationRating'   { $Obj.PersonReference.PersonId }
        'EdFiEvaluationRating'              { $Obj.PerformanceEvaluationRatingReference.PersonId }
        'EdFiEvaluationObjectiveRating'     { $Obj.EvaluationRatingReference.PersonId }
        'EdFiEvaluationElementRating'       { $Obj.EvaluationObjectiveRatingReference.PersonId }
        Default { $null }
    })
}

Function Import-EdDataStaff($Config, $PreviousResults) {
    $Headers =
        'SchoolYear',
        'StaffUniqueId',
        'LastSurname',
        'FirstName',
        'MiddleName',
        'SchoolCategory',
        'SchoolId',
        'NameOfInstitution',
        'StaffClassification',
        'BeginDate',
        'EndDate',
        'SeparationReason',
        'Age',
        'YearsOfProfessionalExperience',
        'SexDescriptor',
        'RaceDescriptor',
        'HighestCompletedLevelOfEducationDescriptor',
        'Email'

    Add-Content -Path $Config.V0Files.Errors -Value "`r`n$($Config.V0Files.Employees)`r`n"

    Write-Progress -Activity "Importing data from $($Config.V0Files.Employees)" -PercentComplete -1

    $res = NLoad $Headers $Config.V0Files.Employees |
        Transform |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq 'EdFiSchool'} -GetIdScriptBlock { $args.SchoolId } |
        FilterDistinct -IfScriptBlock {$args.GetType() -eq 'EdFiStaffs'} -GetIdScriptBlock { $args.StaffUniqueId } |
        NPost -Config $Config |
        WriteToFileIfImportError -FilePath $Config.V0Files.Errors |
        CountResults -InitialValues $PreviousResults |
        ShowProggress -Activity "Importing data from $($Config.V0Files.Employees)" |
        Select-Object -Last 1

    return $res
}


Function Import-EdDataTPESS($Config, $PreviousResults) {
    $Headers = 'StaffUniqueId','Full Name','Role','Campus','Admin Years Principal in GISD','Supervisor',
        'Indicator 1.1: Ethics and Standards',
        'Indicator 1.2: Schedules for Core Leadership Tasks',
        'Indicator 1.3: Strategic Planning',
        'Indicator 1.4: Change Facilitation',
        'Indicator 1.5: Coaching, Growth, Feedback, and Professional Development',
        'Indicator 2.1: Human Capital',
        'Indicator 2.2: Talent Management',
        'Indicator 2.3: Observations, Feedback, and Coaching',
        'Indicator 2.4: Professional Development',
        'Indicator 3.1: Safe Environment and High Expectations',
        'Indicator 3.2: Behavioral Expectations and Management Systems',
        'Indicator 3.3: Proactive and Responsive Student Support Services',
        'Indicator 3.4: Involving Families and Community',
        'Indicator 4.1: Standards-based Curricula and Assessments',
        'Indicator 4.2: Instructional Resources and Professional Development',
        'Indicator 5.1: High-Performing Instructional Leadership Team',
        'Indicator 5.2: Objective-Driven Plans',
        'Indicator 5.3: Effective Classroom Routines and Instructional Strategies',
        'Indicator 5.4: Data-Driven Instruction',
        'Indicator 5.5: Response to Intervention',
        'Average'

    Write-Progress -Activity "Importing data from $($Config.V0Files.TPESS)" -PercentComplete -1
    Add-Content -Path $Config.V0Files.Errors -Value "`r`n$($Config.V0Files.TPESS)`r`n"

    $staffUniqueIdWithError = @{}
    $res = NLoad $Headers $Config.V0Files.TPESS |
        TransformTPESS |
        Where-Object { -not $staffUniqueIdWithError.ContainsKey( (GetPersonId $_)) } |
        NPost -Config $Config |
        Tap -ScriptBlock { if($args[0] -is [ImportError]){ $staffUniqueIdWithError[(GetPersonId $args[0].Record)] = $true } }|
        WriteToFileIfImportError -FilePath $Config.V0Files.Errors |
        CountResults -InitialValues $PreviousResults |
        ShowProggress -Activity "Importing data from $($Config.V0Files.TPESS)" |
        Select-Object -Last 1

    return $res
}

Function Import-EdDataProfDev($Config, $PreviousResults) {
    $Headers = 'StaffUniqueId', 'Full Name', 'Email', 'Location', 'Job', 'Position', 'Title', 'CourseStartDate', 'CourseEndDate'

    Write-Progress -Activity "Importing data from $($Config.V0Files.ProfDev)" -PercentComplete -1
    Add-Content -Path $Config.V0Files.Errors -Value "`r`n$($Config.V0Files.ProfDev)`r`n"
}

Function Import-EdData($Config) {
    Set-Content -Path $Config.V0Files.Errors -Value "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')"
    $res = Import-EdDataStaff $Config
    #$res = Import-EdDataTPESS $Config $res
    #$res = Import-EdDataProfDev $Config $res
    return $res
}

Export-ModuleMember -Function Import-EdData
