$(document).ready(function () {

    builtShoppingCartItems();

    confirmOrderList();

    getUserInformation();

    showStep();

    function showStep() {
        var param = getParam('step');
        if (param === 'confirm-order') {
            $('#div-confirm-order').show();
            $('#div-place-order').hide();
        }
    }

    $('.tbl-shopping-cart-items').on('click', '.delete-shopping-cart-item', function () {
        var id = $(this).attr('id');
        
        removeCartItem(id)

        var currentTr = $(this).closest("tr");
        $(currentTr).remove();

        builtShoppingCartItems();        
    });

    $('#btnClearCart').click(function () {

        bootbox.confirm("<h3 class='text-danger'>Clear Cart Items</h3> " +
                        "<br/><h4 class='text-info'> Are you sure to clear the cart?</h4>",
                        function (result) {
                            if (result) {
                                clearCart();
                                builtShoppingCartItems();
                            }
                        });

    });

    $('#btnUpdateCart').click(function () {
        
        var cart = getCart();
        for (var i = 0; i < cart.length; i++) {
            var quantityInputBoxId = 'txtQty_' + cart[i].Id;
            cart[i].Quantity = $('#' + quantityInputBoxId).val();
        }
        
        updateCart(cart);
        builtShoppingCartItems();
    });

    function showLoader() {
        $('#order-loader').show();
        $('#btnBack').show();
        $("#btnConfirmOrder").prop("disabled", true);
        $("#btnBack").prop("disabled", true);
    }

    function hideLoader() {
        $('#order-loader').hide();
        $('#btnBack').hide();
        $("#btnConfirmOrder").prop("disabled", false);
        $("#btnBack").prop("disabled", false);
    }

    function isCodPayment() {

        // COD or Card payment
        var isCod = false;
        if ($("#rbCod").is(":checked")) {
            isCod = true;
        }

        return isCod;
    }

    // Here order records are save
    $('#btnConfirmOrder').click(function () {
        var userStatus = getUserStatus();
        if (!userStatus.isLoggedIn) {
            window.location.href = '/Security/Login/?returnUrl=/cart';
            return;
        }

        // COD or Card
        var isCOD = isCodPayment();
        
        var order = {};
        order.OrderItems = [];        
        
        var cart = getCart();
        var totalAmount = 0;
        var val = 0;
        var shippingAmount = getShippingCharge();
        var grandTotal = 0;

        for (var i = 0; i < cart.length; i++) {

            var orderItem = {};

            var price = parseFloat(cart[i].RetailPrice, 10);
            var quantity = parseInt(cart[i].Quantity, 10);

            orderItem.Title = cart[i].Name;
            orderItem.ProductId = cart[i].Id;
            orderItem.AttributeVariationId = cart[i].AttributeVariationId;
            orderItem.Quantity = quantity;
            orderItem.Discount = 0;
            orderItem.Price = price;
            orderItem.TotalPrice = quantity * price;
            orderItem.ImageUrl = cart[i].ImageUrl;

            order.OrderItems.push(orderItem);

            totalAmount += (price * quantity);
        }

        vat = Math.round((totalAmount * getVatPercentage()) / 100);
        grandTotal = totalAmount + vat + shippingAmount;

        order.OrderMode = 'Online';

        order.OrderStatus = 'Processing';
        order.PaymentStatus = 'Pending';
        order.PaymentType = isCOD === true ? 'COD' : 'Card';

        order.PayAmount = grandTotal;        
        order.Vat = vat;
        order.ShippingAmount = shippingAmount;


        showLoader();

        // Saving Records
        $.ajax({
            dataType: "json",
            contentType: 'application/json',
            url: '/Customer/PlaceOrder',
            data: JSON.stringify(order),
            method: 'POST',
            success: function (data) {
                if (data.isSuccess) {

                    clearCart();

                    if (isCOD) {                        
                        window.location.href = '/Customer/OrderConfirm?orderCode=' + data.orderCode;
                    }
                    else {
                        proceedToCardPayment(data.orderId, data.orderCode, grandTotal);
                    }
                }
                else {
                    hideLoader();
                    bootbox.alert("<h4>Failed to place your order!</h4>", function () { });
                }

                $('#updateStatus').html('');
            },
            error: function (xhr) {
                hideLoader();
                $('#updateStatus').html('');
                bootbox.alert("<h4>Error occured while placing your order!</h4>", function () { });
            }
        });

    });

    function proceedToCardPayment(orderId, orderCode, amount) {

        $.ajax({
            dataType: "json",
            url: '/Customer/CardPayment',
            type: 'POST',
            data: { orderId: orderId, orderCode: orderCode, amount: amount },
            success: function (data) {
                if (data.isSuccess) {

                    var stripeKey = getStripePublishKey();
                    var stripe = Stripe(stripeKey);

                    stripe.redirectToCheckout({
                        sessionId: data.sessionId
                    }).then(function (result) {
                        bootbox.alert("<h4>" + result.error.message + "</h4>", function () { });
                    });

                }
                else {
                    hideLoader();
                    bootbox.alert("<h4>Failed to initiate your order!</h4>", function () { });
                }
            },
            error: function (xhr) {
                hideLoader();
                bootbox.alert("<h4>Error occured while initiating your order!</h4>", function () { });
            }
        });
    }

    $('#btnPlaceOrder').click(function () {

        var userStatus = getUserStatus();
        if (!userStatus.isLoggedIn) {
            window.location.href = '/Security/Login/?returnUrl=/cart';
            return;
        }

        var isCOD = isCodPayment();
        if (isCOD) {
            $('#btnConfirmOrder').html('Confirm Order');
        }
        else {
            $('#btnConfirmOrder').html('Confirm Order & Proceed to Pay');
        }

        $('#div-confirm-order').show();
        $('#div-place-order').hide();

    });

    $('#btnBack,#btnEditAddr').click(function () {
        $('#div-place-order').show();
        $('#div-confirm-order').hide();
    });    

    $('#btnUpdateAddress').click(function () { 

        $('#updateStatus').html('Updating your address...');

        var mobile = $('#mobile').val();
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();        
        var address = $('#address').val();
        var zipCode = $('#zip').val();
        var city = $('#city').val();
        var state = $('#state').val();
        var country = $('#country').val();

        if (!zipCode) {
            bootbox.alert("<h4>Please enter zipcode!</h4>", function () { });
            return;
        }
        else if (!state) {
            bootbox.alert("<h4>Please enter prefecture!</h4>", function () { });
            return;
        }
        else if (!city) {
            bootbox.alert("<h4>Please enter city!</h4>", function () { });
            return;
        }
        else if (!firstName) {
            bootbox.alert("<h4>Please enter your name!</h4>", function () { });
            return;
        }

        $.ajax({
            dataType: "json",
            url: '/Account/UpdateUserAddress',
            data: { mobile: mobile, firstName: firstName, lastName: lastName, address: address, zipCode: zipCode, city: city, state: state, country: country },
            method: 'POST',            
            success: function (data) {
                if (data.isSuccess) {

                    // Show in confirm order section
                    $('#showFirstName').html(firstName);
                    $('#showMobile').html(mobile);
                    $('#showAddress').html(address);
                    $('#showZipCode').html(zipCode);
                    $('#showCity').html(city);
                    $('#showState').html(state);
                    
                    bootbox.alert("<h4>Your address has been updated sucessfully!</h4>", function () { });
                }
                else {
                    if (data.message) {
                        bootbox.alert("<h4>"+ data.message +"</h4>", function () { });
                    }
                    else {
                        bootbox.alert("<h4>Failed to update!</h4>", function () { });
                    }
                }

                $('#updateStatus').html('');
            },
            error: function (xhr) {
                $('#updateStatus').html('');
                bootbox.alert("<h4>Error occured while updating your address!</h4>", function () { });
            }
        });
    });
    
});

// Get user information
function getUserInformation() {

    var isLoggedIn = false;
    var userStatus = getUserStatus();
    if (userStatus.isLoggedIn) {
        isLoggedIn = true;
    }

    if (isLoggedIn) {
        $.ajax({
            dataType: "json",
            url: '/Account/GetLoggedInUserAddress',
            success: function (data) {
                if (data) {
                    $('#firstName').val(data.FirstName);
                    $('#mobile').val(data.Username);
                    $('#address').val(data.ShipAddress);
                    $('#zip').val(data.ShipZipCode);
                    $('#city').val(data.ShipCity);
                    $('#state').val(data.ShipState);
                    
                    // Show in confirm order section
                    $('#showFirstName').html(data.FirstName);
                    $('#showMobile').html(data.Username);
                    $('#showAddress').html(data.ShipAddress);
                    $('#showZipCode').html(data.ShipZipCode);
                    $('#showCity').html(data.ShipCity);
                    $('#showState').html(data.ShipState);                    
                }
            },
            error: function (xhr) {
            }
        });
    }
    else {
        $('.customer-address').hide();
    }
}

function builtShoppingCartItems() {
    
    var subTotal = 0;
    var vatAmount = 0;
    var shippingAmount = getShippingCharge();
    var grandTotal = 0;

    var cart = getCart();

    var html = '<table class="tbl-shopping-cart-items">';

    html += '<tr class="shopping-cart-header">';
    html += '<td>Image</td>';
    html += '<td>Name</td>';
    html += '<td class="center">Price</td>';
    html += '<td class="center">Qty</td>';
    html += '<td class="center">Total</td>';
    html += '<td class="center">Remove</td>';
    html += '</tr>';
    
    for (var i = 0; i < cart.length; i++) {

        var itemTotal = (parseFloat(cart[i].RetailPrice, 10) * parseInt(cart[i].Quantity, 10));
        var quantityInputBoxId = 'txtQty_' + cart[i].Id;

        html += '<tr>';

        html += '<td>';
        html += '<img src="' + cart[i].ImageUrl + '" />';
        html += '</td>';

        html += '<td>';
        html += '<a href="/Product/Details?id=' + cart[i].Id + '">' + cart[i].Name + '</a>';
        html += '</td>';

        html += '<td class="center">';
        html += '<span>' + siteCurrency() + cart[i].RetailPrice + '</span>';
        html += '</td>';

        html += '<td>';
        html += '<input type="number" class="font-control" style="width:50px; text-align:center;" value="' + cart[i].Quantity + '" id="'+ quantityInputBoxId +'" />';
        html += '</td>';

        html += '<td class="center">';
        html += '<span>' + siteCurrency() + itemTotal + '</span>';
        html += '</td>';

        html += '<td class="center">';
        html += '<img id="' + cart[i].Id + '" class="delete-shopping-cart-item img-cart" src="/Images/cross.png" style="cursor:pointer;">';
        html += '</td>';

        html += '</tr>';        
    }

    html += '</table>';

    // Getting summary calculated amount
    var obj = getSummaryAmount();
    subTotal = obj.subTotal;
    vatAmount = obj.vatAmount;
    shippingAmount = obj.shippingAmount;
    grandTotal = obj.grandTotal;
    
    $('#checkout-subTotal').html(siteCurrency() + subTotal);
    $('#vatPerc').html('(' + getVatPercentage() + '%)');
    $('#checkout-vatAmount').html(siteCurrency() + vatAmount);
    $('#checkout-shippingAmount').html(siteCurrency() + shippingAmount);
    $('#checkout-grandTotal').html(siteCurrency() + (grandTotal));
    
    $('.shopping-cart-container').html(html);
}

function confirmOrderList() {

    var subTotal = 0;
    var vatAmount = 0;
    var shippingAmount = getShippingCharge();
    var grandTotal = 0;
    var totalQuantity = 0

    var cart = getCart(); 

    var html = '<table class="tbl-shopping-cart-items">';

    html += '<tr class="shopping-cart-header">';
    html += '<td>SL</td>';
    html += '<td>Image</td>';
    html += '<td class="left">Name</td>';
    html += '<td class="center">Price</td>';
    html += '<td class="center">Qty</td>';
    html += '<td class="right">Total</td>';    
    html += '</tr>';

    for (var i = 0; i < cart.length; i++) {

        var itemTotal = (parseFloat(cart[i].RetailPrice, 10) * parseInt(cart[i].Quantity, 10));

        html += '<tr>';

        html += '<td>';
        html += '<span>'+ (i + 1) +'</span>';
        html += '</td>';

        html += '<td>';
        html += '<img src="' + cart[i].ImageUrl + '" class="img-cart" />';
        html += '</td>';

        html += '<td class="left">';
        html += '<a href="/Product/Details?id=' + cart[i].Id + '">' + cart[i].Name + '</a>';
        html += '</td>';

        html += '<td class="center">';
        html += '<span>' + siteCurrency() + cart[i].RetailPrice + '</span>';
        html += '</td>';

        html += '<td>';
        html += '<span>' + cart[i].Quantity + '</span>';
        html += '</td>';

        html += '<td class="right">';
        html += '<span>' + siteCurrency() + itemTotal + '</span>';
        html += '</td>';

        html += '</tr>';
    }

    // Getting summary calculated amount
    var obj = getSummaryAmount();
    subTotal = obj.subTotal;
    vatAmount = obj.vatAmount;
    shippingAmount = obj.shippingAmount;
    grandTotal = obj.grandTotal;
    totalQuantity = obj.totalQuantity;

    // Summary row
    html += '<tr class="summary-row right">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Sub Total ('+ totalQuantity +' items):</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + subTotal + '</span>';
    html += '</td>';

    html += '</tr>';
    
    // Vat amount row    
    html += '<tr class="summary-row">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Vat (' + getVatPercentage() + '%):</span>';
    html += '</td>';

    html += '<td class="right">';
    html += '<span>' + siteCurrency() + vatAmount + '</span>';
    html += '</td>';

    html += '</tr>';

    // Shipping amount row
    html += '<tr class="summary-row shipping-cost">';

    html += '<td colspan="5">';
    html += '<span style="float:right;">Shipping Cost:</span>';
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

    $('#order-item-list').html(html);
}