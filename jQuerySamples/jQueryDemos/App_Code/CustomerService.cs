using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

[ServiceContract]
[ServiceBehavior(IncludeExceptionDetailInFaults=true)]
public class CustomerService
{
	[OperationContract]
	public List<Customer> GetCustomers()
	{
	    return new List<Customer>{
            new Customer
	        {
                FirstName = "John",
                LastName = "Doe"
	        },
            new Customer
	        {
                FirstName = "Jane",
                LastName = "Doe"
	        }
        };
	}

    [OperationContract]
    [WebGet(RequestFormat = WebMessageFormat.Json)]
    public OperationStatus InsertCustomer(Customer cust)
    {
        //Simulate inserting a customer...assume it works
        return new OperationStatus
        {
            Status = true,
            InsertedID = 453,
            Message="Customer Inserted: " + cust.FirstName + " " + cust.LastName
        };
    }

}
