﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;

namespace LeadershipProfileAPI.Controllers
{
    public static class Extensions
    {
        public static string GetHeader(this HttpResponseHeaders responseHeaders, string headerName)
        {
            return responseHeaders.FirstOrDefault(a => a.Key == headerName).Value?.FirstOrDefault();
        }

        public static int GetYearsOfService(this IList<Models.StaffOrganization> organizations)
        {
            var org = organizations.FirstOrDefault();
            if (org == null)
                return 0;

            return (DateTime.Today.Year - Convert.ToDateTime(org.beginDate).Year);
        }

        public static string GetLocation(this IList<Models.Address> addresses)
        {   
            var address = addresses.FirstOrDefault();

            if (address == null)
                return "Default Location";
            
            var stateDescriptor = address.stateAbbreviationDescriptor.Split('#');

            var state = "Default State";

            if (stateDescriptor.Length >= 2)
                state = stateDescriptor[1];

            return $"{address.city}, {state}";
        }
    }
}