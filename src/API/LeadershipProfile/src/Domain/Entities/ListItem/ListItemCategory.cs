// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

namespace LeadershipProfile.Domain.Entities.ListItem;
    public class ListItemCategory
    {
        //Evaluation Objective has a Text-Based Key
        public string? Category { get; set; }
        public int SortOrder { get; set; }
        public string? EvaluationTitle { get; set; }
    }

