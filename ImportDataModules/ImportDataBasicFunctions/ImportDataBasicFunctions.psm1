$ModuleVersion = '1.0.0'
$Description = 'Module with basic functions to import data using the ED-FI API'
#$FunctionsToExport = 'NLoad', 'NPost', 'Tap', 'ShowProggress', 'AddToErrorFile'


# ===================================================================================================================
# EDFI Functions
# Reuse token
$script:EdfiToken = $null
function GetToken {
    param (
        [Parameter(Mandatory = $true)]
        $Config
    )    

    if ( [String]::IsNullOrWhiteSpace($EdfiToken)) {
        $OAuthUrl = "$($Config.BaseApiUrl)$($Config.OAuthUrl)"
            
        $FormData = @{
            Client_id     = $Config.Key
            Client_secret = $Config.Secret
            Grant_type    = 'client_credentials'
        }

        Write-Progress -Activity 'Getting token' -PercentComplete -1
        $OAuthResponse = Invoke-RestMethod -Uri "$OAuthUrl" -Method Post -Body $FormData
        $script:EdfiToken = $OAuthResponse.access_token
    }
    return $script:EdfiToken    
}

function GetGradeLevels {
    param (
        $SchoolCategory
    )
    
    $gradeLevels = switch ($SchoolCategory) {
        'Elementary School' {
            (
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Kindergarten' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#First grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Second grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Third grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Fourth grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Fifth grade' }
            )
        }
        'Middle School' {
            (
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Sixth grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Seventh grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Eighth grade' }
            )
        }
        'High School' {
            (
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Ninth grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Eleventh grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Tenth grade' },
                [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Twelfth grade' }
            )
        }
        Default { @(,, [PSCustomObject]@{ GradeLevelDescriptor = 'uri://ed-fi.org/GradeLevelDescriptor#Other' } ) }
    }
    return $gradeLevels
}

function GetEndPointByType([Type]$ClassType){
    switch ($ClassType.Name) {
        'EdFiSchool' { '/ed-fi/schools' }
        'EdFiStaff' { '/ed-fi/staffs' }
        'EdFiStaffOrgEmployment' { '/ed-fi/staffEducationOrganizationEmploymentAssociations' }
        'EdFiStaffOrgAssociations' { '/ed-fi/staffEducationOrganizationAssignmentAssociations' }
        'EdFiPerformanceEvaluationRating' { '/tpdm/performanceEvaluationRatings'}
        Default {$null} # TODO: Must throw an exception
    }
}

function GetRatingResultTitle([int]$Result) {
    return $(switch ($Result) {
        1 { 'Ineffective' }
        2 { 'Developing' }
        3 { 'Effective' }
        4 { 'Accomplished' }
        5 { 'Highly Effective' }
        Default {}
    })
}
# ===================================================================================================================

# ===================================================================================================================
# Pipeline functions
function NLoad($headers, $sourceFilePath, $Skip = 1) {
    return Import-Csv $sourceFilePath -Header $headers | Select-Object -Skip $Skip
}

function NPost() {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline = $true)]
        $InputObject,
        [Parameter(Mandatory = $true)]
        $Config,
        [ScriptBlock]
        $OnError,
        $EndPoint
    )    

    begin {
        $supportedTypes = ([EdFiSchool], [EdFiStaff], [EdFiStaffOrgEmployment], [EdFiStaffOrgAssociations], [EdFiPerformanceEvaluationRating])
        $BaseApiUrl = $Config.BaseApiUrl
        $EdFiUrl = $Config.EdFiUrl
    
        # * Get a token *
        $token = GetToken $Config
        # ================================================================================================
    
        $Headers = @{
            'Accept'        = 'application/json'
            'Authorization' = "Bearer $token"
            'Content-Type'  = 'application/json'
        }
            
        $uri = if ($PSBoundParameters.ContainsKey('EndPoint')) { "$BaseApiUrl$EdFiUrl$EndPoint" } else { $null }
    }
    process {
        if ($InputObject.GetType() -notin $supportedTypes){ return $InputObject }
        if (-not $PSBoundParameters.ContainsKey('EndPoint')) {
            $EndPoint = GetEndPointByType $InputObject.GetType()
            $uri = "$BaseApiUrl$EdFiUrl$EndPoint"
        }
        $jsonRecord = ConvertTo-Json $InputObject
        try {
            $result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $jsonRecord
            Write-Output $InputObject
        }
        catch {
            $ErrorObj = [ImportError]@{
                Uri             = $uri
                Record          = $InputObject
                ErrorDetails    = $_.ErrorDetails
            }

            if ($OnError) {
                &$OnError $ErrorObj
            } else {
                Write-Output $ErrorObj
            }
        }
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

function CountResults {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputValue,
        $InitialValues)
    begin {
        $reduced = if ($InitialValues) {
            $InitialValues
        }
        else {
            [PSCustomObject]@{
                Success = 0
                Errors  = 0
            }   
        } 
    }
    process {
        if ($InputValue -is [ImportError]) {
            $reduced.Errors++
        }
        else {
            $reduced.Success++
        }
        return $reduced
    }
}

function ShowProggress($Activity = 'Processing', $Status) {
    begin { 
        $reduced = [PSCustomObject]@{
            Success = 0
            Errors = 0
        }
        $sw = [System.Diagnostics.Stopwatch]::StartNew()    
    }
    process {
        if(($_ | Get-Member -name "Success" )){
            $reduced = $_
        } else {
            $reduced.Success++
        }
        if ($sw.Elapsed.TotalMilliseconds -ge 500) {
            $progressParams = @{
                Activity = $Activity
                Status = $Status
                CurrentOperation = "$($reduced.Success) posted successfully$(if($reduced.Errors -gt 0){" [$($reduced.Errors) errors]"})" 
                PercentComplete = -1
            }
            
            if ([string]::IsNullOrWhiteSpace($status)) {
                $progressParams.Remove("Status")
            }

            Write-Progress @progressParams
            $sw.Reset(); $sw.Start()
        }

        return $_
    }
}

function AddToErrorFile([PSCustomObject]$Errors, $FilePath = '.\errors.txt') {
    Add-Content -Path $FilePath -Value "$(($Errors | Format-List | Out-String).Trim())`r`n"
}

function WriteToFileIfImportError {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject,
        $FilePath = '.\errors.txt'
    )
    process {
        if($InputObject -is [ImportError]){
            $toWrite = [PSCustomObject]@{
                Uri          = $InputObject.Uri
                Record       = ($InputObject.Record | ConvertTo-Json -Depth 10)
                ErrorDetails = ($InputObject.ErrorDetails | ConvertTo-Json -Depth 10)
            }
            Add-Content -Path $FilePath -Value "$(($toWrite | Format-List | Out-String).Trim())`r`n"    
        }
        return $InputObject
    }
} 

function FilterDistinct {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject,
        [Parameter(Mandatory = $true)]
        [ScriptBlock]
        $GetIdScriptBlock,
        [ScriptBlock]
        $IfScriptBlock = {$true}
    )

    begin {
        $IdList = @{}
    }
    process {
        $id = (&$GetIdScriptBlock $InputObject)
        if ([String]::IsNullOrWhiteSpace($id) -or ((&$IfScriptBlock $InputObject) -eq $false)) {
            return $InputObject
        }
        if (!$IdList.ContainsKey($id)) {
            $IdList[$id] = $true
            return $InputObject
        }
    }
}

class ImportError {
    [string]$Uri
    [object]$Record
    [object]$ErrorDetails
}
# ===================================================================================================================

# ===================================================================================================================
#Classes EdFi

class EdFiSchool {
    [int64]$SchoolId
    [string]$NameOfInstitution
    [string]$ShortnameOfInstitution
    [Object]$LocalEducationAgencyReference
    #[int64]$LocalEducationAgencyId
    [Object[]]$Addresses
    [Object[]]$InstitutionTelephones
    [Object[]]$EducationOrganizationCategories
    [Object[]]$SchoolCategories
    [Object[]]$GradeLevels
}

class EdFiStaff {
    [string]$StaffUniqueId
    [string]$LastSurname
    [string]$FirstName
    [Object]$MiddleName # it's a string but object is used to be able to set it null
    [string]$BirthDate
    [string]$SexDescriptor
    [Object[]]$Races
    [bool]$HispanicLatinoEthnicity
    [int]$YearsOfPriorProfessionalExperience
    [Object[]]$ElectronicMails
    [Object[]]$Address
    [Object]$HighestCompletedLevelOfEducationDescriptor
}

class EdFiStaffOrgEmployment {
    [object]$EducationOrganizationReference
    [object]$StaffReference
    [string]$EmploymentStatusDescriptor
    [string]$HireDate
    [object]$EndDate # it's a string but object is used to be able to set it null
    [object]$SeparationDescriptor  # it's a string but object is used to be able to set it null
    [object]$SeparationReasonDescriptor  # it's a string but object is used to be able to set it null
}

class EdFiStaffOrgAssociations {
    [object]$EducationOrganizationReference
    [object]$StaffReference
    [string]$BeginDate
    [string]$EndDate
    [string]$PositionTitle
    [string]$StaffClassificationDescriptor
}

class EdFiPerformanceEvaluationRating {
    [Object]$PerformanceEvaluationReference
    [Object]$PersonReference
    [string]$ActualDate
    [string]$PerformanceEvaluationRatingLevelDescriptor
    [Object[]]$Results
}

# ===================================================================================================================
