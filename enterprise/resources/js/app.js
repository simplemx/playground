$(function(){
    $.ajaxGet = function(url, containerSelector, success) {
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
        var link_tag = $("a", $(this)),
            href = link_tag.data("href");

        $.ajaxGet(href, "#ui-content") 
    }) 
})
