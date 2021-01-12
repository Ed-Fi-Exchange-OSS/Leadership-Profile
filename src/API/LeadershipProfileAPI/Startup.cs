using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.AccessTokenValidation;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure;
using LeadershipProfileAPI.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
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


            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "LeadershipProfileAPI", Version = "v1"});
            });

            var connectionString = Configuration.GetConnectionString("EdFi");

            services.AddDbContext<TpdmDBContext>(options => options.UseSqlServer(connectionString));


            AddAuth(connectionString, services);

            //using (var scope = services.BuildServiceProvider().GetRequiredService<IServiceScopeFactory>().CreateScope())
            //{

            //    EnsureUsers(scope);
            //}
        }

        private static void AddAuth(string connectionString, IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                
            }).AddOpenIdConnect("oidc", "Demo IdentityServer", options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.SignOutScheme = IdentityServerConstants.SignoutScheme;
                options.SaveTokens = true; // idserver

                options.Authority = "https://localhost:5001";
                options.ClientId = "interactive";
                options.ClientSecret = "secret";
                options.ResponseType = "code";
                options.Scope.Add(IdentityConfig.ApiName);
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                    RoleClaimType = "role"
                };
            }).AddJwtBearer("Bearer", options =>
            {
                options.Authority = "https://localhost:5001"; //value from environment variable // API

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false
                };

                options.RequireHttpsMetadata = false;
            });

            
            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiScope", policy =>
                {
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", IdentityConfig.ApiName);
                });
            });

            services.AddCors(options =>
            {
                // this defines a CORS policy called "default"
                options.AddPolicy("default", policy =>
                {
                    policy.WithOrigins("https://localhost:5003")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<TpdmDBContext>();

            services.AddIdentityServer(options =>
            {
                options.UserInteraction.LoginUrl = "/login";
                options.UserInteraction.ErrorUrl = "/error";
            })
            .AddInMemoryClients(IdentityConfig.Clients)
            .AddInMemoryIdentityResources(IdentityConfig.IdentityResources)
            .AddInMemoryApiScopes(IdentityConfig.ApiScopes)
            .AddAspNetIdentity<IdentityUser>()
            //.AddOperationalStore(options => { options.ConfigureDbContext = b => b.UseSqlServer(connectionString); })
            .AddDeveloperSigningCredential();
        }

        //private static void EnsureUsers(IServiceScope scope)
        //{
        //    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        //    var alice = userMgr.FindByNameAsync("alice").GetAwaiter().GetResult();
        //    if (alice == null)
        //    {
        //        alice = new IdentityUser
        //        {
        //            UserName = "alice",
        //            Email = "AliceSmith@email.com",
        //            EmailConfirmed = true,
        //        };
        //        var result = userMgr.CreateAsync(alice, "Pass123$").GetAwaiter().GetResult();
        //        if (!result.Succeeded)
        //        {
        //            throw new Exception(result.Errors.First().Description);
        //        }

        //        result = userMgr.AddClaimsAsync(alice, new Claim[]
        //        {
        //              new (JwtClaimTypes.Name, "Alice Smith"),
        //              new Claim(JwtClaimTypes.GivenName, "Alice"),
        //              new Claim(JwtClaimTypes.FamilyName, "Smith"),
        //              new Claim(JwtClaimTypes.WebSite, "http://alice.com"),
        //        }).GetAwaiter().GetResult();
        //        if (!result.Succeeded)
        //        {
        //            throw new Exception(result.Errors.First().Description);
        //        }

        //        Log.Debug("alice created");
        //    }
        //    else
        //    {
        //        Log.Debug("alice already exists");
        //    }

        //    var bob = userMgr.FindByNameAsync("bob").GetAwaiter().GetResult();
        //    if (bob == null)
        //    {
        //        bob = new IdentityUser
        //        {
        //            UserName = "bob",
        //            Email = "BobSmith@email.com",
        //            EmailConfirmed = true
        //        };
        //        var result = userMgr.CreateAsync(bob, "Pass123$").GetAwaiter().GetResult();
        //        if (!result.Succeeded)
        //        {
        //            throw new Exception(result.Errors.First().Description);
        //        }

        //        result = userMgr.AddClaimsAsync(bob, new Claim[]
        //        {
        //          new Claim(JwtClaimTypes.Name, "Bob Smith"),
        //          new Claim(JwtClaimTypes.GivenName, "Bob"),
        //          new Claim(JwtClaimTypes.FamilyName, "Smith"),
        //          new Claim(JwtClaimTypes.WebSite, "http://bob.com"),
        //          new Claim("location", "somewhere")
        //                }).GetAwaiter().GetResult();
        //        if (!result.Succeeded)
        //        {
        //            throw new Exception(result.Errors.First().Description);
        //        }

        //        Log.Debug("bob created");
        //    }
        //    else
        //    {
        //        Log.Debug("bob already exists");
        //    }
        //}

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