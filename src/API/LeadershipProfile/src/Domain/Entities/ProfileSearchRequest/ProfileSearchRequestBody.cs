// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities.ProfileSearchRequest;

    public class ProfileSearchRequestBody
    {
        public required ProfileSearchYearsOfPriorExperience YearsOfPriorExperienceRanges { get; set; }
        public ProfileSearchRequestRatings[]? Ratings { get; set; }
        public required ProfileSearchRequestAssignments Assignments { get; set; }
        public required ProfileSearchRequestDegrees Degrees { get; set; }
        public required ProfileSearchRequestSchoolCategories SchoolCategories { get; set; }
        public required ProfileSearchRequestInstitution Institutions { get; set; }

        public string? Name { get; set; }
    }
