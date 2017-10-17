var _self;
function EstyJs() {
    this.routes = [];
    _self = this;  
    // $('a').click(this.onhashchange);
    var anchors = document.getElementsByTagName("a");
    for (var i = 0, length = anchors.length; i < length; i++) {
        var anchor = anchors[i];
        anchor.addEventListener('click', this.onhashchange, true);
    };
 //   $(window).on('hashchange', this.onhashchange);
    window.addEventListener("hashchange", this.onhashchange)
}
function getHashTag(hashtag)
{
    var re = /#([-0-9A-Za-z]+)(\:(.+))?/;
    var match = re.exec(hashtag);
    return match[1];
}

function getHashTag2(hashtag) {

    let tag = hashtag.replace(/^[a-z]{4}\:\/{2}[a-z]{1,}\:[0-9]{1,4}.(.*)/, '$1');
     tag = tag.replace('#', '');
     let index = tag.indexOf("?");
     if (index > 0)
     {
         tag = tag.substring(0, index);
     }
     return tag;
}
function getUrlParameter(url) {
    let paramArray = [];
    url = url.replace("?", "&");
    let sPageURL = url,
    sURLVariables = sPageURL.split('&');
    for (var i = 1; i < sURLVariables.length; i++) {
        var paramValue = sURLVariables[i].split('=');
        let obj = { "key":  paramValue[0], "value": paramValue[1] };
        paramArray.push(obj);
    }
    return paramArray;
}



EstyJs.prototype.initPage = function (hashtag)
{
   
    if (hashtag == null) {
        let url = window.location.pathname;
        if (url != "/") {       
            hashtag = getHashTag2(url.replace('/', '#'))
        }
        else {
            hashtag = _self.routes[0].displayUrl;
        }
    }
  
    var section =  document.getElementById('app').getElementsByTagName("section");
    for (var i = 0; i < section.length; i++) {
        section[i].style.display = 'none';
    }
    let isRouteFound = false;
    for (var i = 0; i < _self.routes.length; i++) {
        if (_self.routes[i].displayUrl == hashtag) {
            isRouteFound = true;
            document.title = _self.routes[i].pageTitle;
      
         let selector = document.getElementById(_self.routes[i].section.replace('#', ''));
         let flag = selector.getAttribute('content-loaded');

            if (flag == 'true') {
                selector.setAttribute('content-loaded', true);
                selector.style.display = '';
                return;
            }

            let pageUrl = window.location.origin + '/views/' + _self.routes[i].pageLocation;
           // let pageUrl = 'http://youmightnotneedjquery.com/';

            function ajaxCall2()
            {

              

                var request = new XMLHttpRequest();
                request.open('GET', pageUrl, true);
                request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {   
                        selector.setAttribute('content-loaded', true);
                        selector.innerHTML = request.responseText;
                        selector.style.display = '';

                       // var totalTime2 = new Date().getTime() - ajaxTime2;
                       // console.log('time taken2: ' + totalTime2);
                    } 
                };

                request.onerror = function () {
                    console.warn("failed to get %s page!", "<page name>");
                };

                request.send();
            }

            function ajaxCall()
            {
                var ajaxTime = new Date().getTime();
                let data = $.get(pageUrl, "html").done(function (html) {
                    //  console.log(html);
                    selector.setAttribute('content-loaded', true);
                    selector.innerHTML = html;
                    selector.style.display = '';

                    var totalTime = new Date().getTime() - ajaxTime;
                    console.log('time taken: ' + totalTime);
                }).fail(function () { console.warn("failed to get %s page!", "<page name>"); });
            }          
            ajaxCall2();
           //ajaxCall();

          
            break;
            return;
        }
    }
  
    if (isRouteFound == false) {
        console.warn("no route found", "<page name>");
        var x = document.createElement("SECTION");
        x.setAttribute("id", "errorpage");
        document.getElementById('app').appendChild(x);
        let errorPageSelector = document.getElementById('errorpage');
        errorPageSelector.innerHTML = '<h3>opps!</h3> <p>no route found</p>';
        errorPageSelector.style.display = '';
    }
 
}

EstyJs.prototype.onhashchange = function (e) {
    let hashtag = this.getAttribute('href');
    var arr = getUrlParameter(hashtag);
    e.preventDefault();
    hashtag = getHashTag2(hashtag);
    _self.initPage(hashtag)
    for (var i = 0; i < arr.length; i++) {
        if (i == 0) {
            hashtag += "?" + arr[i].key + "=" + arr[i].value;
        }
        else {
            hashtag += "&" + arr[i].key + "=" + arr[i].value;
        }

    }
    window.history.pushState('page2', 'Title', '/' + hashtag);

}

