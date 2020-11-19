using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MockHttpHandlerForProfiles : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var json = @"[{
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

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = content };

            return Task.FromResult(response);
        }
    }
}