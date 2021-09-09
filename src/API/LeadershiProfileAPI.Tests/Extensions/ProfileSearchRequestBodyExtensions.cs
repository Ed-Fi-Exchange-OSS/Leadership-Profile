using System.Linq;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;

namespace LeadershipProfileAPI.Tests.Extensions
{
    public static class ProfileSearchRequestBodyExtensions
    {
        public static ProfileSearchRequestBody AddYearsOfPriorExperience(this ProfileSearchRequestBody body, params ProfileSearchYearsOfPriorExperience.Range[] ranges)
        {
            body.YearsOfPriorExperienceRanges = ranges.Any()
                ? new ProfileSearchYearsOfPriorExperience {Values = ranges}
                : new ProfileSearchYearsOfPriorExperience
                {
                    Values = Enumerable.Range(0, 10)
                        .Select(r => new ProfileSearchYearsOfPriorExperience.Range(r, r+1))
                        .ToList()
                };

            return body;
        }

        public static ProfileSearchRequestBody AddRatings(this ProfileSearchRequestBody body, ProfileSearchRequestRatings degrees = null)
        {
            if (degrees != null)
            {
                body.Ratings = degrees;
            }
            else
            {
                body.Ratings = new ProfileSearchRequestRatings
                {
                    CategoryId = 1,
                    SubCategory = "Lorem Ipsum"
                };
            }

            return body;
        }

        public static ProfileSearchRequestBody AddAssignments(this ProfileSearchRequestBody body, params int[] assignments)
        {
            body.Assignments = assignments.Any()
                ? new ProfileSearchRequestAssignments { Values = assignments }
                : new ProfileSearchRequestAssignments { Values = Enumerable.Range(0, 10).ToList() };

            return body;
        }

        public static ProfileSearchRequestBody AddDegrees(this ProfileSearchRequestBody body, params int[] degrees)
        {
            body.Degrees = degrees.Any()
                ? new ProfileSearchRequestDegrees{ Values = degrees }
                : new ProfileSearchRequestDegrees { Values = Enumerable.Range(0, 10).ToList() };

            return body;
        }

        public static ProfileSearchRequestBody AddInstitutions(this ProfileSearchRequestBody body, params int[] institutions)
        {
            body.Institutions = institutions.Any()
                ? new ProfileSearchRequestInstitution { Values = institutions }
                : new ProfileSearchRequestInstitution { Values = Enumerable.Range(0, 10).ToList() };

            return body;
        }
    }
}