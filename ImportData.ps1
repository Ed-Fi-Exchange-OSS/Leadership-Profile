# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

# Configuration: Set appopriate values
$Config = @{
    V1Files         = [PSCustomObject]@{
        School         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
        #Staff          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
        Staff          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
        StaffOrgAssign = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
        Certificates   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
        Users          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"
        Errors         = "Data\garland-data-20230704\Errors.txt"
    }

    V0Files         = [PSCustomObject]@{
        #Employees = "Data\garland-data-0\230731_GISD_LeadershipPortal_testdata4.xlsx - Employees.csv"
        Employees = "Data\garland-data-0\full_set_update.csv"
        TPESS     = "Data\garland-data-0\230731_GISD_LeadershipPortal_testdata4.xlsx - AP_P T-PESS.csv"
        ProfDev   = "Data\garland-data-0\230731_GISD_LeadershipPortal_testdata4.xlsx - AP_P PD.csv"
        Errors    = "Data\garland-data-0\Errors.txt"
    }

    OAuthUrl             = "/oauth/token"
    EdFiUrl              = "/data/v3"

    # BaseApiUrl           = 'https://api.ed-fi.org/v5.3/api'
    # Key                  = "RvcohKz9zHI4"
    # Secret               = "E1iEFusaNf81xzCxwHfbolkC"

    # BaseApiUrl           = 'https://garlandleadership.developers.net/WebApi'
    BaseApiUrl           = 'https://edfipilot.developers.net/WebApi'
    # BaseApiUrl           = 'https://ec2amaz-jkha7sb/WebApi'
    Key                  = "abqdlvFektKS"
    Secret               = "ec6NlGHpxT09lNisWmMmzViP"

    NamesPace            = "uri://mybps.org"
    logRootPath          = "Logs"

    ISD                  = "Garland ISD"
    ISDCounty            = "Dallas"
    ISDStateAbbreviation = "TX"

    LastDataInfoFile     = "lastDataInfo.json"
}

function SetupPS() {
    if ( $PSVersionTable.PSVersion.Major -ge 7)
    {
        $script:currentStyle = $PSStyle.Progress.View
        $PSStyle.Progress.View = "Classic"
    }
}

function CleanPS() {
    if ( $PSVersionTable.PSVersion.Major -ge 7)
    {
        $PSStyle.Progress.View = $script:currentStyle
    }
}

function Main {
    SetupPS
    Import-Module .\ImportDataModules\ImportDataGarlandV0 -Force

    $res = (Import-EdData $Config)
    $res = $res | Select-Object @{Name='ISD';Expression={$Config.ISD}}, @{Name='Date';Expression={Get-Date}}, *

    Set-Content -Path $Config.LastDataInfoFile -Value ($res | ConvertTo-Json)
    $res | Format-List

    Remove-Module -Name ImportDataGarlandV0 -Force
    #CleanPS
}

Main
