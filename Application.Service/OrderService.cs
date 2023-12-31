using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Service.Properties;
using System;
using Application.Common;
using Application.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Service
{

    public interface IOrderService
    {
        void CreateOrder(Order order);
        void UpdateOrder(Order order);
        void DeleteOrder(Order order);
        bool CompleteOrder(string orderId);
        void OrderPaymentDone(string orderId);
        IEnumerable<Order> GetOrders(string userId);
        IEnumerable<Order> GetOrders(EOrderStatus orderStatus);
        IEnumerable<Order> GetOrders(int? branchId, DateTime fromDate, DateTime toDate, EOrderStatus orderStatus, EOrderMode orderMode);
        IEnumerable<Order> GetOnlineOrders(int count);
        Order GetOrder(string id);
        void Commit();
    }

    public class OrderService : IOrderService
    {
        private readonly IOrderRepository orderRepository;
        private readonly IUnitOfWork unitOfWork;

        public OrderService(IOrderRepository orderRepository, IUnitOfWork unitOfWork)
        {
            this.orderRepository = orderRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IOrderService Members

        public void CreateOrder(Order order)
        {
            orderRepository.Add(order);
            Commit();
        }

        public void UpdateOrder(Order order)
        {
            orderRepository.Update(order);
            Commit();
        }

        public void OrderPaymentDone(string orderId)
        {
            var order = orderRepository.Get(r => r.Id == orderId);
            if (order != null)
            {
                order.PaymentStatus = EPaymentStatus.Done.ToString();
                orderRepository.Update(order);
                Commit();                
            }
        }

        public void DeleteOrder(Order order)
        {
            string sqlDeleteOrderItems = String.Format("Delete From OrderItems Where OrderId = '{0}'", order.Id);
            string sqlDeleteOrder = String.Format("Delete From Orders Where Id = '{0}'", order.Id);

            using (var context = new ApplicationEntities(Utils.GetContextOptions()))
            {
                context.Database.ExecuteSqlRaw(sqlDeleteOrderItems + ";" + sqlDeleteOrder + ";");                
            }
        }

        public bool CompleteOrder(string orderId)
        {
            var order = orderRepository.Get(r => r.Id == orderId);
            if (order != null)
            {
                order.OrderStatus = EOrderStatus.Completed.ToString();
                orderRepository.Update(order);
                Commit();
                return true;
            }

            return false;
        }

        public IEnumerable<Order> GetOrders(string userId)
        {
            var orders = orderRepository.GetMany(r=> r.UserId == userId).OrderByDescending(r => r.ActionDate).ToList();
            return orders;
        }

        public IEnumerable<Order> GetOrders(EOrderStatus orderStatus)
        {
            var orders = orderRepository.GetMany(r => r.OrderStatus.ToLower() == orderStatus.ToString().ToLower()).OrderByDescending(r => r.ActionDate).ToList().Take(500);
            return orders;
        }

        public IEnumerable<Order> GetOrders(int? branchId, DateTime fromDate, DateTime toDate, EOrderStatus orderStatus, EOrderMode orderMode)
        {
            List<Order> orders = new List<Order>();

            if (branchId != null)
            {
                if (orderMode == EOrderMode.All)
                {
                    orders = orderRepository.GetMany(r => r.BranchId == (int)branchId && r.OrderStatus.ToLower() == orderStatus.ToString().ToLower() && r.ActionDate >= fromDate && r.ActionDate <= toDate).OrderByDescending(r => r.ActionDate).ToList();
                }
                else
                {
                    orders = orderRepository.GetMany(r => r.BranchId == (int)branchId && r.OrderStatus.ToLower() == orderStatus.ToString().ToLower() && r.OrderMode.ToLower() == orderMode.ToString().ToLower() && r.ActionDate >= fromDate && r.ActionDate <= toDate).OrderByDescending(r => r.ActionDate).ToList();
                }
            }
            else
            {
                if (orderMode == EOrderMode.All)
                {
                    orders = orderRepository.GetMany(r => r.OrderStatus.ToLower() == orderStatus.ToString().ToLower() && r.ActionDate >= fromDate && r.ActionDate <= toDate).OrderByDescending(r => r.ActionDate).ToList();
                }
                else
                {
                    orders = orderRepository.GetMany(r => r.OrderStatus.ToLower() == orderStatus.ToString().ToLower() && r.OrderMode.ToLower() == orderMode.ToString().ToLower() && r.ActionDate >= fromDate && r.ActionDate <= toDate).OrderByDescending(r => r.ActionDate).ToList();
                }
            }
            
            return orders;
        }

        public IEnumerable<Order> GetOnlineOrders(int count)
        {
            List<Order> orders = new List<Order>();
            orders = orderRepository.GetMany(r => r.OrderMode.ToLower() == EOrderMode.Online.ToString().ToLower() || r.OrderMode.ToLower() == EOrderMode.PhoneOrder.ToString().ToLower()).OrderByDescending(r => r.ActionDate).Take(count).ToList();
            return orders;
        }  

        public Order GetOrder(string id)
        {
            var order = orderRepository.Get(r => r.Id == id);

            return order;
        }
                
        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
