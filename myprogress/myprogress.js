(function(){

    var div_node = document.createElement("div"),
        body_node = document.getElementsByTagName("body")[0],
        startPosition = 0,
        currentPosition = startPosition,
        positionStep = 5,
        endPosition = 100,
        intervalFunc,
        progressOpts = {
            autoProgress : true,
            color : "blue"
        };


    body_node.appendChild(div_node)

    var startProgress = function() {
        currentPosition = startPosition
        div_node.setAttribute("class", "ui-top-progress")
        
        div_node.setAttribute("style" , "display : block;position: absolute;top : 0;left : 0;height : 5px;background: " + progressOpts.color + ";box-shadow:0 0 4px 4px " + progressOpts.color + ";transition:width 1s;-moz-transition:width 1s; /* Firefox 4 */-webkit-transition:width 1s; /* Safari and Chrome */-o-transition:width 1s; /* Opera */-webkit-transition-timing-function :ease ;width:" + startPosition + "%;")

        intervalFunc = setInterval(goOnProgress, 1000)
    }

    var goOnProgress = function() {
        if (currentPosition < 95) {
            currentPosition += positionStep
            div_node.setAttribute("style" , "display : block;position: absolute;top : 0;left : 0;height : 5px;background: " + progressOpts.color + ";box-shadow:0 0 4px 4px " + progressOpts.color + ";transition:width 1s;-moz-transition:width 1s; /* Firefox 4 */-webkit-transition:width 1s; /* Safari and Chrome */-o-transition:width 1s; /* Opera */-webkit-transition-timing-function :ease ;width:" + currentPosition + "%;")
        }
    }

    var finishProgress = function(){
        clearInterval(intervalFunc)

        div_node.setAttribute("style", "display : block;position: absolute;top : 0;left : 0;height : 5px;background: " + progressOpts.color + ";box-shadow:0 0 4px 4px " + progressOpts.color + ";transition:width 1s;-moz-transition:width 1s; /* Firefox 4 */-webkit-transition:width 1.5s; /* Safari and Chrome */-o-transition:width 1s; /* Opera */-webkit-transition-timing-function :ease ;width:" + endPosition + "%;")
        
        if (div_node.addEventListener) {
            div_node.addEventListener( 'webkitTransitionEnd', function( event ) { 
                div_node.setAttribute("style", "display:none;")
            }, false )
        } else if (div_node.attachEvent) {
            // IE 9-
            setTimeout(function(){
                div_node.setAttribute("style", "display : none;")
            }, 1000)
            
        }
    }

    var configProgress = function(opts) {
        var isArgumentValid = function(opts, field) {
            if (opts && typeof(opts[field]) !== "undefined") {
                return true;
            }
            return false;
        }

        if (isArgumentValid(opts, "autoProgress")) {
            progressOpts.autoProgress = opts["autoProgress"]
        }
        if (isArgumentValid(opts, "color")) {
            progressOpts.color = opts["color"]
        }
    } 

    var stopProgress = function() {
        clearInterval(intervalFunc)
    }

    startProgress()

    var old_onload = window.onload
    
    window.onload = function(){
        if (progressOpts.autoProgress) {
            finishProgress()
        }

        old_onload && old_onload()
    }

    this.MyProgress = {
        start : startProgress,
        goOn : goOnProgress,
        finish : finishProgress,
        config : configProgress,
        stop : stopProgress
    }

})()