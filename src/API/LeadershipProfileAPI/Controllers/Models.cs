using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Controllers
{
    public class Models
    {

        public class TeacherProfile
        {
            [JsonPropertyName("id")] public string Id { get; set; }
            [JsonPropertyName("firstName")] public string FirstName { get; set; }
            [JsonPropertyName("middleName")] public string MiddleName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastName { get; set; }
            [JsonPropertyName("addresses")] public Address[] Addresses { get; set; }
            public string Location { get; set; } = "Default Location";
            public int YearsOfService { get; set; }
            public string Institution { get; set; } = "Default Institution";
            public string HighestDegree { get; set; } = "Default Degree";
            public string Major { get; set; } = "Default Major";
        }

        public class TeacherProfileRaw
        {
            public string id { get; set; }
            public string staffUniqueId { get; set; }
            public string firstName { get; set; }
            public bool hispanicLatinoEthnicity { get; set; }
            public string lastSurname { get; set; }
            public string loginId { get; set; }
            public string sexDescriptor { get; set; }
            public Address[] addresses { get; set; }
            public object[] credentials { get; set; }
            public Electronicmail[] electronicMails { get; set; }
            public object[] identificationCodes { get; set; }
            public object[] identificationDocuments { get; set; }
            public object[] internationalAddresses { get; set; }
            public object[] languages { get; set; }
            public object[] otherNames { get; set; }
            public object[] personalIdentificationDocuments { get; set; }
            public Race[] races { get; set; }
            public object[] recognitions { get; set; }
            public Telephone[] telephones { get; set; }
            public object[] tribalAffiliations { get; set; }
            public object[] visas { get; set; }
            public string _etag { get; set; }
            public string middleName { get; set; }
        }

        public class Electronicmail
        {
            public string electronicMailAddress { get; set; }
            public string electronicMailTypeDescriptor { get; set; }
        }

        public class Race
        {
            public string raceDescriptor { get; set; }
        }

        public class Telephone
        {
            public string telephoneNumber { get; set; }
            public string telephoneNumberTypeDescriptor { get; set; }
        }

        public class StaffOrganization
        {
            public string id { get; set; }
            public Educationorganizationreference educationOrganizationReference { get; set; }
            public Staffreference staffReference { get; set; }
            public string beginDate { get; set; }
            public string staffClassificationDescriptor { get; set; }
            public string positionTitle { get; set; }
            public string _etag { get; set; }
        }

        public class Educationorganizationreference
        {
            public int educationOrganizationId { get; set; }
            public Link link { get; set; }
        }

        public class Link
        {
            public string rel { get; set; }
            public string href { get; set; }
        }

        public class Staffreference
        {
            public string staffUniqueId { get; set; }
            public Link1 link { get; set; }
        }

        public class Link1
        {
            public string rel { get; set; }
            public string href { get; set; }
        }


        public class School
        {
            public string id { get; set; }
            public Localeducationagencyreference localEducationAgencyReference { get; set; }
            public int schoolId { get; set; }
            public string nameOfInstitution { get; set; }
            public string operationalStatusDescriptor { get; set; }
            public string shortNameOfInstitution { get; set; }
            public string webSite { get; set; }
            public string administrativeFundingControlDescriptor { get; set; }
            public string charterStatusDescriptor { get; set; }
            public string schoolTypeDescriptor { get; set; }
            public string titleIPartASchoolDesignationDescriptor { get; set; }
            public Address[] addresses { get; set; }
            public Educationorganizationcategory[] educationOrganizationCategories { get; set; }
            public Identificationcode[] identificationCodes { get; set; }
            public Indicator[] indicators { get; set; }
            public Institutiontelephone[] institutionTelephones { get; set; }
            public object[] internationalAddresses { get; set; }
            public Schoolcategory[] schoolCategories { get; set; }
            public Gradelevel[] gradeLevels { get; set; }
            public string _etag { get; set; }
        }

        public class Localeducationagencyreference
        {
            public int localEducationAgencyId { get; set; }
            public Link link { get; set; }
        }


        public class Address
        {
            public string addressTypeDescriptor { get; set; }
            public string city { get; set; }
            public string postalCode { get; set; }
            public string stateAbbreviationDescriptor { get; set; }
            public string streetNumberName { get; set; }
            public string nameOfCounty { get; set; }
            public object[] periods { get; set; }
        }

        public class Educationorganizationcategory
        {
            public string educationOrganizationCategoryDescriptor { get; set; }
        }

        public class Identificationcode
        {
            public string educationOrganizationIdentificationSystemDescriptor { get; set; }
            public string identificationCode { get; set; }
        }

        public class Indicator
        {
            public string indicatorDescriptor { get; set; }
            public string indicatorGroupDescriptor { get; set; }
            public string indicatorLevelDescriptor { get; set; }
            public string indicatorValue { get; set; }
            public Period[] periods { get; set; }
        }

        public class Period
        {
            public string beginDate { get; set; }
            public string endDate { get; set; }
        }

        public class Institutiontelephone
        {
            public string institutionTelephoneNumberTypeDescriptor { get; set; }
            public string telephoneNumber { get; set; }
        }

        public class Schoolcategory
        {
            public string schoolCategoryDescriptor { get; set; }
        }

        public class Gradelevel
        {
            public string gradeLevelDescriptor { get; set; }
        }

    }
}
