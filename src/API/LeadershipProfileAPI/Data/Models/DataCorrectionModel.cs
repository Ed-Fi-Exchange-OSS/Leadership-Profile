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
    public class DataCorrectionModel
    {
        public string StaffUniqueId { get; set; }
        public string UserFullName { get; set; }
        public string StaffEmail { get; set; }
        public string MessageSubject { get; set; }
        public string MessageDescription { get; set; }
        public string Telephone { get; set; }
    }
}
