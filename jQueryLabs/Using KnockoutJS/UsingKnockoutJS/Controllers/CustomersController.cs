using UsingKnockoutJS.Models;
using UsingKnockoutJS.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.ModelBinding;

namespace UsingKnockoutJS.Controllers
{
    public class CustomersController : ApiController
    {
        ICustomerRepository _Repository;

        public CustomersController()
        {
            //CustomerRepository could be injected if desired
            _Repository = new CustomerRepository();
        }

        // GET api/customers
        public HttpResponseMessage Get()
        {
            var custs = _Repository.GetCustomers();
            if (custs == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return Request.CreateResponse<IEnumerable<Customer>>(HttpStatusCode.OK, custs);
        }

        // GET api/customers/5
        public HttpResponseMessage Get(int id)
        {
            var cust = _Repository.GetCustomer(id);
            if (cust == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return Request.CreateResponse<Customer>(HttpStatusCode.OK, cust);
        }

        // POST api/customers
        public HttpResponseMessage Post([FromBody]Customer cust)
        {
            var newCust = _Repository.InsertCustomer(cust);
            if (newCust != null)
            {
                var msg = new HttpResponseMessage(HttpStatusCode.Created);
                msg.Headers.Location = new Uri(Request.RequestUri + newCust.ID.ToString());
                return msg;
            }
            throw new HttpResponseException(HttpStatusCode.Conflict);
        }

        // PUT api/customers/5
        public HttpResponseMessage Put(int id, [FromBody]Customer cust)
        {
            var status = _Repository.UpdateCustomer(cust);
            if (status) return new HttpResponseMessage(HttpStatusCode.OK);
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

        // DELETE api/customers/5
        public HttpResponseMessage Delete(int id)
        {
            var status = _Repository.DeleteCustomer(id);
            if (status) return new HttpResponseMessage(HttpStatusCode.OK);
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

        [HttpGet]
        public List<Order> Orders(int custID)
        {
            var orders = _Repository.GetOrders(custID);
            if (orders == null) throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            return orders;
        }
    }
}