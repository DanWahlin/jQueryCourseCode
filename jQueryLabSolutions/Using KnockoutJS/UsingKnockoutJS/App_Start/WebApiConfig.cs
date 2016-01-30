﻿using UsingKnockoutJS.Formatters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace UsingKnockoutJS
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            config.Routes.MapHttpRoute(
                name: "CustomerOrdersApiGet",
                routeTemplate: "api/customers/{custID}/orders",
                defaults: new { custID = 0, controller = "Customers", action = "Orders" }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            GlobalConfiguration.Configuration.Formatters.Insert(0, new JsonpFormatter());
        }
    }
}
