// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffSearch
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastSurname { get; set; }
        public string FullName { get; set; }
        public decimal? YearsOfService { get; set; }
        public string Assignment { get; set; }
        public string Degree { get; set; }
        public string Institution { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
    }
}
