$(function(){
    $.ajaxHTML = function(url, containerSelector, success) {
        $(containerSelector).html("<div class='ui-loading'>正在努力加载中...</div>")
        $.get(url, "_ajax_mode=true", function(data){
            var append = true
            if (success) {
                append = success(data)
            }
            append && $(containerSelector).html(data)
        })
    };    

    $("#ui-sider-menu").on("click touchend", "li", function(){
        var $this = $(this),
            link_tag = $("a", $this),
            href = link_tag.data("href");
        $.ajaxHTML(href, "#ui-content") 

        //remove li active class
        $this.parent().children().removeClass("active")
        //active li
        $this.addClass("active")
    }) 
})
