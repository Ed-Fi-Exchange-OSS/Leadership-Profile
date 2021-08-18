using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using IdentityServer4;
using IdentityServer4.AccessTokenValidation;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure;
using LeadershipProfileAPI.Infrastructure.Auth;
using LeadershipProfileAPI.Infrastructure.Email;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

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
            var connectionString = Configuration.GetConnectionString("EdFi");

            services.AddDbContext<EdFiDbContext>(options => options.UseSqlServer(connectionString));

            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.Configure<DataCorrectionSettings>(Configuration.GetSection("DataCorrection"));
            services.Configure<ApplicationConfiguration>(Configuration.GetSection("ApplicationConfiguration"));

            services.AddDbContext<EdFiIdentityDbContext>(options => options.UseSqlServer(connectionString));
            services.AddDbContext<EdFiDbContext>(options => options.UseSqlServer(connectionString));

            AddAuth(services, Configuration);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Latest);

            services.AddScoped<AuthenticationDelegatingHandler>();

            var handlerLifeTimeInMinutes = Convert.ToInt32(Configuration["ODS-API-Client-HandlerLifetimeInMin"]);
            services.AddHttpClient(Constants.ODSApiClient,
                    x => { x.BaseAddress = new Uri(Configuration["ODS-API"]); })
                .SetHandlerLifetime(TimeSpan.FromMinutes(handlerLifeTimeInMinutes))
                .AddHttpMessageHandler<AuthenticationDelegatingHandler>();

            services.AddMediatR(typeof(Startup).Assembly);
            services.AddAutoMapper(typeof(Startup).Assembly);

            services.AddTransient<IEmailSender, SmtpSender>();
            services.AddScoped<EdFiDbQueryData>();

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LeadershipProfileAPI", Version = "v1" });
                c.CustomSchemaIds(type => type.ToString());
            });
        }

        private static void AddAuth(IServiceCollection services, IConfiguration configuration)
        {
            var authorityServer = configuration.GetValue<string>("AuthorityServer");
            var webClient = configuration.GetValue<string>("WebClient");
            var redirectPath = configuration.GetValue<string>("WebClientRedirectUri");
            var redirectUri = $"{webClient}{redirectPath}";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddOpenIdConnect("oidc", "TPDM IdentityServer", options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.SignOutScheme = IdentityServerConstants.SignoutScheme;
                options.SaveTokens = true; // idserver

                options.Authority = authorityServer;
                options.ClientId = "interactive";
                options.ClientSecret = "secret";
                options.ResponseType = "code id_token token";
                options.Scope.Add(IdentityConfig.ApiName);
                options.Scope.Add("roles");
                options.ClaimActions.MapUniqueJsonKey("role", "role");
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "name",
                    RoleClaimType = "role"
                };
            }).AddJwtBearer("Bearer", options =>
            {
                options.Authority = authorityServer; //value from environment variable // API

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                    RoleClaimType = "role"
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
                    policy.WithOrigins(new string[] { authorityServer, webClient, "http://localhost", "https://localhost" })
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });

            });

            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<EdFiIdentityDbContext>().AddDefaultTokenProviders(); ;

            services.AddIdentityServer()
                .AddInMemoryClients(IdentityConfig.GetClient(redirectUri, new List<string> { authorityServer, webClient }))
                .AddInMemoryIdentityResources(IdentityConfig.IdentityResources)
                .AddInMemoryApiScopes(IdentityConfig.ApiScopes)
                .AddAspNetIdentity<IdentityUser>()
                .AddDeveloperSigningCredential();

            services.Configure<DataProtectionTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromHours(Convert.ToDouble(Environment.GetEnvironmentVariable("ForgotPasswordTokenLifeSpanHours")))
            );

            services.Configure<SecurityStampValidatorOptions>(opt =>
                opt.ValidationInterval = TimeSpan.FromHours(Convert.ToDouble(Environment.GetEnvironmentVariable("ValidTokenLifeSpanHours")))
            );

            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToAccessDenied =
                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.FromResult<object>(null);
                    };
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 0;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IMapper autoMapper)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("../swagger/v1/swagger.json", "LeadershipProfileAPI v1"));

                autoMapper.ConfigurationProvider.AssertConfigurationIsValid();
            }
            app.UseCors("default");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseIdentityServer();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}