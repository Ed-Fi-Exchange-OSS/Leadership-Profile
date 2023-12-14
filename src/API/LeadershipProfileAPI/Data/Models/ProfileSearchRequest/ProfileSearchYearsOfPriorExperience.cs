// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System.Collections.Generic;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchYearsOfPriorExperience
    {
        public ICollection<Range> Values { get; set; }

        public class Range
        {
            public Range() { }

            public Range(int min, int max)
            {
                Min = min;
                Max = max;
            }

            public int Min { get; set; }
            public int Max { get; set; }
        }
    }
}
