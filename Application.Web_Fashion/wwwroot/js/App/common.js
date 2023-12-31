﻿
function siteCurrency() {
    if (!window.currency) {
        $.ajax({
            dataType: "json",
            url: '/Setting/GetCurrencySymbol',
            type: 'GET',
            async: false,
            success: function (data) {
                window.currency = data;
            },
            error(xhr) {
                window.currency = "$"
            }
        });
    }
    return window.currency;
}

function getVatPercentage() {
    if (!window.vat) {
        $.ajax({
            dataType: "json",
            url: '/Setting/GetVat',
            type: 'GET',
            async: false,
            success: function (data) {
                window.vat = data;
            },
            error(xhr) {
                window.vat = "0"
            }
        });
    }
    return window.vat;
}

function getStripePublishKey() {
    var key = '';
    $.ajax({
        dataType: "json",
        url: '/Setting/GetStripePublishKey',
        type: 'GET',        
        async: false,
        success: function (data) {
            key = data;
        },
        error(xhr) {
            var e = xhr.responseText;            
        }
    });
    return key;
}

//--------------------------- Start: Shopping Cart -----------------------------

function getShippingCharge() {
    return 0; // 1000;
}

function getPrefecture_City(postalCode) {
    var map = window.address;
    var addr = map.get(postalCode);
    return addr;
}

function getSummaryAmount() {
    
    var subTotal = 0;
    var grandTotal = 0;
    var vatAmount = 0;
    var shippingAmount = 0;
    var totalQuantity = 0;

    var cart = getCart();

    for (var i = 0; i < cart.length; i++) {

        var itemTotal = (parseFloat(cart[i].RetailPrice, 10) * parseInt(cart[i].Quantity, 10));
        subTotal += itemTotal;
        totalQuantity += parseInt(cart[i].Quantity, 10);
    }

    vatAmount = Math.round((subTotal * getVatPercentage()) / 100);
    shippingAmount = 0; //1000; // TODO
    grandTotal = subTotal + vatAmount + shippingAmount;

    var obj = {
        subTotal: subTotal,
        vatAmount: vatAmount,
        shippingAmount: shippingAmount,
        grandTotal: grandTotal,
        totalQuantity: totalQuantity
    };
    return obj;
}

function addToCart(attributeVariationId, productId, name, quantity, price, imageUrl) {

    var cart = getCart();

    if (cart === null) {
        cart = [];        
    }

    var isAdded = false;

    for (var i = 0; i < cart.length; i++) {

        if (attributeVariationId) {
            if (cart[i].Id === productId && cart[i].AttributeVariationId === attributeVariationId) {
                cart[i].Quantity = parseInt(cart[i].Quantity, 10) + parseInt(quantity, 10);

                isAdded = true;
                break;
            }
        } else {

            if (cart[i].Id == productId) {
                cart[i].Quantity = parseInt(cart[i].Quantity, 10) + parseInt(quantity, 10);

                isAdded = true;
                break;
            }
        }
    }

    if (!isAdded) {
        cart.push({ AttributeVariationId: attributeVariationId, Id: productId, Name: name, Quantity: quantity, RetailPrice: price, ImageUrl: imageUrl });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function animateAddToCart(obj) {
    var cart = $('.top-shopping-cart');
    var sectionParent = $(obj).closest('.item-link-container');
    var img = $('.grid-item-image', sectionParent).find("img").eq(0);

    var imgtodrag = img;
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        setTimeout(function () {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {            
        });
    }
}

function updateCartCounter() {
    $('#nav-cart-count').html(getCartItemCount());
}

function clearCart() {
    removeCartItem();
}

function getCartItemCount() {

    var totalItemCount = 0;
    var cart = getCart();
    
    for (var i = 0; i < cart.length; i++) {
        totalItemCount += parseInt(cart[i].Quantity, 10);
    }

    return totalItemCount;
}

function getCart() {
    var cart = localStorage.getItem('cart');
    if (!cart) {
        return [];
    }
    return JSON.parse(cart);
}

function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function removeCartItem(productId) {

    if (productId) {
        var cartItems = jQuery.removeFromArray(productId, getCart());        
    }
    else {
        var cartItems = [];        
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCounter();
}

jQuery.removeFromArray = function (value, arr) {
    return jQuery.grep(arr, function (elem, index) {
        return elem.Id !== value;
    });
};
//--------------------------- End: Shopping Cart -------------------------------


function setButtonState(buttonId, isDisable) {
    $('#' + buttonId).prop('disabled', isDisable);
}

function showAlertMessage(isSuccess, message) {
    if (isSuccess) {
        $('.alert-success').show();
        $('.alert-danger').hide();

        if (message) {
            $('.message-text', $('.alert-success')).html(message);
        }

    } else {
        $('.alert-success').hide();
        $('.alert-danger').show();

        if (message) {
            $('.message-text', $('.alert-danger')).html(message);
        }
    }
}

function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function json2JavascriptDate(jsonDate) {
    if (jsonDate && jsonDate !== '') {
        return new Date(parseInt(jsonDate.replace('/Date(', '').replace(')/', ''), 10));
    }
    //else return "input is not a json date";
}

function getChromeFormattedDate(stringDate) {
    var dateParts = stringDate.split('-');
    var month = dateParts[0] - 1, day = dateParts[1], year = dateParts[2];
    return $filter('date')(new Date(year, month, day), 'yyyy-MM-dd');
}

function getUserStatus() {
    var isLoggedIn = false;
    var isVerified = false;
    var isAdmin = false;

    $.ajax({
        'async': false,
        'url': '/Account/GetUserStatus',
        'success': function (data) {
            isLoggedIn = data.isLoggedIn;
            isVerified = data.isVerified;
            isAdmin = data.isAdmin;
        }
    });
    return { isLoggedIn: isLoggedIn, isVerified: isVerified, isAdmin: isAdmin };
}

/*------------------- Feedback Slider -------------------*/
$(function () {
    $("#feedback-tab").click(function () {
        $("#feedback-form").toggle("slide");
    });

    $("#fb-btnClose").click(function () {
        $("#feedback-form").hide('slide');
    });

    function clearFBControl() {
        $('#fb-email').val('');
        $('#fb-message').val('');
    }

    function showHide_FB_Loading(show) {
        if (show) {
            $('#fb-status-msg').show();
            $('#fb-email').attr('disabled', 'disabled');
            $('#fb-message').attr('disabled', 'disabled');
            $('#fb-btnSend').attr('disabled', 'disabled');
        }
        else {
            $('#fb-status-msg').hide();
            $('#fb-email').removeAttr('disabled');
            $('#fb-message').removeAttr('disabled');
            $('#fb-btnSend').removeAttr('disabled');
        }
    }

    $("#fb-btnSend").click(function () {
        var subject = 'Quick Feedback';
        var email = $('#fb-email').val();
        var message = $('#fb-message').val();

        showHide_FB_Loading(true);
        $('#fb-status-msg').html("Sending...");

        $.ajax({
            dataType: "json",
            url: '/Static/ContactUs',
            type: 'POST',
            data: { subject: subject, email: email, description: message },
            success: function (data) {
                showHide_FB_Loading(false);
                if (data.isSuccess) {
                    $('#fb-status-msg').html("Message Sent!");
                    clearFBControl();
                }
                else{
                    
                }
            },
            error: function (xhr) {
                showHide_FB_Loading(false);                
            }
        });
    });
});
/*---------------- End Feedback Slider ------------------*/
