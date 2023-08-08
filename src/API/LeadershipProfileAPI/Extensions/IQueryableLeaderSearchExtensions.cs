using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using LeadershipProfileAPI.Data.Models;

public static class IQueryableLeaderSearchExtensions
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

    public static IQueryable<LeaderSearch> ApplyMappedFilter(
        this IQueryable<LeaderSearch> query,
        int[] values,
        Dictionary<int, string> mapper,
        Expression<Func<LeaderSearch, string>> field)
    {
        if (values == null || !values.Any())
            return query;

        var labels = values.Select(r => mapper.GetValueOrDefault(r, "Map-not-Found")).ToList();

        var parameter = field.Parameters.Single();
        var valueList = Expression.Constant(labels.ToList());
        var containsCall = Expression.Call(
            typeof(Enumerable),
            "Contains",
            new[] { typeof(string) },
            Expression.Constant(labels),
            field.Body);

        var lambda = Expression.Lambda<Func<LeaderSearch, bool>>(containsCall, parameter);
        return query.Where(lambda);       
    }

    public static IQueryable<LeaderSearch> ApplyRangeFilter(
        this IQueryable<LeaderSearch> query,
        int[] values,
        Expression<Func<LeaderSearch, double>> field)
    {
        if (values == null || !values.Any())
            return query;

        var dValues = values.Select(v => Convert.ToDouble(v)).ToList();
        var parameter = field.Parameters.Single();
        var lowerBound = Expression.GreaterThanOrEqual(field.Body, Expression.Constant(dValues[0]));
        var upperBound = Expression.LessThanOrEqual(field.Body, Expression.Constant(dValues.Last()));
        var betweenFilter = Expression.AndAlso(lowerBound, upperBound);
        var lambda = Expression.Lambda<Func<LeaderSearch, bool>>(betweenFilter, parameter);

        return query.Where(lambda);
    }
}
