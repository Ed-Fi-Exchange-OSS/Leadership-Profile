# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFile         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    #StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
    StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffOrgAssignSourceFile = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFile   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"

    V0SourceFile             = "Data\garland-data-0\20230104_AP_P Info.csv"
    ErrorsOutputFile         = "Data\garland-data-0\Errors.txt"

    #ErrorsOutputFile         = "Data\garland-data-20230704\Errors.txt"

    OAuthUrl                = "/oauth/token"
    # BaseApiUrl              = 'https://api.ed-fi.org/v5.3/api'
    BaseApiUrl              = 'https://pc-slayerwood:443/WebApi'
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

    lastDataInfoFile        = "lastDataInfo.json"
    errorsInfoFile          = "lastDataErrors.json" # TODO
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

SetupPS
Import-Module .\ImportDataModules\ImportDataGarlandV0 -Force

Import-EdData $Config

Remove-Module -Name ImportDataGarlandV0 -Force
CleanPS