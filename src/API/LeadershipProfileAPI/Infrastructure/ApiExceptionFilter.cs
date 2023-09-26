// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LeadershipProfileAPI.Infrastructure
{
    public class ApiExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<ApiExceptionFilter> _logger;
        private readonly IWebHostEnvironment _environment;

        public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
        }

        public void OnException(ExceptionContext context)
        {
            ApiError apiError = null;
            if (context.Exception is ApiException ex)
            {
                _logger.LogError(new EventId(0), context.Exception, ex.Message);

                context.Exception = null!;

                apiError = new ApiError(ex.Message) { errors = ex.Errors };

                context.HttpContext.Response.StatusCode = ex.StatusCode;
            }
            else if (context.Exception is UnauthorizedAccessException)
            {
                apiError = new ApiError("Unauthorized Access");
                context.HttpContext.Response.StatusCode = 401;

                _logger.LogError(new EventId(0), context.Exception, apiError.message);
            }
            else
            {
                var msg = "An unhandled error occurred.";
                var stack = string.Empty;

                if (_environment.IsDevelopment())
                {
                    msg = context.Exception.GetBaseException()?.Message;
                    stack = context.Exception.StackTrace;
                }

                apiError = new ApiError(msg) { detail = stack };

                context.HttpContext.Response.StatusCode = 500;


                _logger.LogError(new EventId(0), context.Exception, msg);
            }

            context.Result = new JsonResult(apiError);
        }

        public class ApiException : Exception
        {
            public int StatusCode { get; set; }

            public ValidationErrorCollection Errors { get; set; }

            public ApiException(string message,
                int statusCode = 500,
                ValidationErrorCollection errors = null) :
                base(message)
            {
                StatusCode = statusCode;
                Errors = errors;
            }

            public ApiException(Exception ex, int statusCode = 500) : base(ex.Message)
            {
                StatusCode = statusCode;
            }
        }

        public class ApiError
        {
            public string message { get; set; }
            public bool isError { get; set; }
            public string detail { get; set; }
            public ValidationErrorCollection errors { get; set; }

            public ApiError(string message)
            {
                this.message = message;
                isError = true;
            }

            public ApiError(ModelStateDictionary modelState)
            {
                isError = true;
                if (modelState != null && modelState.Any(m => m.Value.Errors.Count > 0))
                    message = "Please correct the specified errors and try again.";
            }
        }
    }

    public class ValidationErrorCollection
    {
        public string Key { get; set; }
        public string Message { get; set; }
    }
}
