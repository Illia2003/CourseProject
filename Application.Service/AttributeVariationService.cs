using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Service.Properties;
using System;
using Application.Data.Models;
using Application.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Service
{

    public interface IAttributeVariationService
    {
        void CreateAttributeVariation(AttributeVariation attributeVariation);
        void UpdateAttributeVariation(AttributeVariation attributeVariation);
        void UpdatePriceQuantity(string attributeVariationId, decimal price, int quantity);
        void MinusStockQty(string attributeVariationId, int soldQuantity);
        IEnumerable<AttributeVariation> GetAttributeVariations(string productId);                
        void Commit();
    }

    public class AttributeVariationService : IAttributeVariationService
    {
        private readonly IAttributeVariationRepository attributeVariationRepository;
        private readonly IUnitOfWork unitOfWork;

        public AttributeVariationService(IAttributeVariationRepository attributeVariationRepository, IUnitOfWork unitOfWork)
        {
            this.attributeVariationRepository = attributeVariationRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IAttributeVariationService Members

        public void CreateAttributeVariation(AttributeVariation attributeVariation)
        {
            attributeVariationRepository.Add(attributeVariation);
            Commit();
        }

        public void UpdateAttributeVariation(AttributeVariation attributeVariation)
        {
            attributeVariationRepository.Update(attributeVariation);
            Commit();
        }

        public IEnumerable<AttributeVariation> GetAttributeVariations(string productId)
        {
            var attributeVariations = attributeVariationRepository.GetMany(r=> r.ProductId == productId).OrderBy(r => r.Title).ToList();
            return attributeVariations;
        }

        public void MinusStockQty(string attributeVariationId, int soldQuantity)
        {
            string sql = String.Format("Update AttributeVariations Set Quantity = ISNULL(Quantity, 0 ) - {1} where Id = '{0}'", attributeVariationId, soldQuantity);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public void UpdatePriceQuantity(string attributeVariationId, decimal price, int quantity)
        {
            string sql = String.Format("Update AttributeVariations Set Quantity = {0}, Price = {1} where Id = '{2}'", quantity, price, attributeVariationId);
            
            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sql);
            }
        }

        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
