// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities.ProfileSearchRequest;
    public class LeaderSearchRequestBody
    {
        public int[]? Roles { get; set; }
        public int[]? SchoolLevels { get; set; }
        public int[]? HighestDegrees { get; set; }
        public int[]? HasCertification { get; set; }
        public int[]? YearsOfExperience { get; set; }
        public int[]? OverallScore { get; set; }
        public int[]? DomainOneScore { get; set; }
        public int[]? DomainTwoScore { get; set; }
        public int[]? DomainThreeScore { get; set; }
        public int[]? DomainFourScore { get; set; }
        public int[]? DomainFiveScore { get; set; }
    }
