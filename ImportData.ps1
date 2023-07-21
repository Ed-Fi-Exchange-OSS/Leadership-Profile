# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFile         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    #StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
    StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffOrgAssignSourceFile = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFile   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"
    #ErrorsOutputFile         = "Data\garland-data-20230704\Errors.txt"

    V0SourceFile             = "Data\garland-data-0\230718_LeadershipPortal_testdata_GISD.csv"
    ErrorsOutputFile         = "Data\garland-data-0\Errors.txt"


    OAuthUrl                = "/oauth/token"
    # BaseApiUrl              = 'https://api.ed-fi.org/v5.3/api'
    BaseApiUrl              = 'https://pc-slayerwood:443/WebApi'
    #BaseApiUrl              = 'https://EC2AMAZ-JKHA7SB/WebApi'
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

    LastDataInfoFile        = "lastDataInfo.json"
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