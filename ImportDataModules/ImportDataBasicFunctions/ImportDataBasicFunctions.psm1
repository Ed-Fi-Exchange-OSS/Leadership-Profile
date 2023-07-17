$ModuleVersion = '1.0.0'
$Description = 'Module with basic functions to import data using the ED-FI API'
$FunctionsToExport = 'NLoad', 'NPost', 'Tap', 'ShowProggress', 'AddToErrorFile'

# Region Base functions
# ================================================================================================

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

function NLoad($headers, $sourceFilePath) {
    return Import-Csv $sourceFilePath -Header $headers | Select-Object -Skip 1
}

function NPost() {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline = $true)]
        $InputObject,
        #[Parameter(Mandatory = $true)]
        $EndPoint,
        [Parameter(Mandatory = $true)]
        $Config,
        [ScriptBlock]
        $OnError,
        [ScriptBlock]
        $GetRecordId
    )    

    begin {
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
    
        $uri = "$BaseApiUrl$EdFiUrl$EndPoint"

        $i = 0
    }
    process {
        if($InputObject.ObjectType){
            $uri = "$BaseApiUrl$EdFiUrl/ed-fi/$($InputObject.ObjectType)"
        }
        $jsonRecord = ConvertTo-Json $InputObject
        try {
            $i++
            $result = Invoke-RestMethod -Uri $uri -Method Post -Headers $Headers -Body $jsonRecord
        }
        catch {
            $recordId = if ($GetRecordId) { &$GetRecordId $InputObject }
            $ErrorObj = [PSCustomObject]@{
                Reg      = $i
                Uri      = $uri
                RecordId = $recordId
                Record   = ($InputObject | ConvertTo-Json)
                Error    = $_.ErrorDetails.Message
            }

            if ($OnError) {
                &$OnError $ErrorObj
            }
            else {
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
        $i = 0 
        $sw = [System.Diagnostics.Stopwatch]::StartNew()    
    }
    process {
        if ($sw.Elapsed.TotalMilliseconds -ge 500) {
            Write-Progress -Activity 'Processing Staff' -Status "Posting $valuesType" -CurrentOperation "Item $i$(if($script:PostErrors -gt 0){" [$script:PostErrors errors]"})" -PercentComplete -1
            $sw.Reset(); $sw.Start()
        }
        $i++

        return $_
    }
}

$script:PostErrors = 0
function AddToErrorFile([PSCustomObject]$Errors, $FilePath = '.\errors.txt') {
    $script:PostErrors++
    Add-Content -Path $FilePath -Value "$(($Errors | Format-List | Out-String).Trim())`r`n"
}

function FilterDistinct {
    [CmdletBinding()]
    param(
        [parameter(ValueFromPipeline)]
        $InputObject,
        [Parameter(Mandatory = $true)]
        [ScriptBlock]
        $GetIdScriptBlock
    )

    begin {
        $IdList = @{}
    }
    process {
        $id = (&$GetIdScriptBlock $InputObject)
        if ([String]::IsNullOrWhiteSpace($id)) {
            return $InputObject
        }
        if (!$IdList.ContainsKey($id)) {
            $IdList[$id] = $true
            return $InputObject
        }
    }
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