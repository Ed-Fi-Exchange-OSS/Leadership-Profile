// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
        public static IOrderedQueryable<T>? OrderBy<T>(this IQueryable<T> queryable, List<Expression<Func<T, object>>> orderByExpressions)
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
            // if (orderByExpressions.Count > 0)
            // {
                var orderedQuery = queryable.OrderByDescending(orderByExpressions[0]);

                foreach (var expression in orderByExpressions.Skip(1))
                {
                    orderedQuery = orderedQuery.ThenByDescending(expression);
                }

                return orderedQuery;
            // }

            // return Enumerable.Empty<T>().AsQueryable().OrderBy<>;;
        }

        /// <summary>
        /// Adds an "in" filter to the query. Values are mapped using <paramref  name="mapper"/>.
        /// If <paramref name="values"/> array is null or empty, it does nothing.
        /// </summary>
        /// <param name="query">Query to add the filter to</param>
        /// <param name="values">List of values that will be mapped to the actual values used in the filter</param>
        /// <param name="mapper">Dictionary that maps the id's to the values</param>
        /// <param name="field">Expression that selects the entoty field used to filter</param>
        /// <typeparam name="TEntity">Query's Entity type</typeparam>
        /// <typeparam name="TValues">Comparison field's type</typeparam>
        /// <returns></returns>
        public static IQueryable<TEntity> ApplyMappedListFilter<TEntity, TValues>(
            this IQueryable<TEntity> query,
            int[]? values,
            Dictionary<int, TValues> mapper,
            Expression<Func<TEntity, TValues>> field)
        {
            if (values == null || !values.Any())
                return query;

            var labels = values.Select(r => mapper.GetValueOrDefault<int, TValues>(r)).ToList();

            var parameter = field.Parameters.Single();
            var valueList = Expression.Constant(labels.ToList());
            var containsCall = Expression.Call(
                typeof(Enumerable),
                "Contains",
                new[] { typeof(TValues) },
                Expression.Constant(labels),
                field.Body);

            var lambda = Expression.Lambda<Func<TEntity, bool>>(containsCall, parameter);
            return query.Where(lambda);
        }

        /// <summary>
        /// Adds a filter that checks if the feld is in the range of the firs and last values in <paramref name="values"/>
        /// </summary>
        /// <param name="query">Query to add the filter to</param>
        /// <param name="values">Array with the min and max values</param>
        /// <param name="field">Expression that selects the entoty field used to filter</param>
        /// <typeparam name="TEntity">Query's Entity type</typeparam>
        /// <typeparam name="TValues">Comparison field's type</typeparam>
        /// <returns></returns>
        public static IQueryable<TEntity> ApplyRangeFilter<TEntity, TValues>(
            this IQueryable<TEntity> query,
            TValues[] values,
            Expression<Func<TEntity, TValues>> field) where TValues : IComparable<TValues>
        {
            if (values == null || !values.Any())
                return query;

            var parameter = field.Parameters.Single();
            var lowerBound = Expression.GreaterThanOrEqual(field.Body, Expression.Constant(values[0]));
            var upperBound = Expression.LessThanOrEqual(field.Body, Expression.Constant(values.Last()));
            var betweenFilter = Expression.AndAlso(lowerBound, upperBound);
            var lambda = Expression.Lambda<Func<TEntity, bool>>(betweenFilter, parameter);

            return query.Where(lambda);
        }
    }
}
