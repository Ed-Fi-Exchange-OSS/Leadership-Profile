// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestBody
    {
        public ProfileSearchYearsOfPriorExperience YearsOfPriorExperienceRanges { get; set; }
        public ProfileSearchRequestRatings[] Ratings { get; set; }
        public ProfileSearchRequestAssignments Assignments { get; set; }
        public ProfileSearchRequestDegrees Degrees { get; set; }
        public ProfileSearchRequestSchoolCategories SchoolCategories { get; set; }
        public ProfileSearchRequestInstitution Institutions { get; set; }

        public string Name { get; set; }
    }
}
