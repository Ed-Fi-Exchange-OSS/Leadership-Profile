// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
namespace LeadershipProfile.Domain.Entities;

    public class ProfileCertification
    {
        public int StaffUsi { get; set; }
        public string? StaffUniqueId { get; set; }
        public string? Description { get; set; }
        public string? CredentialType { get; set; }
        public DateTime IssuanceDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
