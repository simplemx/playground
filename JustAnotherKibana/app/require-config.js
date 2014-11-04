require.config({
    baseUrl : "./app",
    //配置angular的路径
    paths:{
        "angular" : "../vendor/angularjs/angular", 
        "angular-route" : "../vendor/angularjs/angular-route.min",
        "lodash" : "../vendor/lodash/lodash",
        "class" : "../vendor/class/class",
        "jquery" : "../vendor/jquery/jquery.min",
        "flot" : "../vendor/flot/jquery.flot",
        "flot-pie" : "../vendor/flot/jquery.flot.pie",
        "flot-tooltip" : "../vendor/flot/jquery.flot.tooltip",
        "multi-select" : "../vendor/angularjsmultiselect/angular-multi-select",
        //app js
        "dashboard" : "dashboards/dashboard"
    },
    //这个配置是你在引入依赖的时候的包名
    shim:{
        "angular" : {
            exports : "angular"
        },
        "angular-route" : {
            exports : "angular-route"
        },
        "jquery" : {
            exports : "jquery"
        },
        "flot" : {
            deps : ["jquery"],
            exports : "jquery"
        },
        "flot-pie" : {
            deps : ["flot"],
            exports : "jquery"
        },
        "flot-tooltip" : {
            deps : ["flot"],
            exports : "jquery"
        },
        "multi-select" : {
            deps : ["angular"],
            exports : "multi-select"
        }
    }
})

require(["app"], function(app) {
    app.init()
})