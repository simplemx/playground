$(function(){
	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return $.trim(this)
			//this.replace(/^\s+|\s+$/g, ''); 
		}
	}
	
	$.showMask = function() {
		var backgrounds = $(".ui-popup-background"),
			body = document.body,
    		html = document.documentElement;

		var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight,
                       $(window).height());
		
		if (backgrounds.length > 0) {
			backgrounds.css("height", height + "px")
			backgrounds.show()
					
		} else {
			
			$("<div>")
			.attr("class", "ui-popup-background")
			.css("height", height + "px")
			.appendTo(document.body)
			
		}
	}
	$.hidePopup = function(selector){
		$(".ui-popup-background").hide()
		var $popup =  $(selector)
		$(".fn-hide", $popup).hide()
		$popup.hide()
	}
	$.showPopup = function() {
		var popup_selector,
			popup_text,
			need_mask = true,
			need_confirm = false,
			confirm_callback,
			confirm_fn,
			$submit_btn,
			$popup;
		if (typeof arguments[0] !== "object") {
			popup_selector = arguments[0]
			popup_text = arguments[1]
			need_confirm = arguments[2]
			confirm_callback = arguments[3]
		} else {
			popup_selector = arguments["popup_selector"]
			popup_text = arguments["popup_text"]
			if (!arguments["need_mask"]) {
				need_mask = false
			}
			if (arguments["need_confirm"]) {
				need_confirm = true
			}
			if (arguments["confirm_callback"]) {
				confirm_callback = arguments["confirm_callback"]
			}
		}
		
		if (need_mask) {
			$.showMask()
		}

		$popup = $(popup_selector)
		if (popup_text) {
			$(".ui-tipbox-title", $popup).text(popup_text)
		}
		if (need_confirm) {
			$submit_btn = $(".fn-hide", $popup)
			confirm_fn = function(){
				$.hidePopup(popup_selector)
				if (confirm_callback) {
					return confirm_callback()
				} else {
					return true;
				}
			}
			$submit_btn.unbind("click").bind("click", confirm_fn)
			$submit_btn.show()
		}
		$popup.show()

	}

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

	$.ajaxSumbitHTML = function(options) {
		options["dataType"] = "html"
		if (!options["zoneId"]) {
			options["zoneId"] = "ui-content"
		}
		$.ajaxSumbit(options)
	}

	$.ajaxSumbit = function(options) {
		var form_id = options["formId"],
			url = options["url"],
			method = options["method"],
			data = options["data"],
			form = options["form"],
			$submit_btn = options["submit_btn"],
			callback = options["callback"],
			dataType = options["dataType"] ?  options["dataType"] : "json",
			zoneId = options["zoneId"];
		var $form;

		if (!form_id && !url && !form) {
			alert("must need formId or url or form parameter!")
			return false;
		}	
		if (form_id && !form) {
			$form = $("#" + form_id)	
		}
		if (form) {
			$form = form
		}
		if ($form) {
			if (!url) {
				url = $form.attr("action")
			}

			if (!method) {
				method = $form.attr("method")
			}

			if (!$submit_btn) {
				$submit_btn = $("button[type=submit],input[type=submit]", $form)
			}
			data = $form.serialize() + (data ? "&" + data : "") + "&_ajax_mode=true";
		}
		
		if (url) {
			$.ajax({
				"type" : method ? method : "POST",
				"url" : url,
				"data" : data,
				"dataType" : dataType,
				"success" : function(result){
					if (zoneId) {
						$("#" + zoneId).html(result);
					}
					(callback ? callback : function(){} )(result)
				},
				"beforeSend" : function(){
					if ($submit_btn) {
						$submit_btn.attr("data-clicked", "clicked")
						$submit_btn.addClass("ui-loading")
						var old_text = $submit_btn.text()
						$submit_btn.attr("old_text", old_text)
						$submit_btn.text("提交ing")
					}
				},
				"complete" : function(){
					if ($submit_btn) {
						$submit_btn.removeAttr("data-clicked")
						$submit_btn.removeClass("ui-loading")
						var old_text = $submit_btn.attr("old_text")
						$submit_btn.text(old_text)
					}
				}
			})
		}
	}
	
	if (window.addEventListener && Modernizr.history) {
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

		var title = document.title 
		var url = window.location.pathname 
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

		if (Modernizr.history) {
			//history state
			var title = link_tag.text().trim()
			var state = {
				"title" : title,
				"url" : href
			}
			history.pushState(state, title, href)
			// title not set yet
			document.title = title
		}

		return false;
    })

    $("#ui-content").on("click touchend", "form button[type=submit], form input[type=submit]", function(){
        var $button = $(this)

		// clicked
		if ($button.attr("data-clicked") === "clicked") {
			return false;
		}

		
		var submit_form = function(){
			// do ajax post
			var $form = $button.parent("form")
			if ($form.length > 0) {
				$.ajaxSumbitHTML({
					"form" : $form,
					"submit_btn" : $button	
				})
				return false;	
			} else {
				return true;
			}
		}

		// confirm msg dialog
		if ($button.data("need-confirm")) {
			$.showPopup("#popup", "请问是否提交呢?", true, submit_form)		
			return false;
		}
		
		return submit_form()
		
    })
})
