using UsingKnockoutJS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UsingKnockoutJS.Repository
{
    public interface ICustomerRepository
    {
        List<Customer> GetCustomers();
        Customer GetCustomer(int id);
        bool UpdateCustomer(Customer cust);
        Customer InsertCustomer(Customer cust);
        bool DeleteCustomer(int id);
        List<Order> GetOrders(int id);
    }

    public class CustomerRepository : ICustomerRepository
    {
        static List<Customer> _Customers = new List<Customer>
            {
                new Customer { ID = 1, FirstName = "John", LastName = "Doe", Orders = new List<Order> {
                    new Order { ID = 400, Total = 45.05M, ProductTitle = "TV Adapter"},
                    new Order { ID = 401, Total = 1499.00M, ProductTitle = "LCD TV"}
                }},
                new Customer { ID = 2, FirstName = "Jane", LastName = "Smith", Orders = new List<Order> {
                    new Order { ID = 500, Total = 99.99M, ProductTitle = "Security Camera"},
                    new Order { ID = 501, Total = 49.00M, ProductTitle = "Wireless Camera Antenna"}
                } },
            };

        public List<Customer> GetCustomers()
        {
            return _Customers;
        }

        public Customer GetCustomer(int id)
        {
            return _Customers.Where(c => c.ID == id).SingleOrDefault();
        }

        public Customer InsertCustomer(Customer cust)
        {
            if (!_Customers.Any(c => c.ID == cust.ID))
            {
                _Customers.Add(cust);
                return cust;
            }
            return null;
        }

        public bool UpdateCustomer(Customer cust)
        {
            var targetCust = _Customers.Where(c => c.ID == cust.ID).SingleOrDefault();
            if (targetCust != null)
            {
                _Customers.Remove(targetCust);
                _Customers.Add(cust);
                return true;
            }
            return false;
        }

        public bool DeleteCustomer(int id)
        {
            var cust = _Customers.Where(c => c.ID == id).SingleOrDefault();
            if (cust != null)
            {
                _Customers.Remove(cust);
                return true;
            }
            return false;
        }

        public List<Order> GetOrders(int id)
        {
            var cust = _Customers.Where(c => c.ID == id).SingleOrDefault();
            if (cust != null)
            {
                return cust.Orders;
            }
            return null;
        }
    }
}