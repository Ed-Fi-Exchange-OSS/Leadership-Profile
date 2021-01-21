using System;
using System.IO;
using System.Net.Http;
using AutoMapper;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Infrastructure.Auth;
using LeadershipProfileAPI.Infrastructure.Email;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
            var connectionString = Configuration.GetConnectionString("EdFi");

            services.AddDbContext<EdFiDbContext>(options => options.UseSqlServer(connectionString));

            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));

            services.AddCors(); // Make sure you call this previous to AddMvc
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

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "LeadershipProfileAPI", Version = "v1"});
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IMapper autoMapper)
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

                autoMapper.ConfigurationProvider.AssertConfigurationIsValid();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}