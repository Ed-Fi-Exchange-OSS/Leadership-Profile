using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MockHttpHandlerForProfiles : HttpMessageHandler
    {
        public IDictionary<string,string> JsonStore { get; set; } = new Dictionary<string, string>();
        public MockHttpHandlerForProfiles()
        {
            var staffs = @"[{
		        ""id"": ""ff5e7ac270494bd091932e283e65b0e2"",
		        ""staffUniqueId"": ""207265"",
		        ""birthDate"": ""1985-09-04"",
		        ""firstName"": ""Alvin"",
		        ""hispanicLatinoEthnicity"": false,
		        ""lastSurname"": ""Lee"",
		        ""loginId"": ""alee"",
		        ""middleName"": ""Peter"",
		        ""oldEthnicityDescriptor"": ""uri://ed-fi.org/OldEthnicityDescriptor#Hispanic"",
		        ""personalTitlePrefix"": ""Mr"",
		        ""sexDescriptor"": ""uri://ed-fi.org/SexDescriptor#Male"",
		        ""yearsOfPriorProfessionalExperience"": 14.00,
		        ""addresses"": [],
		        ""credentials"": [],
		        ""electronicMails"": [{
			        ""electronicMailAddress"": ""AlvinLee@edfi.org"",
			        ""electronicMailTypeDescriptor"": ""uri://ed-fi.org/ElectronicMailTypeDescriptor#Work""
		        }],
		        ""identificationCodes"": [{
			        ""staffIdentificationSystemDescriptor"": ""uri://ed-fi.org/StaffIdentificationSystemDescriptor#State"",
			        ""identificationCode"": ""207265""
		        }],
		        ""identificationDocuments"": [],
		        ""internationalAddresses"": [],
		        ""languages"": [],
		        ""otherNames"": [],
		        ""personalIdentificationDocuments"": [{
			        ""identificationDocumentUseDescriptor"": ""uri://ed-fi.org/IdentificationDocumentUseDescriptor#Personal Information Verification"",
			        ""personalInformationVerificationDescriptor"": ""uri://ed-fi.org/PersonalInformationVerificationDescriptor#Other official document""
		        }],
		        ""races"": [{
			        ""raceDescriptor"": ""uri://ed-fi.org/RaceDescriptor#Native Hawaiian - Pacific Islander""
		        }],
		        ""recognitions"": [],
		        ""telephones"": [],
		        ""tribalAffiliations"": [],
		        ""visas"": [],
		        ""_etag"": ""5249003312776265927""
	        },
	        {
		        ""id"": ""814dd35c8ced431c850aee2113e7def0"",
		        ""staffUniqueId"": ""207288"",
		        ""birthDate"": ""1965-08-19"",
		        ""firstName"": ""Barry"",
		        ""highestCompletedLevelOfEducationDescriptor"": ""uri://ed-fi.org/LevelOfEducationDescriptor#Master's"",
		        ""hispanicLatinoEthnicity"": false,
		        ""lastSurname"": ""Tanner"",
		        ""loginId"": ""btanner"",
		        ""oldEthnicityDescriptor"": ""uri://ed-fi.org/OldEthnicityDescriptor#Hispanic"",
		        ""personalTitlePrefix"": ""Mr"",
		        ""sexDescriptor"": ""uri://ed-fi.org/SexDescriptor#Male"",
		        ""yearsOfPriorProfessionalExperience"": 30.00,
		        ""addresses"": [],
		        ""credentials"": [],
		        ""electronicMails"": [{
			        ""electronicMailAddress"": ""BarryTanner@edfi.org"",
			        ""electronicMailTypeDescriptor"": ""uri://ed-fi.org/ElectronicMailTypeDescriptor#Work""
		        }],
		        ""identificationCodes"": [{
			        ""staffIdentificationSystemDescriptor"": ""uri://ed-fi.org/StaffIdentificationSystemDescriptor#State"",
			        ""identificationCode"": ""207288""
		        }],
		        ""identificationDocuments"": [],
		        ""internationalAddresses"": [],
		        ""languages"": [],
		        ""otherNames"": [],
		        ""personalIdentificationDocuments"": [{
			        ""identificationDocumentUseDescriptor"": ""uri://ed-fi.org/IdentificationDocumentUseDescriptor#Personal Information Verification"",
			        ""personalInformationVerificationDescriptor"": ""uri://ed-fi.org/PersonalInformationVerificationDescriptor#State-issued ID""
		        }],
		        ""races"": [{
			        ""raceDescriptor"": ""uri://ed-fi.org/RaceDescriptor#American Indian - Alaska Native""
		        }],
		        ""recognitions"": [],
		        ""telephones"": [],
		        ""tribalAffiliations"": [],
		        ""visas"": [],
		        ""_etag"": ""5249003312776265927""
	        }
         ]";
			var staffsAndOrgs = @"[{
		            ""id"": ""09d7f5a563e64564a46fa9f6218e7291"",
		            ""educationOrganizationReference"": {
			            ""educationOrganizationId"": 255901044,
			            ""link"": {
				            ""rel"": ""School"",
				            ""href"": ""/ed-fi/schools/71fc34a5e9624d3c81b7edadd0b63b38""
			            }
		            },
		            ""staffReference"": {
			            ""staffUniqueId"": ""207265"",
			            ""link"": {
				            ""rel"": ""Staff"",
				            ""href"": ""/ed-fi/staffs/ff5e7ac270494bd091932e283e65b0e2""
			            }
		            },
		            ""beginDate"": ""2008-04-17"",
		            ""staffClassificationDescriptor"": ""uri://ed-fi.org/StaffClassificationDescriptor#Other"",
		            ""positionTitle"": ""Middle School Clerk"",
		            ""_etag"": ""5249003312860014076""
	            },
	            {
		            ""id"": ""c85bb3abfd254f0c9aad009d6fdc93df"",
		            ""educationOrganizationReference"": {
			            ""educationOrganizationId"": 255901,
			            ""link"": {
				            ""rel"": ""LocalEducationAgency"",
				            ""href"": ""/ed-fi/localEducationAgencies/2ec6bf70e0df431b9bf89ea623ab6e06""
			            }
		            },
		            ""staffReference"": {
			            ""staffUniqueId"": ""207288"",
			            ""link"": {
				            ""rel"": ""Staff"",
				            ""href"": ""/ed-fi/staffs/814dd35c8ced431c850aee2113e7def0""
			            }
		            },
		            ""beginDate"": ""2005-01-25"",
		            ""staffClassificationDescriptor"": ""uri://ed-fi.org/StaffClassificationDescriptor#LEA System Administrator"",
		            ""positionTitle"": ""LEA System Administrator"",
		            ""_etag"": ""5249003312856377761""
	            }
            ]";
            var schools = @"[
              {
                ""id"": ""d8da827ace254a57bd4dad3f60774fab"",
                ""localEducationAgencyReference"": {
                  ""localEducationAgencyId"": 255901,
                  ""link"": {
                    ""rel"": ""LocalEducationAgency"",
                    ""href"": ""/ed-fi/localEducationAgencies/2ec6bf70e0df431b9bf89ea623ab6e06""
                  }
                },
                ""schoolId"": 255901001,
                ""nameOfInstitution"": ""Grand Bend High School"",
                ""operationalStatusDescriptor"": ""uri://ed-fi.org/OperationalStatusDescriptor#Active"",
                ""shortNameOfInstitution"": ""GBHS"",
                ""webSite"": ""http://www.GBISD.edu/GBHS/"",
                ""administrativeFundingControlDescriptor"": ""uri://ed-fi.org/AdministrativeFundingControlDescriptor#Public School"",
                ""charterStatusDescriptor"": ""uri://ed-fi.org/CharterStatusDescriptor#Not a Charter School"",
                ""schoolTypeDescriptor"": ""uri://ed-fi.org/SchoolTypeDescriptor#Regular"",
                ""titleIPartASchoolDesignationDescriptor"": ""uri://ed-fi.org/TitleIPartASchoolDesignationDescriptor#Not A Title I School"",
                ""addresses"": [
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Mailing"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334-2035"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""P.O. Box 2035"",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  },
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Physical"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""456 Elm Street"",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  }
                ],
                ""educationOrganizationCategories"": [
                  {
                    ""educationOrganizationCategoryDescriptor"": ""uri://ed-fi.org/EducationOrganizationCategoryDescriptor#School""
                  }
                ],
                ""identificationCodes"": [
                  {
                    ""educationOrganizationIdentificationSystemDescriptor"": ""uri://ed-fi.org/EducationOrganizationIdentificationSystemDescriptor#SEA"",
                    ""identificationCode"": ""255901001""
                  }
                ],
                ""indicators"": [
                  {
                    ""indicatorDescriptor"": ""uri://gbisd.edu/IndicatorDescriptor#Retention Rate"",
                    ""indicatorGroupDescriptor"": ""uri://gbisd.edu/IndicatorGroupDescriptor#Staff Indicator"",
                    ""indicatorLevelDescriptor"": ""uri://gbisd.edu/IndicatorLevelDescriptor#High Retention"",
                    ""indicatorValue"": ""90"",
                    ""periods"": [
                      {
                        ""beginDate"": ""2010-08-29"",
                        ""endDate"": ""2011-06-30""
                      }
                    ]
                  }
                ],
                ""institutionTelephones"": [
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Fax"",
                    ""telephoneNumber"": ""(950) 393-3156""
                  },
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"",
                    ""telephoneNumber"": ""(950) 325-9465""
                  }
                ],
                ""internationalAddresses"": [],
                ""schoolCategories"": [
                  {
                    ""schoolCategoryDescriptor"": ""uri://ed-fi.org/SchoolCategoryDescriptor#High School""
                  }
                ],
                ""gradeLevels"": [
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Eleventh grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Ninth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Tenth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Twelfth grade""
                  }
                ],
                ""_etag"": ""5249003312085007491""
              },
              {
                ""id"": ""71fc34a5e9624d3c81b7edadd0b63b38"",
                ""localEducationAgencyReference"": {
                  ""localEducationAgencyId"": 255901,
                  ""link"": {
                    ""rel"": ""LocalEducationAgency"",
                    ""href"": ""/ed-fi/localEducationAgencies/2ec6bf70e0df431b9bf89ea623ab6e06""
                  }
                },
                ""schoolId"": 255901044,
                ""nameOfInstitution"": ""Grand Bend Middle School"",
                ""operationalStatusDescriptor"": ""uri://ed-fi.org/OperationalStatusDescriptor#Active"",
                ""shortNameOfInstitution"": ""GBMS"",
                ""webSite"": ""http://www.GBISD.edu/GBMS/"",
                ""administrativeFundingControlDescriptor"": ""uri://ed-fi.org/AdministrativeFundingControlDescriptor#Public School"",
                ""charterStatusDescriptor"": ""uri://ed-fi.org/CharterStatusDescriptor#Not a Charter School"",
                ""schoolTypeDescriptor"": ""uri://ed-fi.org/SchoolTypeDescriptor#Regular"",
                ""titleIPartASchoolDesignationDescriptor"": ""uri://ed-fi.org/TitleIPartASchoolDesignationDescriptor#Not A Title I School"",
                ""addresses"": [
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Mailing"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334-3393"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""P.O. Box 3393"",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  },
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Physical"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""9993 Space Blvd."",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  }
                ],
                ""educationOrganizationCategories"": [
                  {
                    ""educationOrganizationCategoryDescriptor"": ""uri://ed-fi.org/EducationOrganizationCategoryDescriptor#School""
                  }
                ],
                ""identificationCodes"": [
                  {
                    ""educationOrganizationIdentificationSystemDescriptor"": ""uri://ed-fi.org/EducationOrganizationIdentificationSystemDescriptor#SEA"",
                    ""identificationCode"": ""255901044""
                  }
                ],
                ""indicators"": [
                  {
                    ""indicatorDescriptor"": ""uri://gbisd.edu/IndicatorDescriptor#Retention Rate"",
                    ""indicatorGroupDescriptor"": ""uri://gbisd.edu/IndicatorGroupDescriptor#Staff Indicator"",
                    ""indicatorLevelDescriptor"": ""uri://gbisd.edu/IndicatorLevelDescriptor#Medium Retention"",
                    ""indicatorValue"": ""87"",
                    ""periods"": [
                      {
                        ""beginDate"": ""2010-08-29"",
                        ""endDate"": ""2011-06-30""
                      }
                    ]
                  }
                ],
                ""institutionTelephones"": [
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Fax"",
                    ""telephoneNumber"": ""(950) 366-9374""
                  },
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"",
                    ""telephoneNumber"": ""(950) 325-3164""
                  }
                ],
                ""internationalAddresses"": [],
                ""schoolCategories"": [
                  {
                    ""schoolCategoryDescriptor"": ""uri://ed-fi.org/SchoolCategoryDescriptor#Middle School""
                  }
                ],
                ""gradeLevels"": [
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Eighth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Sixth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Seventh grade""
                  }
                ],
                ""_etag"": ""5249003312085007491""
              },
              {
                ""id"": ""c07205a7a3694893a8bfa04082fbc09b"",
                ""localEducationAgencyReference"": {
                  ""localEducationAgencyId"": 255901,
                  ""link"": {
                    ""rel"": ""LocalEducationAgency"",
                    ""href"": ""/ed-fi/localEducationAgencies/2ec6bf70e0df431b9bf89ea623ab6e06""
                  }
                },
                ""schoolId"": 255901107,
                ""nameOfInstitution"": ""Grand Bend Elementary School"",
                ""operationalStatusDescriptor"": ""uri://ed-fi.org/OperationalStatusDescriptor#Active"",
                ""shortNameOfInstitution"": ""GBES"",
                ""webSite"": ""http://www.GBISD.edu/GBES/"",
                ""administrativeFundingControlDescriptor"": ""uri://ed-fi.org/AdministrativeFundingControlDescriptor#Public School"",
                ""charterStatusDescriptor"": ""uri://ed-fi.org/CharterStatusDescriptor#Not a Charter School"",
                ""schoolTypeDescriptor"": ""uri://ed-fi.org/SchoolTypeDescriptor#Regular"",
                ""titleIPartASchoolDesignationDescriptor"": ""uri://ed-fi.org/TitleIPartASchoolDesignationDescriptor#Not A Title I School"",
                ""addresses"": [
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Mailing"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334-9991"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""P.O. Box 9991"",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  },
                  {
                    ""addressTypeDescriptor"": ""uri://ed-fi.org/AddressTypeDescriptor#Physical"",
                    ""city"": ""Grand Bend"",
                    ""postalCode"": ""73334"",
                    ""stateAbbreviationDescriptor"": ""uri://ed-fi.org/StateAbbreviationDescriptor#TX"",
                    ""streetNumberName"": ""52 Halsey Ave."",
                    ""nameOfCounty"": ""Williston"",
                    ""periods"": []
                  }
                ],
                ""educationOrganizationCategories"": [
                  {
                    ""educationOrganizationCategoryDescriptor"": ""uri://ed-fi.org/EducationOrganizationCategoryDescriptor#School""
                  }
                ],
                ""identificationCodes"": [
                  {
                    ""educationOrganizationIdentificationSystemDescriptor"": ""uri://ed-fi.org/EducationOrganizationIdentificationSystemDescriptor#SEA"",
                    ""identificationCode"": ""255901107""
                  }
                ],
                ""indicators"": [
                  {
                    ""indicatorDescriptor"": ""uri://gbisd.edu/IndicatorDescriptor#Retention Rate"",
                    ""indicatorGroupDescriptor"": ""uri://gbisd.edu/IndicatorGroupDescriptor#Staff Indicator"",
                    ""indicatorLevelDescriptor"": ""uri://gbisd.edu/IndicatorLevelDescriptor#High Retention"",
                    ""indicatorValue"": ""94"",
                    ""periods"": [
                      {
                        ""beginDate"": ""2010-08-29"",
                        ""endDate"": ""2011-06-30""
                      }
                    ]
                  }
                ],
                ""institutionTelephones"": [
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Fax"",
                    ""telephoneNumber"": ""(950) 325-1976""
                  },
                  {
                    ""institutionTelephoneNumberTypeDescriptor"": ""uri://ed-fi.org/InstitutionTelephoneNumberTypeDescriptor#Main"",
                    ""telephoneNumber"": ""(950) 367-1346""
                  }
                ],
                ""internationalAddresses"": [],
                ""schoolCategories"": [
                  {
                    ""schoolCategoryDescriptor"": ""uri://ed-fi.org/SchoolCategoryDescriptor#Elementary School""
                  }
                ],
                ""gradeLevels"": [
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#First grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Fourth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Fifth grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Second grade""
                  },
                  {
                    ""gradeLevelDescriptor"": ""uri://ed-fi.org/GradeLevelDescriptor#Third grade""
                  }
                ],
                ""_etag"": ""5249003312085007491""
              }
            ]";
            
            JsonStore.Add("/staffs", staffs);
			JsonStore.Add("/staffEducationOrganizationAssignmentAssociations", staffsAndOrgs);
			JsonStore.Add("/schools", schools);
        }
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var json = JsonStore.First(k => request.RequestUri.AbsolutePath.Contains(k.Key)).Value;

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = content };

            return Task.FromResult(response);
        }
    }
}
