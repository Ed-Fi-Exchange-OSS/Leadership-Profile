# Configuration: Set appopriate values
$Config = @{
    SchoolSourceFile         = "Data\garland-data-20230704\20230629_GarlandISD_School.CSV"
    #StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.small.CSV"
    StaffSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_Staff.CSV"
    StaffOrgAssignSourceFile = "Data\garland-data-20230704\20230629_GarlandISD_StaffOrgAssign.CSV"
    CertificatesSourceFile   = "Data\garland-data-20230704\20230629_GarlandISD_Certificates.CSV"
    UsersSourceFile          = "Data\garland-data-20230704\20230629_GarlandISD_User.CSV"

    ErrorsOutputFile         = "Data\garland-data-20230704\Errors.txt"

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


Import-Module .\ImportDataModules\ImportDataGarlandV1 -Force

Import-EdData $Config

Remove-Module -Name ImportDataGarlandV1 -Force