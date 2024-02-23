using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.WebControls.Queries.GetAssignments;
using LeadershipProfile.Application.WebControls.Queries.GetCategories;
using LeadershipProfile.Application.WebControls.Queries.GetDegrees;
using LeadershipProfile.Application.WebControls.Queries.GetInstitutions;
using LeadershipProfile.Application.WebControls.Queries.GetMeasurementCategories;
using LeadershipProfile.Application.WebControls.Queries.GetSchoolCategories;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Web.Endpoints;

public class WebControls : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup(this).RequireAuthorization();
        group.MapGet("Assignments", GetAssignments);
        group.MapGet("Categories", GetCategories);
        group.MapGet("Degrees", GetDegrees);
        group.MapGet("SchoolCategories", GetSchoolCategories);
        group.MapGet("Institutions", GetInstitutions);
        group.MapGet("MeasurementCategories", GetMeasurementCategories);
            // .MapPost(CreateTodoItem)
            // .MapPut(UpdateTodoItem, "{id}")
            // .MapPut(UpdateTodoItemDetail, "UpdateDetail/{id}")
            // .MapDelete(DeleteTodoItem, "{id}");
    }

    public async Task<IEnumerable<ListItemAssignment>> GetAssignments(ISender sender, [AsParameters] GetAssignmentsQuery query)
    {
        return await sender.Send(query);
    }
    public async Task<IEnumerable<ListItemCategory>> GetCategories(ISender sender, [AsParameters] GetCategoriesQuery query)
    {
        return await sender.Send(query);
    }
    public async Task<IEnumerable<ListItemDegree>> GetDegrees(ISender sender, [AsParameters] GetDegreesQuery query)
    {
        return await sender.Send(query);
    }
    public async Task<IEnumerable<ListItemSchoolCategory>> GetSchoolCategories(ISender sender, [AsParameters] GetSchoolCategoriesQuery query)
    {
        return await sender.Send(query);
    }
    public async Task<IEnumerable<ListItemInstitution>> GetInstitutions(ISender sender, [AsParameters] GetInstitutionsQuery query)
    {
        return await sender.Send(query);
    }
    public async Task<IEnumerable<ListItemCategory>> GetMeasurementCategories(ISender sender, [AsParameters] GetMeasurementCategoriesQuery query)
    {
        return await sender.Send(query);
    }

}
