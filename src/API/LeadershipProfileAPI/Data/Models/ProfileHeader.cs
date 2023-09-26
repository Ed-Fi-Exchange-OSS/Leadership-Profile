// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileHeader
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastSurname { get; set; }
        public string Location { get; set; }
        public string School { get; set; }
        public decimal? YearsOfService { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string Telephone { get; set; }
    }
}
