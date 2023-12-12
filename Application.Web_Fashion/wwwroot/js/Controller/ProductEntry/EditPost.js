$(document).ready(function () {
            
});

// SERVICE
app.factory('editPostService', ['$http', function ($http) {

    return {        
        updateProduct: function (product) {

            formData = new FormData();
            formData.append('product', JSON.stringify(product));

            return $http.post('/ProductEntry/UpdateProduct', formData, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            });
        },

        getProduct: function (id) {
            return $http({
                url: '/Product/GetProduct',
                method: 'GET',
                async: true,
                params: { id: id }
            });
        },

        getBranchList: function () {
            return $http.get('/Branch/GetUserBranchList');
        },

        getSupplierList: function () {
            return $http.get('/Supplier/GetSupplierList');
        },
        getItemtypeList: function () {
            return $http.get('/ItemType/GetItemTypeList');
        },
        getColorList: function () {
            return $http.get('/Lookup/GetLookups?name=color');
        },
        getConditionList: function () {
            return $http.get('/Lookup/GetLookups?name=condition');
        },
        getCapacityList: function () {
            return $http.get('/Lookup/GetLookups?name=capacity');
        },
        getManufacturerList: function () {
            return $http.get('/Lookup/GetLookups?name=manufacturer');
        }
    };

}
]);

// CONTROLLER
app.controller('editPostCtrl', ['$rootScope', '$scope', '$http', '$window', '$filter', '$location', 'Enum', 'editPostService', function ($rootScope, $scope, $http, $window, $filter, $location, Enum, editPostService) {
 
    var formData = new FormData();
    var productId = getParam('id');

    // Initialize date picker
    $('#expireDate').datepicker({ autoclose: true, todayHighlight: true }).next().on(ace.click_event, function () { $(this).prev().focus(); });

    // Load branch & supplier list
    getBranchList();
    getSupplierList();
    getItemTypeList();

    getProduct(productId);

    function getProduct(id) {
        editPostService.getProduct(id)
            .success(function (product) {

                var retailPrice = parseFloat(product.RetailPrice, 10) + parseFloat(product.Discount, 10);

                $scope.barcode = product.Barcode
                $scope.branchId = product.BranchId;
                $scope.title = product.Title;
                $scope.description = product.Description;
                $scope.costPrice = product.CostPrice;
                $scope.retailPrice = retailPrice;
                $scope.Discount = product.Discount;
                $scope.weight = product.Weight;
                $scope.unit = product.Unit;
                $scope.quantity = product.Quantity;
                $scope.lowStockAlert = product.LowStockAlert;
                $scope.isFeatured = product.IsFeatured;
                $scope.itemTypeId = product.ItemTypeId;
                $scope.supplierId = product.SupplierId;
            
        })
        .error(function (xhr) {
            
        });
    }    

    $scope.numberOnly = function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }       

    $scope.sellTypeChange = function () {
        if (parseInt($scope.sellType, 10) === 1) {
            $scope.isAuction = false;
        }
        else {
            $scope.isAuction = true;
        }
    }

    $scope.updateProduct = function () {

        $scope.submitted = true;
        if ($scope.myForm.$invalid) {
            return false;
        }

        $scope.shortCode = $('#shortCode').val();

        // Validation
        if (!$scope.branchId) {
            bootbox.alert("<h4>Please select a branch!</h4>", function () { });
            return;
        }
        else if (!$scope.title) {
            bootbox.alert("<h4>Please enter product title!</h4>", function () { });
            return;
        }        
        else if (!$scope.description) {
            bootbox.alert("<h4>Please enter product description!</h4>", function () { });
            return;
        }
        else if (!$scope.supplierId) {
            bootbox.alert("<h4>Please select product supplier!</h4>", function () { });
            return;
        }        
        else if (!$scope.costPrice) {
            bootbox.alert("<h4>Please enter product cost price!</h4>", function () { });
            return;
        }
        else if (!$scope.retailPrice) {
            bootbox.alert("<h4>Please enter product retail price!</h4>", function () { });
            return;
        }

        var retailPrice = parseFloat($scope.retailPrice, 10);

        var product = {};
        product.Id = productId;        
        product.Barcode = $scope.barcode;
        product.BranchId = $scope.branchId;
        product.Title = $scope.title;
        product.Description = $scope.description;
        //product.CategoryId = parseInt(window.selectedCategoryId, 10);
        product.CostPrice = parseFloat($scope.costPrice, 10);
        product.RetailPrice = retailPrice;
        product.Discount = !$scope.Discount ? 0 : parseFloat($scope.Discount, 10);        
        product.Weight = !$scope.weight ? 0 : parseFloat($scope.weight, 10);
        product.Unit = $scope.unit;
        product.Quantity = !$scope.quantity ? 0 : parseInt($scope.quantity, 10);
        product.LowStockAlert = !$scope.lowStockAlert ? 0 : parseInt($scope.lowStockAlert, 10);
        product.IsFeatured = !$scope.isFeatured ? 0 : 1;
        product.ItemTypeId = $scope.itemTypeId;
        product.SupplierId = $scope.supplierId;        
        
        editPostService.updateProduct(product)
            .success(function (data) {
                if (data.isSuccess) {
                    window.location.href = "/ProductEntry/PostProductMessage";
                }
                else {
                    if (data.message) {
                        bootbox.alert("<h4>" + data.message + "</h4>", function () { });
                    }
                    else {
                        bootbox.alert("<h4>Something wrong! Failed to post the product</h4>", function () { });
                    }                    
                }
            })
            .error(function (exception) {
                bootbox.alert("<h4>Error Occured!!!</h4>", function () { });
            });
    }

    function getStringToDate(ddmmyyyy) {
        var from = ddmmyyyy.split("-");
        var dt = new Date(from[2], from[1] - 1, from[0]);
        return dt;
    }

    function getBranchList() {
        editPostService.getBranchList()
        .success(function (data) {
            $scope.branchList = data;
        })
        .error(function (xhr) {
            ShowError('Error to get branches');
        });
    }

    function getSupplierList() {
        editPostService.getSupplierList()
        .success(function (data) {
            $scope.supplierList = data;
        })
        .error(function (xhr) {
            ShowError('Error to get suppliers');
        });
    }

    function getItemTypeList() {
        editPostService.getItemtypeList()
        .success(function (data) {
            $scope.itemTypeList = data;
        })
        .error(function (xhr) {
            ShowError('Error to get suppliers');
        });
    }
    
    $scope.CheckFile = function (file) {        
        if (file != null) {
            if ((file.type == 'image/png' || file.type == 'image/jpeg') && file.size <= (4096 * 1024)) { // limit photo size to 4 mb
                $scope.FileInvalidMessage = "";
                $scope.IsFileValid = true;
            }
            else {
                $scope.IsFileValid = false;
                bootbox.alert("<h4>Invalid file is selected. (File format must be png or jpeg. Maximum file size 4 mb)</h4>", function () { });
            }
        }        
    };

}]);