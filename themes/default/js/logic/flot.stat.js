$(function () {
<<<<<<< HEAD

    var url = window.location.pathname;

    //Break the url into components
    var comps = url.split('/');

    var type = comps[comps.length - 2];
    var operation = comps[comps.length - 3];

    $(document).ready(function () {
        $.ajax({
            url: '/publisher/api/assets/' + operation + '/' + type + '/',
            type: 'GET',
            success: function (response) {
                var parsedResponse = JSON.parse(response);
                $.plot("#placeholder", [parsedResponse.stats], {
                    series: {
                        lines: { show: true },
                        points: { show: true }
                    },
                    xaxis: {
                        show: true,
                        ticks: parsedResponse.ticks

                    },
                    yaxis: {
                        show: true,
                        tickDecimals: 0

                    },
                    grid: {
                        backgroundColor: { colors: [ "#fff", "#eee" ] },
                        borderWidth: {
                            top: 1,
                            right: 1,
                            bottom: 2,
                            left: 2
                        }
                    }
                });

            },
            error: function (response) {
                alert('Error occured at statistics graph rendering');
            }
        });
    });


});
=======
    var url = window.location.pathname;

    var comps = url.split('/');
    var type = comps[comps.length - 2];
    var operation = comps[comps.length - 3];

    var dateRange = $('#date-range-field span').text();
    var from = dateRange.split('to')[0];
    var to = dateRange.split('to')[1];

    $.ajax({
        url: '/publisher/api/assets/' + operation + '/' + type + '/',
        type: 'POST',
        data: {
            'startDate': from,
            'endDate': to // <-- the $ sign in the parameter name seems unusual, I would avoid it
        },
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            $.plot("#placeholder1", [parsedResponse.bookmarkStats], {
                series: {
                    lines: { show: true },
                    points: { show: true }
                },
                xaxis: {
                    show: true,
                    ticks: parsedResponse.bookmarkTicks

                },
                yaxis: {
                    show: true,
                    tickDecimals: 0

                },
                grid: {
                    backgroundColor: { colors: [ "#fff", "#eee" ] },
                    borderWidth: {
                        top: 1,
                        right: 1,
                        bottom: 2,
                        left: 2
                    }
                }
            });

            $.plot("#placeholder2", [parsedResponse.hotAssetStats], {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    }

                },
                xaxis: {
                    show: true,
                    ticks: parsedResponse.hotAssetTicks
                },
                yaxis: {
                    show: true,
                    tickDecimals: 0

                },
                grid: {
                    backgroundColor: { colors: [ "#fff", "#eee" ] },
                    borderWidth: {
                        top: 1,
                        right: 1,
                        bottom: 2,
                        left: 2
                    }
                }
            });
        },
        error: function (response) {
            alert('Error occured at statistics graph rendering');
        }
    });
});


var convertDate = function (date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' +
        (('' + month).length < 2 ? '0' : '') + month + '-' +
        (('' + day).length < 2 ? '0' : '') + day;
}


var onDateSelected = function (from, to) {
    var url = window.location.pathname;
    var comps = url.split('/');

    var type = comps[comps.length - 2];
    var operation = comps[comps.length - 3];
    $.ajax({
        url: '/publisher/api/assets/' + operation + '/' + type + '/',
        type: 'POST',
        data: {
            'startDate': from,
            'endDate': to,
            'isOnChoice': true
        },
        success: function (response) {
            var parsedResponse = JSON.parse(response);
            $.plot("#placeholder2", [parsedResponse.hotAssetStats], {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: "center"
                    }
                },
                xaxis: {
                    show: true,
                    ticks: parsedResponse.hotAssetTicks

                },
                yaxis: {
                    show: true,
                    tickDecimals: 0

                },
                grid: {
                    backgroundColor: { colors: [ "#fff", "#eee" ] },
                    borderWidth: {
                        top: 1,
                        right: 1,
                        bottom: 2,
                        left: 2
                    }
                }
            });


        },
        error: function (response) {
            alert('Error occured at statistics graph rendering');
        }
    });
}
>>>>>>> 7b77151d0d114757b90fecebbf53248c201f780b


