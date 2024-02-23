// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace LeadershipProfile.Domain.Entities;
    public class StaffAdmin
    {
        public Guid Id { get; set; }
        public int StaffUsi { get; set; }
        public string? StaffUniqueId { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastSurName { get; set; }
        public string? Location { get; set; }
        public string? TpdmUsername { get; set; }
        public bool IsAdmin { get; set; }
    }
