// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities;
public class LeaderSearch
{
    public string? StaffUniqueId {get; set;}
    // [Key]
    public String? FullName { get; set; }
    public string? NameOfInstitution { get; set; }
    public Double SchoolYear { get; set; }
    public string? SchoolLevel { get; set; }
    public string? Job { get; set; }
    public string? PositionTitle { get; set; }
    public string? EmployeeID { get; set; }
    public DateTime StartDate { get; set; }
    public string? VacancyCause { get; set; }
    public string? TotalYearsOfExperience { get; set; }
    public string? Gender { get; set; }
    public string? Race { get; set; }
    public Double OverallScore { get; set; }
    public Double Domain1 { get; set; }
    public Double Domain2 { get; set; }
    public Double Domain3 { get; set; }
    public Double Domain4 { get; set; }
    public Double Domain5 { get; set; }
}
