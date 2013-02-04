var BLACKLIST = (function () {
    
    var blacklist = UTIL.local.get('blacklist') || [];
    
    function add(video) {
        if  ( !is_blacklisted(video.url) ) {
            
            var video = {
                title: video.title,
                url: video.url,
                thumb: video.thumb || '',
                blocked_at: (new Date()).toISOString()
            };
            
            blacklist.push(video);
            UTIL.local.set('blacklist', blacklist);
        }
    }
    
    function is_blacklisted(url) {
        for ( var i = 0; i < blacklist.length; i ++ ) {
            if ( blacklist[i].url == url ) {
                return true;
            }
        }
        
        return false;
    }
    
    function get() {
      return UTIL.local.get('blacklist');
    }

    return {
        add: add,
        get: get,
        is_blacklisted: is_blacklisted
    };
    
})();

// returns a valid link_page url, otherwise null
function video_link(link) {
    
    // a link_page is like http://v.youku.com/v_show/id_XMzY4MTM5NDk2.html
    // without the part after ? eg. ?firsttime=6376
    var link_page_re = /^http:\/\/v.youku.com\/v_show\/[^\?]+/;
    // links that redirect to a page that has a url parameter
    var link_redirect_re = /url=([^\?]+)(\??)(.+)/;
    
    var page_matches = link_page_re.exec(link) || [];
    var redirect_matches = link_redirect_re.exec(link) || [];

    if ( page_matches.length > 0 ) {
        return page_matches[0];
    }
    else if ( redirect_matches.length > 1) {
        return redirect_matches[1];
    }
    
    return null;
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    if (request == 'get_blacklist') {
      sendResponse(BLACKLIST.get());
    }
});

chrome.contextMenus.create({
    title: 'Block this video',
    
    contexts: ['link'],
    
    onclick: function (info, tab) {
        if ( info.linkUrl ) {
            

            chrome.tabs.getSelected(function (tab) {
                var l = video_link(info.linkUrl);
                if ( !l ) return;
                if ( BLACKLIST.is_blacklisted(l) ) {
                    chrome.tabs.sendMessage(tab.id, 'is_blacklisted');
                    return;
                }
                
                
                chrome.tabs.sendMessage(tab.id, 'block', function (response) {
                    var video = {
                        title: response.title,
                        url: l,
                        thumb: response.thumb
                    }
                    BLACKLIST.add(video);

                });  
            })
            
        }
        //console.log(black_list);
    }
});






