// using LeadershipProfile.Application.Account.Commands.Login;

// namespace LeadershipProfile.Web.Endpoints;

// public class Account : EndpointGroupBase
// {
//     public override void Map(WebApplication app)
//     {
//         app.MapGroup(this)
//             // .RequireAuthorization()
//             // .MapGet(GetTodoLists)
//             .MapPost("Login", Login);
//             // .MapPut(UpdateTodoList, "{id}")
//             // .MapDelete(DeleteTodoList, "{id}");
//     }

//     // public async Task<TodosVm> GetTodoLists(ISender sender)
//     // {
//     //     return await sender.Send(new GetTodosQuery());
//     // }

//     public async Task<Response> Login(ISender sender, LoginCommand command)
//     {
//         return await sender.Send(command);
//     }

//     // public async Task<IResult> UpdateTodoList(ISender sender, int id, UpdateTodoListCommand command)
//     // {
//     //     if (id != command.Id) return Results.BadRequest();
//     //     await sender.Send(command);
//     //     return Results.NoContent();
//     // }

//     // public async Task<IResult> DeleteTodoList(ISender sender, int id)
//     // {
//     //     await sender.Send(new DeleteTodoListCommand(id));
//     //     return Results.NoContent();
//     // }
// }
