// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities;
public class LeaderSearch
{
    public string? StaffUniqueId {get; set;}
    // [Key]
    // [Column("Full Name Annon")]
    public String? FullNameAnnon { get; set; }
    // [Column("School Name Annon")]
    public string? SchoolNameAnnon { get; set; }
    public Double SchoolYear { get; set; }
    public string? SchoolLevel { get; set; }
    // public string LastSurname { get; set; }
    // public string SchoolNumberAnnon { get; set; }
    public string? Job { get; set; }
    public string? PositionTitle { get; set; }
    public string? EmployeeIDAnnon { get; set; }
    public DateTime StartDate { get; set; }
    // public string EndDate { get; set; }
    public string? VacancyCause { get; set; }
    // public Double Age { get; set; }
    public string? TotYrsExp { get; set; }
    public string? Gender { get; set; }
    public string? Race { get; set; }
    public string? TRSYrs { get; set; }
    public string? RetElig { get; set; }
    public Double OverallScore { get; set; }
    public Double Domain1 { get; set; }
    public Double Domain2 { get; set; }
    public Double Domain3 { get; set; }
    public Double Domain4 { get; set; }
    public Double Domain5 { get; set; }
}
