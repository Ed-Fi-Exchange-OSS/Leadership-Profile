// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities;

public class StaffVacancy
{
    public required string StaffUniqueId { get; set; }
    public required String FullNameAnnon { get; set; }
    public int Age { get; set; }
    public required string SchoolNameAnnon { get; set; }
    public required string SchoolLevel { get; set; }
    public required string Gender { get; set; }
    public required string Race { get; set; }
    public required string VacancyCause { get; set; }
    public Double SchoolYear { get; set; }
    public required string PositionTitle { get; set; }
    public bool RetElig { get; set; }
    public Double OverallScore { get; set; }
}

