using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class jQueryAjax_CustomerJson : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "application/json";
        var cust = new Customer
        {
            ID = int.Parse(Request["id"]),
            FirstName = "John",
            LastName = "Doe"
        };
        var ser = new DataContractJsonSerializer(typeof(Customer));
        ser.WriteObject(Response.OutputStream, cust);
    }
}