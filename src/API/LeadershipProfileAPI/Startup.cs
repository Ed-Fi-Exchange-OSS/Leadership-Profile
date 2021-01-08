using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using IdentityServer4.AccessTokenValidation;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using LeadershipProfileAPI.Infrastructure;
using LeadershipProfileAPI.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

namespace LeadershipProfileAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(); // Make sure you call this previous to AddMvc
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Latest);

            services.AddScoped<AuthenticationDelegatingHandler>();

            var handlerLifeTimeInMinutes = Convert.ToInt32(Configuration["ODS-API-Client-HandlerLifetimeInMin"]);
            services.AddHttpClient(Constants.ODSApiClient,
                    x => { x.BaseAddress = new Uri(Configuration["ODS-API"]); })
                .SetHandlerLifetime(TimeSpan.FromMinutes(handlerLifeTimeInMinutes))
                .AddHttpMessageHandler<AuthenticationDelegatingHandler>();


            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("Bearer", options =>
            {
                options.Authority = "https://localhost:5001";

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false
                };

                //options.RequireHttpsMetadata = false;
            });

            // adds an authorization policy to make sure the token is for scope 'api1'
            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiScope", policy =>
                {
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", IdentityConfig.ApiName);
                });
            });

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "LeadershipProfileAPI", Version = "v1"});
            });

            var connectionString = Configuration.GetConnectionString("EdFi");

            services.AddIdentityServer()
                .AddInMemoryClients(IdentityConfig.Clients)
                .AddInMemoryIdentityResources(IdentityConfig.IdentityResources)
                .AddInMemoryApiScopes(IdentityConfig.ApiScopes)
                .AddTestUsers(IdentityConfig.Users)
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlServer(connectionString);
                })
                .AddDeveloperSigningCredential();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "LeadershipProfileAPI v1"));

                app.UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseIdentityServer();

            app.UseAuthentication();
        
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}