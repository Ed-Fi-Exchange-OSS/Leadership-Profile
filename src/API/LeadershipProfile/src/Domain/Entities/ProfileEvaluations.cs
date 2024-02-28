// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities;

    public class ProfileEvaluationObjective
    {
        public int StaffUsi { get; set; }
        public string? StaffUniqueId { get; set; }
        public int SchoolYear { get; set; }
        public int EvalNumber { get; set; }
        public string? ObjectiveTitle { get; set; }
        public string? EvaluationTitle { get; set; }
        public decimal Rating { get; set; }

    }

    public class ProfileEvaluationElement
    {
        public int StaffUsi { get; set; }
        public string? StaffUniqueId { get; set; }
        public int SchoolYear { get; set; }
        public int EvalNumber { get; set; }
        public string? ElementTitle { get; set; }
        public string? ObjectiveTitle { get; set; }
        public decimal Rating { get; set; }
    }
