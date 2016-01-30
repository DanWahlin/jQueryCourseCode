using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class jQueryAjax_GetCustomers : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var pageSize = (Request["PageSize"]==null)?50:Int32.Parse(Request["PageSize"]);
        var custs = new List<Customer>();
        for (int i = 1; i < pageSize; i++)
        {
            var cust = new Customer
                           {
                               FirstName = "John" + i.ToString(),
                               LastName = "Doe" + i.ToString()
                           };
            custs.Add(cust);
        }
        dlCustomers.DataSource = custs;
        dlCustomers.DataBind();
    }
}