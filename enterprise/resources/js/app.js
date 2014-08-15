$(function(){
    $.ajaxGetHTML = function(url, containerSelector, success) {
        $(containerSelector).html("<div class='ui-loading'>正在努力加载中...</div>")
        $.get(url, "_ajax_mode=true", function(data){
            var append = true
            if (success) {
                append = success(data)
            }
            append && $(containerSelector).html(data)
        })
    }
	
	window.addEventListener('popstate', function(e){
		if (history.state){
			var state = e.state;
			$.ajaxGetHTML(state.url, "#ui-content")
			document.title = state.title
			onMenuStateChange(state.title)
		} else {
			// no state that means index page
			$.ajaxGetHTML("/", "#ui-content")
			document.title = "首页"
			onMenuStateChange("首页")
		}
	}, false);

	var onMenuStateChange = function(title){
		var menu = $("#ui-sider-menu")
		menu.children().removeClass("active")
		if (title !== "首页") {
			menu.children().each(function(index, elem){
				var $elem = $(elem),
					a_tag = $("a", $elem)
				if (a_tag.text().trim() === title) {
					$elem.addClass("active")
					return false
				}
			})
		}
	}

    $("#ui-sider-menu").on("click touchend", "li", function(){
        var $this = $(this),
            link_tag = $("a", $this),
            href = link_tag.data("href");
        
        $.ajaxGetHTML(href, "#ui-content") 

        //remove li active class
        $this.parent().children().removeClass("active")
        //active li
        $this.addClass("active")

		//history state
		var title = link_tag.text().trim()
		var state = {
			"title" : title,
			"url" : href
		}
		history.pushState(state, title, href)
		// title not set yet
		document.title = title

		return false;
    })

    $("#ui-content").on("click touchend", "form button[type=submit], form input[type=submit]", function(){
        var $button = $(this)

        $button.attr("disabled", "disabled")
        $button.addClass("ui-loading")
        var old_text = $button.text()
        $button.text("提交ing")
        
        return true;
    })
})
