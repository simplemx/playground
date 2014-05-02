urls = ["http://www.amazon.cn/gp/product/B00G325USG/ref=s9_simh_gw_p23_d1_i3?pf_rd_m=A1AJ19PSB66TGU&pf_rd_s=center-5&pf_rd_r=1DBVQ90WVXA84JPZDHRD&pf_rd_t=101&pf_rd_p=108773192&pf_rd_i=899254051",
"http://www.amazon.cn/SONY-%E7%B4%A2%E5%B0%BCKDL-60R520A-60%E8%8B%B1%E5%AF%B8%E5%85%A8%E9%AB%98%E6%B8%85LED%E6%99%BA%E8%83%BD%E7%94%B5%E8%A7%86/dp/B00E5W5PFO/ref=sr_1_9?s=audio-video&ie=UTF8&qid=1398765964&sr=1-9",
"http://www.amazon.cn/SONY-%E7%B4%A2%E5%B0%BCKDL-50W650A-50%E8%8B%B1%E5%AF%B8LED%E7%94%B5%E8%A7%86/dp/B00G325USG/ref=sr_1_12?s=audio-video&ie=UTF8&qid=1398765964&sr=1-12",
"http://www.amazon.cn/Sony-%E7%B4%A2%E5%B0%BCKDL-55W806A-55%E8%8B%B1%E5%AF%B8%E5%85%A8%E9%AB%98%E6%B8%85%E5%81%8F%E6%8C%AF%E5%BC%8F3D-LED%E7%94%B5%E8%A7%86/dp/B00C94GT1O/ref=sr_1_16?s=audio-video&ie=UTF8&qid=1398765964&sr=1-16",
"http://www.amazon.cn/Sony-%E7%B4%A2%E5%B0%BC-KDL-55W800B-55%E8%8B%B1%E5%AF%B8%E5%85%A8%E9%AB%98%E6%B8%85LED%E6%B6%B2%E6%99%B6%E7%94%B5%E8%A7%86/dp/B00JJJIDIY/ref=sr_1_19?s=audio-video&ie=UTF8&qid=1398765964&sr=1-19",
"http://www.amazon.cn/%E7%B4%A2%E5%B0%BC-KDL-50W800B-50%E8%8B%B1%E5%AF%B8-%E5%85%A8%E9%AB%98%E6%B8%85LED%E6%B6%B2%E6%99%B6%E7%94%B5%E8%A7%86/dp/B00IJNQ78E/ref=sr_1_31?s=audio-video&ie=UTF8&qid=1398766123&sr=1-31"
]


var parseHTML = function(url, content) {
    var page = $(content)
    window.test = content
    var price = page.find(".priceLarge").text()
    var title = page.find("#btAsinTitle span").text()
    var promotions = page.find("#quickPromoBucketContent").text()
    return [price, title, promotions]
    //return "<li><h2><a href='" + url + "' >" + title + "</a></h2><div id='price'>" + price + "</div><div>" + promotions + "</div></li>"
}

var getHTML = function(url, callback) {
    var req = new XMLHttpRequest()
    req.open("GET", url, true)
    req.setRequestHeader("Content-type", "text/html")
    req.onload = function(e){
        callback && callback(e.target.responseText)
    }
    req.send()
}

var formatPrice = function(price) {
    price = price.substring(2)
    price = price.replace(".", "")
    price = price.replace(",", "")
    return +price
}

var findChange = function(url, price) {
    price = formatPrice(price)
    var old_price = localStorage[url]
    if (old_price) {
        return price - (parseInt(old_price))
    } else {
        return "no localStorage"
    }
}

var processLocalStorage = function(url, price) {
    localStorage[url] = formatPrice(price)
}

var loadItem = function(index) {
    if (index >= urls.length) {
        $("#item_list a").click(function(){
            chrome.tabs.create({ url: $(this).attr("href") })
        })
        return
    }

    var url = urls[index]
    var callback = function(content){
        var elements = parseHTML(url, content)
        var detail_content = "<li><h2><a href='" + url + "' >" + elements[1] + "</a></h2><div class='price'>" + elements[0] + "</div><div>" + elements[2] + "</div></li>"
        
        $("#item_list").append(detail_content)
        
        var change_content = "<li><h2>" + elements[1] + "</h2><div class='price'>" + elements[0] + "</div><div class='change'>" + findChange(url, elements[0]) + "</div></li>"
        $("#detail_list").append(change_content)
        
        processLocalStorage(url, elements[0])

        loadItem(index + 1)
    }

    getHTML(url, callback)
}

$(function(){
    $("#tab_menu_list li").click(function(){
        $("#tab_menu_list li").each(function(){
            $(this).removeClass("current")
        })
        $(this).addClass("current")
        $("#content .tab").each(function(){
            $(this).removeClass("current_tab")
        })
        $("#" + $(this).attr("tab")).addClass("current_tab")
    })

    loadItem(0)    
}) 
