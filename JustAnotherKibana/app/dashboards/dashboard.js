define(["class"], function(Class) {
    var DefaultDashBoard = Class.extend({
        "title": "Welcome Page",
        "style": "dark",
        "rows": [
            {}
        ],
        "modalDialog": {
            "isQueryParamShow": false,
            "isSaveParamShow" : false
        },
        "defaultCondiction": {
            "name": "默认查询",
            "dashboard": "Introduction",
            "isShow": true,
            "filterParam": null,
            "groupByParam": [
                {
                    "field": "logLevel",
                    "isNew": false
                }
            ],
            "timeRangeParam": "-6h",
            "timeRangeField": "datefield",
            "metricTypeParam": "disabled",
            "isTimeRangeGroupBy": true,
            "chartShowType": "line",
            "pageParam": {
                "previousShow": false,
                "nextShow": false,
                "current": 0,
                "pageSize": 10
            }
        },
        "condiction": {},
        "elasticSearchQueryParam": {},
        "defaultElasticSearchQueryParam": {
            "query": {
                "filtered": {
                    "query": {
                        "match_all": {}
                    },
                    "filter": {
                        "range": {
                            "datefield": {
                                "gte": "now-6h"
                            }
                        }
                    }
                }
            },
            "aggs": {
                "logLevel": {
                    "terms": {
                        "field": "logLevel"
                    },
                    "aggs": {
                        "timerange": {
                            "date_histogram": {
                                "field": "datefield",
                                "interval": "24m"
                            }
                        }
                    }
                }
            }
        },
        "menus": [
            {
                "id": 1,
                "name": "menu1",
                "url": "#",
                "children": [
                    {
                        "id": 11,
                        "name": "sub1",
                        "url": "#"
                    },
                    {
                        "id": 12,
                        "name": "sub2",
                        "url": "#"
                    }
                ]
            },
            {
                "id": 2,
                "name": "menu2",
                "url": "#"
            },
            {
                "id": 3,
                "name": "menu3",
                "url": "#",
                "children": [
                    {
                        "id": 11,
                        "name": "sub3",
                        "url": "#"
                    },
                    {
                        "id": 12,
                        "name": "sub4",
                        "url": "#"
                    }
                ]
            }
        ]
    });

    var dashboards = [new DefaultDashBoard];

    return {
        "current": dashboards[0]
    };
})