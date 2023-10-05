// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffPerformanceMeasure
    {
        public int StaffUsi { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public int Year { get; set; }
        public decimal DistrictMin { get; set; }
        public decimal DistrictMax { get; set; }
        public decimal DistrictAvg { get; set; }
        public decimal Score { get; set; }
        public DateTime MeasureDate { get; set; }
    }
}
