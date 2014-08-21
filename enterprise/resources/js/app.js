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

	$.ajaxSumbit = function(options) {
		var form_id = options["formId"],
			url = options["url"],
			method = options["method"],
			data = options["data"],
			callback = options["callback"];
		var $form, $submit_btn;

		if (!form_id && !url) {
			alert("must need formId or url parameter!")
			return false;
		}	
		if (form_id) {
			$form = $("#" + form_id)	
		}
		if ($form) {
			if (!url) {
				url = $form.attr("action")
			}

			if (!method) {
				method = $form.attr("method")
			}

			$submit_btn = $("button[type=submit] input[type=submit]", $form)

			data = $form.serialize() + (data ? "&" + data : "");
		}
		
		if (!url) {
			$.ajax({
				"type" : method ? method : "POST",
				"url" : url,
				"data" : data,
				"success" : (callback ? callback : function(){} ),
				"beforeSend" : function(){
					if ($submit_btn) {
						$submit_btn.attr("disabled", "disabled")
						$submit_btn.addClass("ui-loading")
						var old_text = $submit_btn.text()
						$submit_btn.attr("old_text", old_text)
						$submit_btn.text("提交ing")
					}
				},
				"complete" : function(){
					if ($submit_btn) {
						$submit_btn.removeAttr("disabled")
						$submit_btn.removeClass("ui-loading")
						var old_text = $submit_btn.attr("old_text")
						$submit_btn.text(old_text)
					}
				}
			})
		}
	}
	
	if (window.addEventListener) {
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
	}

	//for index page
	if (history && history.replaceState) {
		var title = document.title 
		var url = "/"
		var state = {
			"title" : title,
			"url" : url 
		}
		history.replaceState(state, title, url)
	}

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
        
		// do ajax post
		var $form = $("form", $button)
		if ($form.length > 0) {
			$.ajaxSumbit()
			return false;	
		} else {
			return true;
		}
    })
})
