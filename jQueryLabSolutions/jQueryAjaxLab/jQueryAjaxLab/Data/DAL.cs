using System;
using System.Collections.Generic;
using System.Linq;

namespace jQueryAjaxLab.Data
{
    public class DAL
    {
        private static GolfClubShackEntities CreateGolfClubShackEntities()
        {
            var context = new GolfClubShackEntities();
            context.Configuration.ProxyCreationEnabled = false;
            return context;
        }

        public static Product GetProduct(int id)
        {
            using (var context = CreateGolfClubShackEntities())
            {
                return context.Products.Where(p => p.ProductID == id).SingleOrDefault();
            }
        }

        public static List<Product> GetProducts()
        {
            using (var context = CreateGolfClubShackEntities())
            {
                return context.Products.ToList();
            }
        }

        public static List<Category> GetCategories()
        {
            using (var context = CreateGolfClubShackEntities())
            {
                return context.Categories.ToList();
            }
        }

        public static OperationStatus UpdateProduct(Product product)
        {
            using (var context = CreateGolfClubShackEntities())
            {
                var prod = context.Products.Where(p => p.ProductID == product.ProductID).SingleOrDefault();
                prod.ModelName = product.ModelName;
                prod.CategoryID = product.CategoryID;
                try
                {
                    context.SaveChanges();
                    return new OperationStatus { Status = true };
                }
                catch (Exception exp)
                {
                    return new OperationStatus { Status = false, Message = exp.Message };
                }
            }
        }
    }

    public class OperationStatus
    {
        public bool Status { get; set; }
        public string Message { get; set; }
    }
}
