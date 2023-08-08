using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public static class IQueryableFiltersExtensions
{
    public static Dictionary<int, string> rolesDictionary = new Dictionary<int, string>() {
                {1, "Principal"},
                {2, "Assistant Principal"},
                {3, "Teacher"},
                {4, "Teacher Leader"}
            };

    public static Dictionary<int, string> schoolLevelsDictionary = new Dictionary<int, string>() {
                {1, "Elementary School"},
                {2, "Middle School"},
                {3, "High School"}
            };

    public static Dictionary<int, string> degreesDictionary = new Dictionary<int, string>(){
                {1, "Bachelors"},
                {2, "Masters"},
                {3, "Doctorate"}
            };

    public static IQueryable<TEntity> ApplyMappedListFilter<TEntity, TValues>(
        this IQueryable<TEntity> query,
        int[] values,
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

    public static IQueryable<TEntity> ApplyRangeFilter<TEntity, TValues>(
        this IQueryable<TEntity> query,
        TValues[] values,
        Expression<Func<TEntity, double>> field) where TValues : IComparable<TValues>
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
