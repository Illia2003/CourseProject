using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Service.Properties;
using System;

namespace Application.Service
{

    public interface IAttributeNameService
    {
        void CreateAttributeName(AttributeName attributeName);
        void UpdateAttributeName(AttributeName attributeName);
        void DeleteAttributeName(AttributeName attributeName);
        IEnumerable<AttributeName> GetAttributeNames();        
        AttributeName GetAttributeName(string name);
        void Commit();
    }

    public class AttributeNameService : IAttributeNameService
    {
        private readonly IAttributeNameRepository attributeNameRepository;
        private readonly IUnitOfWork unitOfWork;

        public AttributeNameService(IAttributeNameRepository attributeNameRepository, IUnitOfWork unitOfWork)
        {
            this.attributeNameRepository = attributeNameRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IAttributeNameService Members

        public void CreateAttributeName(AttributeName attributeName)
        {
            attributeNameRepository.Add(attributeName);
            Commit();
        }

        public void UpdateAttributeName(AttributeName attributeName)
        {
            attributeNameRepository.Update(attributeName);
            Commit();
        }

        public void DeleteAttributeName(AttributeName attributeName)
        {
            attributeNameRepository.Delete(attributeName);
            Commit();
        }

        public IEnumerable<AttributeName> GetAttributeNames()
        {
            var attributeNames = attributeNameRepository.GetAll().OrderBy(r => r.Name).ToList();
            return attributeNames;
        }
        
        public AttributeName GetAttributeName(string name)
        {
            var attributeName = attributeNameRepository.Get(r => r.Name == name);

            return attributeName;
        }
                
        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
