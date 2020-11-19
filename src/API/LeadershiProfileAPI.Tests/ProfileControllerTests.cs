using System;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Controllers;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Shouldly;
using Xunit;

namespace LeadershiProfileAPI.Tests
{
    public class ProfileControllerTests
    {
        [Fact]
        public async Task ShouldReturnListOfTeacherProfiles()
        {
            var fakeClientFactory = new MockHttpClientFactory();
            var  fakeLogger = new MockLogger();

            var controller = new ProfileController(fakeLogger, fakeClientFactory);

            var result = (await controller.Get()).ToList();

            result.ShouldNotBeNull();

			result.Count().ShouldBeEquivalentTo(2);

			result.Select(x=>x.FirstName).Contains("Barry").ShouldBeTrue();
        }
    }

    public class MockLogger : ILogger<ProfileController>
    {
        public IDisposable BeginScope<TState>(TState state)
        {
            throw new NotImplementedException();
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            throw new NotImplementedException();
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            throw new NotImplementedException();
        }
    }

    public class MockHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name)
        {
            return new HttpClient(new MockHttpHandler())
            {
				BaseAddress = new Uri(@"https://api.ed-fi.org/")
			};
        }
    }

    public class MockHttpHandler : HttpMessageHandler
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
