using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace LeadershipProfileAPI.Extensions
{
    /// <summary>
    /// Extension methods for IQueryable<T>
    /// </summary>
    public static class IQueryableExtensions
    {
        /// <summary>
        /// Sorts the elements of the sequence in ascending order according to a collection of keys
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queryable">The element in question</param>
        /// <param name="orderByExpressions">Collection of expressions to be applied to the IQueryable</param>
        /// <returns></returns>
        public static IOrderedQueryable<T> OrderBy<T>(this IQueryable<T> queryable, List<Expression<Func<T, object>>> orderByExpressions)
        {
            if (orderByExpressions.Count > 0)
            {
                var orderedQuery = queryable.OrderBy(orderByExpressions[0]);

                foreach (var expression in orderByExpressions.Skip(1))
                {
                    orderedQuery = orderedQuery.ThenBy(expression);
                }

                return orderedQuery;
            }

            return null;
        }

        /// <summary>
        /// Sorts the elements of the sequence in descending order according to a collection of keys
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queryable">The element in question</param>
        /// <param name="orderByExpressions">Collection of expressions to be applied to the IQueryable</param>
        /// <returns></returns>
        public static IOrderedQueryable<T> OrderByDescending<T>(this IQueryable<T> queryable, List<Expression<Func<T, object>>> orderByExpressions)
        {
            if (orderByExpressions.Count > 0)
            {
                var orderedQuery = queryable.OrderByDescending(orderByExpressions[0]);

                foreach (var expression in orderByExpressions.Skip(1))
                {
                    orderedQuery = orderedQuery.ThenByDescending(expression);
                }

                return orderedQuery;
            }

            return null;
        }
    }

}
