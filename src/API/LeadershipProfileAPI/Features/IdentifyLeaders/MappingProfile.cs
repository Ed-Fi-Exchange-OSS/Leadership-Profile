// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.IdentifyLeaders
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<StaffSearch, List.SearchResult>()
                .ForMember(d => d.FullName, o => o.MapFrom(x => GetFullName(x.FirstName, null, x.LastSurname)));
        }

        private static string GetFullName(string firstName, string middleName, string lastName)
        {
            return $"{firstName}{(!string.IsNullOrWhiteSpace(middleName) ? $" {middleName} " : " ")}{lastName}";
        }
    }
}
