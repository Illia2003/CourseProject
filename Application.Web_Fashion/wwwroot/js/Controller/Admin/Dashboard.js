function populateDashboardOrderList(callback) {

    $('.item-loading').show();
    $.ajax({
        dataType: "json",
        url: '/Order/GetOnlineOrdersForDashboard',
        data: { },
        success: function (recordSet) {
            $('.item-loading').hide();
            var dataSet = [];
            if (recordSet.length > 0) {
                for (var i = 0; i < recordSet.length; i++) {
                    var record = [];
                    record.push(recordSet[i].Id);
                    record.push(recordSet[i].OrderCode);
                    record.push(siteCurrency() + recordSet[i].PayAmount);
                    record.push(recordSet[i].OrderMode);
                    record.push(recordSet[i].OrderStatus);
                    record.push(recordSet[i].PaymentStatus);
                    record.push(recordSet[i].PaymentType);
                    record.push(recordSet[i].ActionDateString);

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

function GetOrderStatus(callback) {
    $.ajax({
        dataType: "json",
        url: '/Admin/GetOrderStatus',
        success: function (recordSet) {
            callback(recordSet);
        },
        error: function (xhr) {
        }
    });
}

function GetTotalItemValues(callback) {
    $.ajax({
        dataType: "json",
        url: '/Admin/GetTotalItemValues',
        success: function (recordSet) {
            callback(recordSet);
        },
        error: function (xhr) {
        }
    });
}

$(document).ready(function () {

    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    
});


app.factory('dashboardService', [
    '$http', function ($http) {

        return {            

        };
    }
]);

app.controller('AdminDashboardCtrl', ['$rootScope', '$scope', '$http', '$filter', '$location', 'Enum', 'dashboardService', function ($rootScope, $scope, $http, $filter, $location, Enum, dashboardService) {

    GetOrderStatus(function (data) {
        if (data) {
            $('#storeSellCount').html(data[0].StoreSell);
            $('#onlineSellCount').html(data[0].OnlineSell);
            $('#phoneOrderCount').html(data[0].PhoneOrderSell);
            $('#pendingOrderCount').html(data[0].PhoneOrderSell);
        }
    });

    GetTotalItemValues(function (data) {
        if (data) {
            $('#totalItemPosted').html(data[0].TotalItemPosted);
            $('#totalItemValue').html(data[0].TotalItemValue);            
        }
    });

    populateDashboardOrderList(function (records) {
        $('#admin-dashboard-orderlist').dataTable({
            "data": records,
            "bLengthChange": false,
            "bFilter": true,
            "pageLength": 50,
            "bDestroy": true,
            "responsive": true,
            "order": [[1, "desc"]],
            "columns": [
                { "title": "Order Id", "class": "center" },
                { "title": "Order No", "class": "center" },
                { "title": "Grand Total", "class": "right" },
                { "title": "Order Mode", "class": "center" },
                { "title": "Order Status", "class": "center" },
                { "title": "Payment Status", "class": "center" },
                { "title": "Payment Type", "class": "center" },
                { "title": "Order Date" },
                { "title": "Action", "class": "center" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0, 3, 8],
                    "visible": false
                },
                {
                    "aTargets": [1],
                    "mRender": function (data, type, row) {
                        var text = '<a href=/Order/OrderDetails?orderId=' + row[0] + '>' + row[1] + '</a>';
                        return $("<div/>").append(text).html();
                    }
                },
                {
                    "aTargets": [4],
                    "mRender": function (data, type, row) {

                        var status = row[4];
                        var className = 'order-status-processing';

                        if (status === 'Completed') {
                            className = 'order-status-completed';
                        }
                        else if (status === 'Processing') {
                            className = 'order-status-processing';
                        }

                        var text = '<span class="'+ className +'">' + status + '</span>';
                        return $("<div/>").append(text).html();
                    }
                },                
                {
                    "aTargets": [8],
                    "mRender": function (data, type, row) {
                        var text = '<a id=' + row[0] + ' class="btn btn-success btn-order-complete">Complete</a>';
                        return $("<div/>").append(text).html();
                    }
                }
            ]
        });        

    });

    $('.order-mode').click(function () {
        var orderStatus = getParam('orderStatus');
        var orderMode = $(this).attr('id');
        window.location.href = "/Order/OrderList?orderStatus=" + orderStatus + "&orderMode=" + orderMode;

    });


}]);