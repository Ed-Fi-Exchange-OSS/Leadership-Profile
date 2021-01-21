using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Tests
{
    public static class Testing
    {
        public static readonly IServiceScopeFactory ScopeFactory;

        public static IConfigurationRoot Configuration { get; }


        static Testing()
        {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            var startup = new Startup(Configuration);
            var services = new ServiceCollection();

            startup.ConfigureServices(services);

            var rootContainer = services.BuildServiceProvider();
            ScopeFactory = rootContainer.GetService<IServiceScopeFactory>();
        }

        public static async Task ScopeExec(Func<IServiceProvider, Task> action)
        {
            using var scope = ScopeFactory.CreateScope();
            await action(scope.ServiceProvider).ConfigureAwait(false);
        }

        public static async Task<T> ScopeExec<T>(Func<IServiceProvider, Task<T>> action)
        {
            using var scope = ScopeFactory.CreateScope();
            return await ScopeExec(scope, action);
        }

        private static async Task<T> ScopeExec<T>(IServiceScope scope, Func<IServiceProvider, Task<T>> action)
        {
            var result = await action(scope.ServiceProvider).ConfigureAwait(false);
            return result;
        }

        public static Task DbContextScopeExec(Func<EdFiDbContext, Task> action)
            => ScopeExec(sp => action(sp.GetService<EdFiDbContext>()));

        public static Task<T> DbContextScopeExec<T>(Func<EdFiDbContext, Task<T>> action)
            => ScopeExec(sp => action(sp.GetService<EdFiDbContext>()));

        public static Task InsertAsync<T>(params T[] entities) where T : class
        {
            return DbContextScopeExec(db =>
            {
                foreach (var entity in entities)
                {
                    db.Set<T>().Add(entity);
                }

                return db.SaveChangesAsync();
            });
        }

        public static Task UpdateAsync<TEntity>(TEntity entity) where TEntity : class
        {
            return DbContextScopeExec(db =>
            {
                db.Set<TEntity>().Update(entity);

                return db.SaveChangesAsync();
            });
        }

        public static Task<TResult> Query<TResult>(Func<EdFiDbContext, TResult> query)
        {
            var result = default(TResult);

            DbContextScopeExec(db =>
            {
                result = query(db);
                return Task.CompletedTask;
            });

            return Task.FromResult(result);
        }

        public static Task Send(IRequest request)
        {
            return ScopeExec(sp =>
            {
                var mediator = sp.GetService<IMediator>();

                return mediator.Send(request);
            });
        }

        public static Task Send(IRequest request, Action<IServiceProvider> configure)
        {
            return ScopeExec(sp =>
            {
                configure(sp);
                var mediator = sp.GetService<IMediator>();

                return mediator.Send(request);
            });
        }

        public static Task<TResponse> Send<TResponse>(IRequest<TResponse> request)
        {
            return ScopeExec(sp =>
            {
                var mediator = sp.GetService<IMediator>();

                return mediator.Send(request);
            });
        }

        public static Task<TResponse> Send<TResponse>(IRequest<TResponse> request, Action<IServiceProvider> configure)
        {
            return ScopeExec(sp =>
            {
                configure(sp);
                var mediator = sp.GetService<IMediator>();

                return mediator.Send(request);
            });
        }
    }
}
