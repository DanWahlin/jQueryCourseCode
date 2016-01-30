using System;
using System.Collections.Generic;
using System.Web.Http;
using jQueryAjaxLab.Data;

namespace jQueryAjaxLab
{
    public class DataServiceController : ApiController
    {
        [HttpGet]
        public List<Product> Products()
        {
            var p = DAL.GetProducts();
            return p;
        }

        [HttpGet]
        public List<Category> Categories()
        {
            return DAL.GetCategories();
        }

        [HttpPut]
        public OperationStatus Product(Product product)
        {
            return DAL.UpdateProduct(product);
        }
    }
}