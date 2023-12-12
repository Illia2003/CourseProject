function populateOrderDetails(callback) {

    var orderId = getParam('orderId');

    $('.item-loading').show();    
    $.ajax({
        dataType: "json",
        url: '/Customer/GetOrderDetails',
        data: {orderId: orderId},
        success: function (order) {
            $('.item-loading').hide();
            renderOrderItems(order);
            
        },
        error: function (xhr) {
            $('.item-loading').hide();
        }
    });
}

function populateCustomerAddress(userId) {

    $.ajax({
        dataType: "json",
        url: '/Admin/GetCustomer',
        data: { id: userId },
        success: function (customer) {
            if (customer) {
                $('#txtPhone').val(customer.Username);
                $('#txtFirstName').val(customer.FirstName);
                $('#txtLastName').val(customer.LastName);
                $('#txtCity').val(customer.ShipCity);
                $('#ddlPrefecture').val(customer.ShipState);
                $('#txtPostCode').val(customer.ShipZipCode);
                $('#txtAddress').val(customer.ShipAddress);
            }
        },
        error: function (xhr) {
            
        }
    });
}

function printOrder() {

    var orderId = getParam('orderId');
    window.location.href = "/Order/PrintOrder?orderId=" + orderId;
}

function printInvoice() {

    var orderId = getParam('orderId');
    window.location.href = "/Order/PrintInvoice?orderId=" + orderId;
}

function renderOrderItems(order) {

    var subTotal = 0;
    var discount = 0;
    var vatAmount = 0;
    var shippingAmount = 0;
    var grandTotal = 0;
    var totalQuantity = 0

    if (order) {

        var weight = order.TotalWeight ? order.TotalWeight + ' Kg' : '';
        var deliveryDateTime = (order.DeliveryDate && order.DeliveryTime) ? order.DeliveryDate + ' ' + (order.DeliveryTime === 'Not Specified' ? '' : order.DeliveryTime) : '';

        $('#orderCode').html(order.OrderCode);
        $('#orderMode').html(order.OrderMode);
        $('#orderStatus').html(order.OrderStatus);
        $('#totalWeight').html(weight);
        $('#deliveryDate').html(deliveryDateTime);
        $('#frozenItem').html(order.IsFrozen ? 'Yes' : 'No');
        $('#orderDate').html(moment(order.ActionDate, "x").format('DD MMM YYYY h:mm:ss a'));

        if (order.OrderMode === 'Store') {
            $('#trTotalWeight').hide();
            $('#trDeliveryDate').hide();
        }
    }

    var html = '<table class="tbl-shopping-cart-items">';

    html += '<tr class="shopping-cart-header">';
    html += '<td style="width:50px;text-align:center;">SL</td>';
    html += '<td style="width:100px;">Image</td>';
    html += '<td class="left">Name</td>';
    html += '<td class="center" style="width:150px;">Price</td>';
    html += '<td class="center" style="width:100px;">Qty</td>';
    html += '<td class="right" style="width:150px;">Total</td>';
    html += '</tr>';

    for (var i = 0; i < order.OrderItems.length; i++) {

        var item = order.OrderItems[i];

        var itemTotal = (parseFloat(item.Price, 10) * parseInt(item.Quantity, 10));

        html += '<tr>';

        html += '<td style="text-align:center;">';
        html += '<span>' + (i + 1) + '</span>';
        html += '</td>';

        html += '<td>';
        html += '<img src="' + item.ImageUrl + '" style="" class="img-cart" />';
        html += '</td>';

        html += '<td class="left">';
        html += '<span>' + item.ProductName + '</span>';
        html += '</td>';

        html += '<td class="center">';
        html += '<span>' + siteCurrency() + item.Price + '</span>';
        html += '</td>';

        html += '<td class="center">';
        html += '<span>' + item.Quantity + '</span>';
        html += '</td>';

        html += '<td class="right">';
        html += '<span>' + siteCurrency() + itemTotal + '</span>';
        html += '</td>';

        html += '</tr>';
    }

    // Getting summary calculated amount
    subTotal = order.PayAmount + order.Discount - order.Vat - order.ShippingAmount;
    discount = order.Discount;
    vatAmount = order.Vat;
    shippingAmount = order.ShippingAmount ? order.ShippingAmount : 0;
    grandTotal = order.PayAmount;
    totalQuantity = order.OrderItems.length;

    // Summary row
    html += '<tr class="summary-row right">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Sub Total:</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + subTotal.toFixed(2) + '</span>';
    html += '</td>';

    html += '</tr>';

    // Discount row    
    if (order.Discount > 0) {
        html += '<tr class="summary-row">';

        html += '<td colspan="5">';
        html += '<span style="float:right;">(-)Discount:</span>';
        html += '</td>';

        html += '<td class="right">';
        html += '<span>' + siteCurrency() + order.Discount + '</span>';
        html += '</td>';

        html += '</tr>';
    }

    // Vat amount row    
    html += '<tr class="summary-row">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Vat:</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + vatAmount + '</span>';
    html += '</td>';

    html += '</tr>';

    // Shipping amount row
    html += '<tr class="summary-row shipping-cost">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Shipping Charge:</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + shippingAmount + '</span>';
    html += '</td>';

    html += '</tr>';

    // Grand total row
    html += '<tr class="summary-row grand-total">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Grand Total:</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + grandTotal + '</span>';
    html += '</td>';

    html += '</tr>';

    // Shipping charge note
    html += '<tr class="summary-row shipping-cost-note">';
    html += '<td colspan="6">';
    html += '<span class="" style="float:right; font-weight:400;">Note: Shipping charge will be added based on location and weight</span>';
    html += '</td>';
    html += '</tr>';

    html += '</table>';

    $('#order-details-item-list').html(html);
}

app.controller('AdminOrderDetailsCtrl', ['$rootScope', '$scope', '$http', '$filter', '$location', 'Enum', 'service', function ($rootScope, $scope, $http, $filter, $location, Enum, service) {

    var orderId = getParam('orderId');

    if (orderId) {
        getOrder(orderId);
    }

    function getOrder(orderId) {
        populateOrderDetails(orderId);        
    }

    $('#printOrder').click(function () {
        printOrder();
    });

    $('#printInvoice').click(function () {
        printInvoice();
    });
    
}]);
