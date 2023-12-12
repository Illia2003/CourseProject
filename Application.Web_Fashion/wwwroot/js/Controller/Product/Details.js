
// SERVICE CALL
app.factory('productDetailsService', [
    '$http', function ($http) {

        return {
            getProduct: function (id) {
                return $http({
                    url: '/Product/GetProduct',
                    method: 'GET',
                    async: true,
                    params: { id: id }
                });
            },
            
            getRelatedProductList: function (categoryId, excludeProductId) {
                return $http({
                    url: '/Product/GetRelatedProducts',
                    method: 'GET',
                    async: true,
                    params: { categoryId: categoryId, excludeProductId: excludeProductId }
                });
            }            
        };

    }
]);

// CONTROLLER
app.controller('ProductDetailCtrl', ['$rootScope', '$scope', '$http', '$filter', '$location', '$compile', 'Enum', '$sce', 'productDetailsService', function ($rootScope, $scope, $http, $filter, $location, $compile, Enum, $sce, productDetailsService) {


    var productId = getParam('id');
    if (productId) {
        getProduct(productId);        
    }
    
    function getRelatedProductList(categoryId, productId) {
        productDetailsService.getRelatedProductList(categoryId, productId)
        .success(function (rpList) {

            for (var i = 0; i < rpList.length; i++) {
                $('.related-product-slider').append('<a href="/Product/Details?id='+ rpList[i].Id +'"><div data-index="' + i + 1 + '" class="rp-item"> ' +
                    
                                                        '<div class="rp-img"> ' +
                                                            '<img src="' + rpList[i].PrimaryImageName + '" alt="One">' +
                                                        '</div>' +
                                                            '<span class="rp-old-price">' + rpList[i].PriceTextOld + '</span>' + '<span class="rp-price theme-text-color">' + rpList[i].PriceText + '</span>' +
                                                        '<div class="rp-info">' +
                                                            '<div class="rp-info-title">' + rpList[i].Title + '</div>' +                                                            
                                                        '</div>' +                                                        
                                                     '</div></a>');
                
            }

            $('.related-product-slider').slick({
                slidesToShow: 6,
                slidesToScroll: 1,
                arrows: true,
                prevArrow:"<img class='a-left control-c prev slick-prev' src='/images/left-arrow.png'>",
                nextArrow:"<img class='a-right control-c next slick-next' src='/images/right-arrow.png'>",
                fade: false,
                speed: 300,
                responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 300,
                                settings: "unslick"
                            }
                ]
            });
        });
    }

    $scope.closeModal = function(){
        $('.slider-modal').hide();
        $('.slider-modal-close').hide();
        $('.max-view-icon').hide();
    }
    
    $('body').on('click', '.attrColor', function () {
        $('.attrColor').removeClass('color-select');
        $(this).addClass('color-select');

        var data = $(this).attr('data');
        window.selectedColor = data;

        setPrice();
    });

    $('body').on('click', '.attrSize', function () {
        $('.attrSize').removeClass('size-select');
        $(this).addClass('size-select');

        var data = $(this).attr('data');
        window.selectedSize = data;

        setPrice();
    });

    function setPrice() {

        var colorValue = '';
        var selectedColor = $('.color-select');
        if (selectedColor) {
            colorValue = selectedColor.attr('data');
        }

        var sizeValue = '';
        var selectedSize = $('.size-select');
        if (selectedSize) {
            sizeValue = selectedSize.attr('data');
        }

        var value1 = colorValue + ' - ' + sizeValue;
        var value2 = sizeValue + ' - ' + colorValue;
        var price = '';

        $scope.attributeVariations = $scope.product.AttributeVariations;

        if ($scope.attributeVariations) {
            for (var i = 0; i < $scope.attributeVariations.length; i++) {

                if ($scope.attributeVariations[i].Title.toLowerCase() === value1.toLowerCase() || $scope.attributeVariations[i].Title.toLowerCase() === value2.toLowerCase()) {
                    price = $scope.attributeVariations[i].Price;
                    window.price = price;

                    if ($scope.product.Discount) {
                        window.price = price - $scope.product.Discount;
                        window.oldPrice = price;
                    }

                    window.attributeVariationId = $scope.attributeVariations[i].Id;
                    break;
                }
            }
        }

        $('.item-price').html(siteCurrency() + window.price);        
        $('.old-price').html(window.oldPrice ? siteCurrency() + window.oldPrice : ''); 
    }

    function getAvailable_Colors_Sizes(attrVariations) {

        var colors = [];
        var sizes = [];

        for (var i = 0; i < attrVariations.length; i++) {

            var item = attrVariations[i].Title.split(' - ');
            if (item.length === 2) {

                // Color
                var colorFound = jQuery.inArray(item[0].toLowerCase(), colors);
                if (colorFound === -1) {
                    colors.push(item[0].toLowerCase());
                }

                // Size
                var sizeFound = jQuery.inArray(item[1], sizes);
                if (sizeFound === -1) {
                    sizes.push(item[1]);
                }
            }
        }

        var attrList = [];
        attrList.push(colors);
        attrList.push(sizes);

        return attrList;
    }

    function getProduct(id) {
        productDetailsService.getProduct(id)
        .success(function (data) {
            $('#product-description').html(data.Description ? data.Description.replace(/\n/g, '<br>') : "");
            $scope.product = data;

            // Product attributes: color & size
            var attrList = getAvailable_Colors_Sizes(data.AttributeVariations);
            var colors = attrList[0];
            var sizes = attrList[1];

            // Colors
            if (colors && colors.length > 0) {
                for (var i = 0; i < colors.length; i++) {
                    var colorHtml = '<a id="color-' + colors[i] + '" class="attrColor ' + colors[i] + '" data="' + colors[i] + '" ></a>';
                    $('#divColor').append(colorHtml);
                }
            }
            else {
                $('.color-view').hide();
            }

            // Sizes
            if (sizes && sizes.length > 0) {
                for (var i = 0; i < sizes.length; i++) {
                    var sizeHtml = '<a id="size-' + sizes[i] + '" class="attrSize" data="' + sizes[i] + '" >' + sizes[i] + '</a>';
                    $('#divSize').append(sizeHtml);
                }
            }
            else {
                $('.size-view').hide();
            }
            
            if (data.DefaultColor && data.DefaultSize) {
                window.selectedColor = data.DefaultColor;
                window.selectedSize = data.DefaultSize;

                $('#color-' + data.DefaultColor.toLowerCase()).addClass('color-select');
                $('#size-' + data.DefaultSize).addClass('size-select');

                setPrice();
            }
                                    
            // For shopping cart
            window.productId = data.Id;
            window.imageUrl = data.ImageList.length > 0 ? data.ImageList[0].ThumbImageName : '';
            window.price = data.RetailPrice;
            window.name = data.Title;            

            var imageList = data.ImageList;

            // Bread crumb
            var breadCrumb = '<a class="bc-item" style="position:relative; left: -3px;" href=/Home><i class="icon-home-1"></i>Home</a> <i class="icon-right-open-big"></i>';
            for (var i = 0; i < data.BreadCrumbList.length; i++) {
                var bc = data.BreadCrumbList[i];
                if (bc.Id) {
                    breadCrumb = breadCrumb + '<a class="bc-item" href=/Product/Search?cat=' + bc.Id + '>' + bc.Name + '</a> <i class="icon-right-open-big"></i>';
                }
                else {                    
                    breadCrumb = breadCrumb + '<span>' + bc.Name + '</span>';
                }
            }
            $('#bread-crumb').append(breadCrumb);

            var windowHeight = $(window).height();

            // Slick slider
            $('.slider').html('');
            for (var i = 0; i < imageList.length; i++) {
                $('.slider').append('<div class="slider-container" data-index="' + i + 1 + '"><span class="max-view-icon icon-search-4"></span><div style="display:table; height: 488px;"><div style="display:table-cell;vertical-align: middle;"><img class="slider-img" src="' + imageList[i].ImageName + '" alt="' + i + 1 + '"></div></div></div>');
                $('.slider-nav-thumbnails').append('<div data-index="' + i + 1 + '"><img src="' + imageList[i].ThumbImageName + '" alt="' + i + 1 + '"></div>');
                $('.slider-modal').append('<div data-index="' + i + 1 + '"><div style="display:table; height: ' + windowHeight + 'px;"><div style="display:table-cell;vertical-align: middle;"><img class="modal-details-slide-img" src="' + imageList[i].MaxViewImageName + '" alt="' + i + 1 + '"></div></div></div>');
            }

            $('.slider').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                fade: false,
                speed: 1,                
                prevArrow: "<a class='a-left control-c prev slick-prev'></a>",
                nextArrow: "<a class='a-right control-c next slick-next'></a>",
                asNavFor: '.slider-nav-thumbnails',
            });

            $('.slider-nav-thumbnails').slick({
                slidesToShow: 6,
                slidesToScroll: 0,
                asNavFor: '.slider',
                dots: false,
                arrows: false,
                focusOnSelect: true
            });

            $('.slider-modal').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                fade: false,
                speed: 1,
                prevArrow: "<a class='a-left control-c prev slick-prev'></a>",
                nextArrow: "<a class='a-right control-c next slick-next'></a>"
            });

            // If there are only one image then hide the thumb view
            if (imageList.length === 1) {
                $('.slider-nav-thumbnails').hide();
            }

            // If no logo available then hide it
            if (data.Seller.Store && !data.Seller.Store.LogoName) {
                $('#store-logo').css('border', '0');                
                $('.company-title').css('padding-left', '0');                
            }            

            // Load related products
            getRelatedProductList(data.Category.Id, data.Id);

        })
        .error(function (xhr) {            
        });
    }

    function animateAddToCart_DetailPage(obj) {
        var cart = $('.top-shopping-cart');
        var img = $('.slider-img').eq(0);

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

    $(document).ready(function () {

        // For shopping cart
        window.productId = '';
        window.imageUrl = '';
        window.price = '';
        window.name = '';        

        $('.btn-add-to-cart').click(function () {

            if ($scope.product.AttributeVariations && $scope.product.AttributeVariations.length > 0) {
                if (!window.selectedColor || !window.selectedSize) {
                    bootbox.alert("<h4>Please select Color & Size!</h4>", function () { });
                    return;
                }
            }

            var qty = $('#cartQuantity').val();
            var title = window.name + (window.selectedColor ? ' [Color: ' + window.selectedColor + ']' : '') + (window.selectedSize ? ' [Size: ' + window.selectedSize + ']' : '');

            addToCart(window.attributeVariationId, window.productId, title, qty, window.price, window.imageUrl); 

            animateAddToCart_DetailPage(this);
        });


        $('#btnPlus').click(function () {
            var qty = $('#cartQuantity').val();
            $('#cartQuantity').val(parseInt(qty, 10) + 1);
        });

        $('#btnMinus').click(function () {
            var qty = $('#cartQuantity').val();
            if (parseInt(qty, 10) > 1) {
                $('#cartQuantity').val(parseInt(qty, 10) - 1);
            }
        });


        $(document).on("mouseenter", ".slider-img", function () {
            $('.max-view-icon').css('display', 'inline-table');
        });

        $(document).on("mouseleave", ".slider-img", function () {
            $('.max-view-icon').hide();
        });

        $(document).on("mouseenter", ".max-view-icon", function () {
            $('.max-view-icon').css('display', 'inline-table');
        });
                
        $(".max-view-icon").live("click", function () {
            var dataIndex = $(this).parent().closest('.slick-slide').attr('data-slick-index');
            $('.slider-modal').slick('slickGoTo', dataIndex)
            $('.slider-modal').show();
            $('.slider-modal-close').show();

            $(".slider-modal").slick("refresh");
        });

        
        $(document).ready(function ($) {
            $('.tab_content').hide();
            $('.tab_content:first').show();
            $('.tabs li:first').addClass('active');
            $('.tabs li').click(function (event) {
                $('.tabs li').removeClass('active');
                $(this).addClass('active');
                $('.tab_content').hide();

                var selectTab = $(this).find('a').attr("href");

                $(selectTab).fadeIn();
            });
        });        
    });

}]);