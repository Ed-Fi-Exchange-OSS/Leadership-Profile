// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.


namespace LeadershipProfile.Domain.Entities;
    public class ProfilePositionHistory
    {
        public int StaffUsi { get; set; }
        public string? StaffUniqueId { get; set; }
        public string? Role { get; set; }
        public string? School { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
