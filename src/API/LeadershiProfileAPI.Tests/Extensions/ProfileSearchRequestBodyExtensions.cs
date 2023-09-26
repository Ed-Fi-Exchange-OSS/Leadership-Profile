// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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

        public static ProfileSearchRequestBody AddRatings(this ProfileSearchRequestBody body, string category = null, float score = 0)
        {
            body.Ratings = category != null
                ? new ProfileSearchRequestRatings { Category = category, Score = score, }
                : new ProfileSearchRequestRatings { Category = "Lorem Ipsum", Score = 3,};

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
