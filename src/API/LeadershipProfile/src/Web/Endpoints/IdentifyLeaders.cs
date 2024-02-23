using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

namespace LeadershipProfile.Web.Endpoints;

public class IdentifyLeaders : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            // .MapGet(GetTodoItemsWithPagination);
            .MapPost(GetLeadersWithPagination);
            // .MapPut(UpdateTodoItem, "{id}")
            // .MapPut(UpdateTodoItemDetail, "UpdateDetail/{id}")
            // .MapDelete(DeleteTodoItem, "{id}");
    }

    public async Task<List<LeaderBriefDto>> GetLeadersWithPagination(ISender sender, GetLeadersWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    // public async Task<int> CreateTodoItem(ISender sender, CreateTodoItemCommand command)
    // {
    //     return await sender.Send(command);
    // }

    // public async Task<IResult> UpdateTodoItem(ISender sender, int id, UpdateTodoItemCommand command)
    // {
    //     if (id != command.Id) return Results.BadRequest();
    //     await sender.Send(command);
    //     return Results.NoContent();
    // }

    // public async Task<IResult> UpdateTodoItemDetail(ISender sender, int id, UpdateTodoItemDetailCommand command)
    // {
    //     if (id != command.Id) return Results.BadRequest();
    //     await sender.Send(command);
    //     return Results.NoContent();
    // }

    // public async Task<IResult> DeleteTodoItem(ISender sender, int id)
    // {
    //     await sender.Send(new DeleteTodoItemCommand(id));
    //     return Results.NoContent();
    // }
}
