define(["angular", "lodash", "multi-select", "dashboard", "jquery", "flot-pie", "flot-tooltip"], function(angular, _, multiselect, dashboard, $) {
    //@TODO 
    //1.pagination don't use aggregation don't refresh full charts

    var baseUrl = 'server url',
        app = angular.module('app', ["multi-select"]);

    app.controller("DashboardCtrl", function($scope, $http) {
        //dashboard
        $scope.dashboard = dashboard.current
        //alias for shot
        dashboard.current.condiction = _.cloneDeep(dashboard.current.defaultCondiction)
        dashboard.current.elasticSearchQueryParam = _.cloneDeep(dashboard.current.defaultElasticSearchQueryParam)
        $scope.condiction = dashboard.current.condiction
        $scope.modalDialog = dashboard.current.modalDialog

        //fo debug
        window.condiction = $scope.condiction
        window.dashboard = $scope.dashboard
        window.elasticSearchQueryParam = $scope.dashboard.elasticSearchQueryParam

        //form elements
        //group by condiction
        $scope.addGroupBy = function() {
            $scope.condiction.groupByParam.push({
                field : null,
                isNew : true
            })
        }
        $scope.removeGroupBy = function(index) {
            if (window.confirm("are u sure to remove " + index + " group by condiction?")){
                $scope.condiction.groupByParam.splice(index, 1)
            }
        }
        $scope.commitAddGroupBy = function(index) {
            if (_.isEmpty($scope.condiction.groupByParam[index]["field"])) {
                alert("field value is not allowed to null")
                return false;
            }
            if (_.filter($scope.condiction.groupByParam, function(groupBy, i) {
                if (groupBy["field"] === $scope.condiction.groupByParam[index]["field"] && i !== index){
                    return true;
                }
                return false;
            }).length > 0) {
                alert("already have a same field!")
            } else {
                $scope.condiction.groupByParam[index].isNew = false
            }
        }

        // page relative operations
        $scope.gotoNextPage = function() {
            dashboard.current.condiction.pageParam.current+=1;
            searchChart()
        }

        $scope.gotoPreviousPage = function(){
            if (dashboard.current.condiction.pageParam.current >= 1) {
                dashboard.current.condiction.pageParam.current-=1;
            }
            searchChart()
        }

        //construct filter query param
        var consturctFilter = function(aggs, condiction) {
            //right now just ignore filter param only filter timerange
            aggs["query"] = {
                "filtered": {
                    "query": {
                        "match_all": {}
                    }
                }
            }
            // {
            //     "filtered": {
            //         "query": {
            //             "query_string": {
            //                 "query": "eventType:(\"http request took too long\")"
            //             }
            //         }
            //     }
            // }

            

            if (condiction.timeRangeParam !== "disabled" && condiction.timeRangeField) {
                var filtered = aggs["query"]["filtered"]
                filtered["filter"] = {
                    "range": {}
                }
                filtered["filter"]["range"][condiction.timeRangeField] = {}
                filtered["filter"]["range"][condiction.timeRangeField]["gte"] = "now" + condiction.timeRangeParam
            }

            return aggs;
        }

        //construct aggregation query param
        var constructAggregation = function(aggs, condiction) {
            var currentAggs;

            currentAggs = aggs

            //first construct group by
            if (condiction.groupByParam && !_.isEmpty(condiction.groupByParam)) {
                _.forEach(condiction.groupByParam, function(groupBy){
                    if (!groupBy.isNew) {
                        currentAggs["aggs"] = {}
                        currentAggs["aggs"][groupBy["field"]] = {
                            "terms" : {
                                "field" : groupBy["field"]
                            }
                        }
                        currentAggs = currentAggs["aggs"][groupBy["field"]]
                    }
                })
            }
            //then construct timerange
            if (condiction.isTimeRangeGroupBy && condiction.timeRangeParam !== "disabled" && condiction.timeRangeField) {
                currentAggs["aggs"] = {}
                currentAggs["aggs"]["timerange"] = {
                    "date_histogram" : {
                        "field" : condiction.timeRangeField,
                        "interval": constructInterval(condiction.timeRangeParam)
                    
                    }
                }
                currentAggs = currentAggs["aggs"]["timerange"]
            }
            //last construct metric
            if (condiction.metricTypeParam !== "disabled" && condiction.metricTypeField) {
                currentAggs["aggs"] = {}
                currentAggs["aggs"][condiction.metricTypeField] = {}
                currentAggs["aggs"][condiction.metricTypeField][condiction.metricTypeParam] = {
                    "field" : condiction.metricTypeField
                }
            }
            return aggs;
        }

        var buildQueryParam = function(condiction) {
            
            //console.log("current condiction:\n" + JSON.stringify(condiction, null, 4))
            var resultAggs;
            if (_.isEqual(condiction, dashboard.current.defaultCondiction)) {
                // empty 
                resultAggs = dashboard.current.defaultElasticSearchQueryParam
            } else {
                // build from current query condiction
                //ignore filter just construct aggregation due to the filter field is used in url
                resultAggs = {}
                consturctFilter(resultAggs, condiction)
                constructAggregation(resultAggs, condiction)

            }
            
            //console.log("\nbuild QueryParam:\n" + JSON.stringify(resultAggs, null, 4))

            return resultAggs;
        }
        var timeRange2IntervalMap = {
            "-30m" : "2m",
            "-1h" : "4m",
            "-2h" : "8m",
            "-6h" : "24m",
            "-12h" : "48m",
            "-1d" : "96m"
        } 
        var constructInterval = function(timerange) {
            return timeRange2IntervalMap[timerange];
        }

        // check search query
        var validateInput = function() {
            // var groupBySize = _.size(dashboard.current.condiction.groupByParam),
            //     isTimeRangeGroupBy = dashboard.current.condiction.isTimeRangeGroupBy;
            // if (groupBySize > 2 && !isTimeRangeGroupBy || isTimeRangeGroupBy && groupBySize > 1) {
            //     alert("Group By 条件之和不能超过2")
            //     return false;

            // }
            return true;
        }

        var constructIndexName = function(){
            var needYesterday = false;
            
            // check whether need yesterday
            var d = new Date

            var hour = d.getHours(),
                minute = d.getMinutes(),
                timeRangeType = condiction.timeRangeParam.substring(condiction.timeRangeParam.length -1 , condiction.timeRangeParam.length),
                timeRangeValue = -condiction.timeRangeParam.substring(0, condiction.timeRangeParam.length -1);
            if (timeRangeType === "m" && hour < 1) {
                if (timeRangeValue > minute) {
                    needYesterday = true
                }
            } else if (timeRangeType === "h") {
                if (timeRangeValue> hour) {
                    needYesterday = true
                }
            } else if (timeRangeType === "d") {
                needYesterday = true
            }

            var indexBase = "logstash-mapi-log4j-";
            
            var today = indexBase + d.getUTCFullYear() + "." + (d.getUTCMonth() + 1) + "." + d.getUTCDate();
            if (needYesterday) {
                d.setDate(d.getDate() - 1)
            
                return today + "," + indexBase + d.getUTCFullYear() + "." + (d.getUTCMonth() + 1) + "." + d.getUTCDate();
            } else {
                return today;
            }
            
        }

        var constructPageParam = function(condiction) {
            // default page size is 10 and return first page
            if (condiction.pageParam.current > 0) {
                return "&size=" + condiction.pageParam.pageSize + "&from=" + condiction.pageParam.current * condiction.pageParam.pageSize;
            }
            return "";
        }

        var constructQueryUrl = function(condiction) {
            
            //'logstash-mapi-log4j-2014.10.27/_search?pretty'
            var indexName = constructIndexName()

            return baseUrl + indexName + "/_search?pretty" + constructPageParam(condiction);
        }

        //detect condiction change and construct queryparam
        $scope.$watch("condiction", function() {
            dashboard.current.elasticSearchQueryParam = buildQueryParam($scope.condiction)
        }, true)

        $scope.search = function(){

            
            // reset page param
            dashboard.current.condiction.pageParam = {
                previousShow : false,
                nextShow : false,
                current : 0,
                pageSize : 10
            }
            
            searchChart()
        }

        $scope.resetQueryParam = function() {
            dashboard.current.condiction = _.cloneDeep(dashboard.current.defaultCondiction)
            $scope.condiction = dashboard.current.condiction
        }

        $scope.saveQueryParam = function() {
            var currentCondiction = _.cloneDeep(dashboard.current.condiction)

            // check whether exists
            $http.post(baseUrl + "kibana-int/condiction/_search", {
                "query" : {
                    "match": {
                       "name": currentCondiction["name"]
                    }
                }
            }).
            success(function(data){
                if (data["hits"]["total"] > 0){
                    //exists
                    if (window.confirm("您保存的查询条件已存在，是否覆盖保存？")) {
                        $http.post(baseUrl + "kibana-int/condiction/" + data["hits"]["hits"][0]["_id"], currentCondiction).
                        success(function(data, status, headers, config) {
                            
                            window.result = data;
                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log(data)
                            //alert("init line chart error")
                        })
                    }

                } else {
                    // save and refresh left tree
                    $http.post(baseUrl + "kibana-int/condiction/", currentCondiction).
                    success(function(data, status, headers, config) {
                        
                        window.result = data;
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data)
                        //alert("init line chart error")
                    })
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data)
                //alert("init line chart error")
            })

            
        }

        var getBucketKey = function(bucket) {
            return bucket["key_as_string"] ? bucket["key_as_string"] : bucket["key"];
        }

        var getBuckets = function(aggs, key) {
            if (aggs[key] && aggs[key]["buckets"]) {
                return aggs[key]["buckets"];
            }
            return [];
        }

        var constructBucketKey = function(keyArray) {
            return _(keyArray).join(",");
        }

        var getStatusFromType = function(buckets) {
            var min, 
                max,
                sum = 0,
                field = (condiction.metricTypeField ? condiction.metricTypeField : "doc_count");
            
            _.forEach(buckets, function(bucket){
                if (!min || min > bucket[field]) {
                    min = bucket[field]
                }
                if (!max || max < bucket[field]) {
                    max = bucket[field]
                }
                sum+=bucket[field]
            })

            return {
                "avg" : sum/buckets.length,
                "min" : min,
                "max" : max
            };
        }

        var constructBucketData = function(bucketData, aggs, restKeyArray, currentKeyArray) {


            var key = _.first(restKeyArray),
                childResetKeyArray = _.rest(restKeyArray),
                currentChildKeyArray;

            var buckets = getBuckets(aggs, key);
            
            if (_.isEmpty(childResetKeyArray)) {
                // the last level
                bucketData.push({
                    "key" : constructBucketKey(currentKeyArray),
                    "buckets" : buckets,
                    "doc_count" : aggs["doc_count"]
                })

            } else {
                _.forEach(buckets, function(bucket){
                    var bucketKey = getBucketKey(bucket),
                        currentChildKeyArray = _.cloneDeep(currentKeyArray);
                    
                    currentChildKeyArray.push(bucketKey)
                    
                    // has next level
                    constructBucketData(bucketData, bucket, childResetKeyArray, currentChildKeyArray)
                    
                })
            }
        }

        var getDataValue = function(data) {
            if (condiction.metricTypeField && condiction.metricTypeParam && data[condiction.metricTypeField]) {
                var type = data[condiction.metricTypeField]
                return type["value"];
            } else {
                return data["doc_count"];
            }
        }

        var constructLineChartData = function(buckets) {
            return _.map(buckets, function(data, index){
                return [
                    index,
                    getDataValue(data)
                ]
            });
        }

        var formatXaxisLabel = function(label) {
            //"2014-10-22T01:00:00.000Z"
            if (!isNaN(Date.parse(label))) {
                return label.substring(5,10) + " " + label.substring(11, 16);
            }
            return label;
        }

        // return [linechart data, x axis ticks array, piechart data]
        var constructChartData = function(data, condiction) {
            var groupByArray = condiction.groupByParam,
                currentKeyArray = [],
                bucketData = [],
                aggs = data["aggregations"],
                pieChartData = [],
                lineChartData = [],
                xaxisData;
            
            var restKeyArray = _.map(groupByArray, function(groupBy){
                return groupBy["field"];
            });

            if (condiction.isTimeRangeGroupBy) {
                restKeyArray.push("timerange")
            }

            constructBucketData(bucketData, aggs, restKeyArray, currentKeyArray)

            if (_.size(bucketData) === 1) {
                var stat = getStatusFromType(bucketData[0]["buckets"])
                lineChartData.push({
                    label : "sum",
                    data : constructLineChartData(bucketData[0]["buckets"]),
                    "min" : stat["min"],
                    "max" : stat["max"],
                    "avg" : stat["avg"],
                    "sum" : data["hits"]["total"]
                })
                pieChartData.push({
                    label : "sum",
                    data : data["hits"]["total"]
                })
            }  else {
                _.forEach(bucketData, function(bucket){
                    var stat = getStatusFromType(bucket["buckets"])
                    pieChartData.push({
                        label : bucket["key"],
                        data : bucket["doc_count"]
                    })

                    lineChartData.push({
                        label : bucket["key"],
                        data : constructLineChartData(bucket["buckets"]),
                        "min" : stat["min"],
                        "max" : stat["max"],
                        "avg" : stat["avg"],
                        "sum" : bucket["doc_count"]
                    })

                })
            }

            //get xaxis data
            xaxisData = _.map(bucketData[0]["buckets"], function(bucket, index){
                return [
                    index,
                    formatXaxisLabel(getBucketKey(bucket))
                ];
            })

            return [lineChartData, xaxisData, pieChartData];
        }

        // var filterLineChartData = function(currentLabel, datas) {
        //     var checkeds = $("#ui-line-chart-legend-placeholder input[type=checkbox][checked=checked]");

        //     var checkedValues = _.map(checkeds, function(check){
        //         return $(check).attr("name");
        //     })

        //     if (_.contains(checkedValues, currentLabel)) {
        //         // click to uncheck
        //         checkedValues = _.remove(checkedValues, function(checkValue){
        //             return checkValue === currentLabel;
        //         })

        //     } else {
        //         checkedValues.push(currentLabel)
        //     }

        //     return _.filter(datas, function(data){
        //         if (_.contains(checkedValues, data.label)) {
        //             return true;
        //         }
        //         return false;
        //     })
            
        // }

        var filterChartData = function(datas, lineChartPlotData) {
            return _.filter(datas, function(data){
                var label = data.label;
                var plot = _.find(lineChartPlotData, function(plot){
                    if (plot.label === label){
                        return plot;
                    }
                })

                return plot.checked;
            });
        }


        // search
        var searchChart = function() {
            if (!validateInput()) return;

            MyProgress.start()

            //console.log($scope.elasticSearchQueryParam)
            var currentQueryParam = _.cloneDeep(dashboard.current.elasticSearchQueryParam)
            var currentCondiction = _.cloneDeep(dashboard.current.condiction)
            
            $http.post(constructQueryUrl(currentCondiction), currentQueryParam).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available

                //for debug
                window.data = data;

                var chartDatas = constructChartData(data, currentCondiction),
                    options = {
                        xaxis: {
                            ticks : chartDatas[1]
                        },
                        grid: {
                            hoverable: true
                        },
                        tooltip: true,
                        tooltipOpts: {
                          content: function(label, xval, yval, flotItem){
                            var x = flotItem.datapoint[0],
                                y = flotItem.datapoint[1];
                            x = flotItem.series.xaxis.ticks[x].label

                            return flotItem.series.label + " of " + x + " = " + y;
                          }, // show percentages, rounding to 2 decimal places
                          shifts: {
                              x: 20,
                              y: 0
                          },
                          defaultTheme: false
                        },
                        legend: { 
                            show: false,
                            // labelFormatter: function(label, series) {
                            //     // series is the series object for the label
                            //     return "&nbsp;&nbsp;" + label + "&nbsp;&nbsp;<input type=\"checkbox\" name=\"" + label + "\" checked=\"checked\">";
                            // },
                            // container: $('#ui-line-chart-legend-placeholder')
                        }

                    },
                    pieOptions = {
                        series: {
                            pie: {
                                show: true
                            }
                        },
                        legend: { 
                            show: true, 
                            container: $('#ui-pie-chart-legend-placeholder')
                        },
                        grid: {
                            hoverable: true
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content : function(label, xval, yval, flotItem) {
                                return flotItem.datapoint[1][0][1] + ", " + label;
                            },
                            shifts: {
                                x: 20,
                                y: 0
                            },
                            defaultTheme: false
                        }
                    };

                if (currentCondiction.chartShowType === "line") {
                    options["series"] = {
                        lines: { show: true },
                        points: { show: true }
                    }
                } else {
                    options["series"] = {
                        bars: {
                            show: true,
                            barWidth: 0.8,
                            align: "center"
                        }
                    }
                }

                var lineChartPlot = $.plot($("#ui-line-chart-placeholder"), chartDatas[0], options)

                $.plot($("#ui-pie-chart-placeholder"), chartDatas[2], pieOptions)

                $scope.logs = data["hits"]["hits"]

                //page status operation
                if (condiction.pageParam.current > 0) {
                    condiction.pageParam.previousShow = true
                } else {
                    condiction.pageParam.previousShow = false
                }
                var count = data["hits"]["total"]
                if ((condiction.pageParam.current + 1) * condiction.pageParam.pageSize > count) {
                    condiction.pageParam.nextShow = false
                } else {
                    condiction.pageParam.nextShow = true
                }

                $scope.lineChartData = chartDatas[0]
                
                var datas = lineChartPlot.getData()
                _.forEach(datas, function(data){
                    data["checked"] = true
                })
                $scope.lineChartPlotData = datas

                window.lineChartPlotData = datas

                $scope.$watch("lineChartPlotData", function() {
                    $scope.lineChartData = filterChartData(chartDatas[0], lineChartPlotData)

                    // change pie chart
                    $.plot($("#ui-pie-chart-placeholder"), filterChartData(chartDatas[2], lineChartPlotData), pieOptions)
                    
                    // change line chart
                    var plot = $.plot($("#ui-line-chart-placeholder"), $scope.lineChartData, options)
                    
                    // change label color
                    _.forEach(datas, function(data){
                        // 
                        var found = _.find(plot.getData(), function(plotItem){
                            if (plotItem.label === data.label) {
                                return true;
                            }
                        })

                        if (found) {
                            data.color = found.color
                        } else {
                            data.color = "#000"
                        }
                    })
                }, true)

                MyProgress.finish()
            }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
                console.log(data)
                //alert("init line chart error")
            })


        }


        var initMenus = function() {

            $http.post(baseUrl + "kibana-int/dashboard/_search?pretty").
            success(function(data, status, headers, config) {
                var dashboards = data["hits"]["hits"]
                dashboards = _.map(dashboards, function(dashboard){
                    return JSON.parse(dashboard["_source"]["dashboard"])
                })

                // construct sub menus
                $http.post(baseUrl + "kibana-int/condiction/_search?pretty").
                success(function(data, status, headers, config) {
                    
                    var condictions = data["hits"]["hits"]

                    _.forEach(condictions, function(condiction){
                        condiction = condiction["_source"]
                        var found = _.find(dashboards, function(dashboard){
                            return dashboard["title"] === condiction["dashboard"];
                        })

                        if (found) {
                            if (!found.condictions) {
                                found["condictions"] = []
                            }
                            found["condictions"].push(condiction)
                        }
                    })

                    $scope.dashboards = dashboards
                    window.dashboards = dashboards
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(data)
                    //alert("init line chart error")
                })

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data)
                //alert("init line chart error")
            })
        }

        searchChart()

        //init menus
        initMenus()

    })

    app.init = function() {
        angular.bootstrap(document, ['app'])
    }

    return app;
})