

// SERVICE
app.factory('attrVariationService', ['$http', function ($http) {

    return {
        updateStock: function (productList) {

            return $http({
                url: '/ProductEntry/PostBulkProduct',
                method: 'POST',
                data: JSON.stringify(productList)
            })
            
        }
    };

}]);

// CONTROLLER
app.controller('AttrVariationCtrl', ['$rootScope', '$scope', '$http', '$window', '$filter', '$location', 'Enum', 'attrVariationService', function ($rootScope, $scope, $http, $window, $filter, $location, Enum, attrVariationService) {

    loadAttributes();

    function showHideLoading(show) {
        if (show) {
            $('.post-product-status').show();
            $('#btnPostProduct').attr('disabled', 'disabled');
        }
        else {
            $('.post-product-status').hide();
            $('#btnPostProduct').removeAttr('disabled');
        }
    }

    function populateAttributes(callback) {

        var productId = getParam('productId');

        $('.item-loading').show();
        $.ajax({
            dataType: "json",
            url: '/Admin/GetAttributeVariationList',
            data: { productId: productId },
            success: function (recordSet) {
                $('.item-loading').hide();                
                var dataSet = [];
                if (recordSet.length > 0) {
                    for (var i = 0; i < recordSet.length; i++) {
                        var record = [];
                        record.push(recordSet[i].Id);
                        record.push(recordSet[i].Title);
                        record.push(recordSet[i].Price);                        
                        record.push(recordSet[i].Quantity);
                        
                        dataSet.push(record);
                    }
                }

                callback(dataSet);
            },
            error: function (xhr) {
                $('.item-loading').hide();
            }
        });
    }

    
    function loadAttributes() {

        populateAttributes(function (records) {
            $('#dt-update-attr').dataTable({
                "data": records,
                "destroy": true,
                "bLengthChange": false,
                "bFilter": true,
                "pageLength": 100,
                "columns": [
                    { "title": "Id" },
                    { "title": "Title" },
                    { "title": "Price", "class": "center", "width": "150px" },
                    { "title": "Quantity", "class": "center", "width": "150px" },
                    { "title": "Action", "class": "center", "width": "100px" }
                ],
                "aoColumnDefs": [
                    {
                        "aTargets": [0],
                        "visible": false
                    },
                    {
                        "aTargets": [2],
                        "sortable": false,
                        "mRender": function (data, type, row) {
                            var text = '<input id="price-'+ row[0] +'" type="number" class="form-control" style="width:100px; text-align:center;" value="'+ row[2] +'">';
                            return $("<div/>").append(text).html();
                        }
                    },
                    {
                        "aTargets": [3],
                        "sortable": false,
                        "mRender": function (data, type, row) {
                            var text = '<input id="qty-' + row[0] + '" type="number" class="form-control" style="width:100px; text-align:center;" value="' + row[3] + '">';
                            return $("<div/>").append(text).html();
                        }
                    },
                    
                    {
                        "aTargets": [4],
                        "searchable": false,
                        "sortable": false,
                        "mRender": function (data, type, row) {
                            var buttons = '<div><a title="Update Stock" id=' + row[0] + ' class="btn btn-primary update-attr-stock cursor-pointer"><b>Update</b></a></div>';
                            return $("<div/>").append(buttons).html();
                        }
                    }
                ]
            });
        });

    }

    $('#dt-update-attr').on('click', '.update-attr-stock', function () {
        var id = $(this).attr('id');
        var quantity = $('#qty-' + id).val();
        var price = $('#price-' + id).val();

        updateStock(id, price, quantity, function () {
            bootbox.alert("<h4>Data updated successfully!</h4>", function () { });         
        });
    });

    function updateStock(id, price, quantity, callback) { 
        $.ajax({
            dataType: "json",
            url: '/Admin/UpdateAttributeVariation',
            data: { id: id, price: price, quantity: quantity },
            success: function (data) {
                if (!data.IsSuccess) {
                    bootbox.alert("<h4>Sorry, Failed to update stock!</h4>", function () { });                    
                }
                callback();
            },
            error: function (xhr) {
                bootbox.alert("<h4>Error occured while updating stock!</h4>", function () { });
            }
        });
    }
        
}]);