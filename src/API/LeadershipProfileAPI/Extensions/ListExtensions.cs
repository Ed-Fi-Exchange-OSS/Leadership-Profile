using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Extensions
{
    /// <summary>
    /// Extension methods for List
    /// </summary>
    public static class ListExtensions
    {
        /// <summary>
        /// Extension method to add a string to a List of string types if the value is not null nor whitespace
        /// </summary>
        /// <param name="list">The list the value should be added to</param>
        /// <param name="value">The value to add to the list</param>
        public static void AddIfNotNullOrWhiteSpace(this List<string> list, string value)
        {
            if (list != null)
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    list.Add(value);
                }
            }
        }
    }
}
