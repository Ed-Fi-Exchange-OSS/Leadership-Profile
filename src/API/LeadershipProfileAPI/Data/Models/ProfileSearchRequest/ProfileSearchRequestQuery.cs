// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestQuery
    {
        public int? Page { get; set; }
        public string SortField { get; set; }
        public string SortBy { get; set; }
        public bool OnlyActive { get; set; } = true;
    }
}
