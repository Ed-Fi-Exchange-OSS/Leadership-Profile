// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;


namespace LeadershipProfile.Domain.Entities;
    public class StaffProfessionalDevelopment
    {
        /// <summary>PK</summary>
        public int StaffUsi { get; set; }

        /// <summary>PK</summary>
        public string? ProfessionalDevelopmentTitle { get; set; }

        public string? StaffUniqueId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public string? Location { get; set; }
        public string? AlignmentToLeadership { get; set; }
    }
