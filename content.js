/*******************************
 * load this script in youku.com 
 *******************************/
// make a video object from youku's DOM
// <ul class="v">
    // <li class="v_link"><a onmouseover="if(typeof(VideoPop) != 'undefined') VideoPop.showVTip(event)" onmouseout="if(typeof(VideoPop) != 'undefined') VideoPop.hideVTip(event)" href="http://v.youku.com/v_show/id_XNTA1MTI1ODY4.html?f=18886807" charset="106302-51598-2-1" target="video"></a></li>
    // <li class="v_thumb">
    //     <img src="http://g2.ykimg.com/0100401F4650FE07F9A26B0000000196B3538A-3691-0BBD-8BB5-0D6832761177?u=1358825466" alt="奥巴马就职演说全程" title="奥巴马就职演说全程">
    // </li>
    // <li class="v_ishd"><span class="ico__SD" title="超清"></span> </li>
    // <li class="v_menu" id="PlayListFlag_XNTA1MTI1ODY4" style="display: none;"><span class="ico__listadd" title="添加到点播单"></span></li>
    // <li class="v_subhead"><span class="subtitle">强调人人平等自由</span><span class="bg"></span></li>
    // <li class="v_title"><a href="http://v.youku.com/v_show/id_XNTA1MTI1ODY4.html?f=18886807" charset="106302-51598-2-2" target="video" title="奥巴马就职演说全程">奥巴马就职演说全程</a></li>
    // <li class="v_stat"><span class="ico__statplay" title="播放"></span><span class="num">134,299</span> <span title="评论" class="ico__statcomment"></span><span class="num">977</span></li>
// </ul>
// OR
// <ul class="p">
//   <li class="p_thumb">
// ...

function make_video(anchor) {

    var video_node = anchor.parentNode.parentNode;
    var prefix = 'v';
    if ( video_node.className == 'p') {
      prefix = 'p';
    }

    var url = anchor.href;
    var title = anchor.title;
    // If click on thumb image
    if ( !title ) {
      console.log(video_node);
      title = video_node.querySelector('.'+prefix+'_title a').innerHTML;
    }
    
    var img_node = video_node.querySelector('.'+prefix+'_thumb img');
    var thumb = img_node.src;
    return {
        title: title,
        url: url,
        thumb: thumb
    };
}

var ANCHOR = {

  wrapper: function (anchor) {
    if ( !anchor ) return;
    return anchor.parentNode.parentNode;
  },
  
  remove_video: function (anchor) {
    var w = this.wrapper(anchor);
    if ( !w ) return;
    
    w.parentNode.removeChild(w);  
  }
  
};


// main
(function () {
  var anchor_to_block;

  document.addEventListener('mousedown', function (event) {
     
      // right click
      if ( event.button == 2 ) {
          var a = event.target;
          if ( a.tagName == 'A' ) {
              anchor_to_block = a;
          }
      }
      
  }, true);
  
  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
      
      if ( request == 'is_blacklisted') {
          alert('is_blacklisted');
      }
      else if ( request == 'block' ) {
          if ( ! anchor_to_block ) return;
          var v = make_video(anchor_to_block);
          sendResponse(v);
          // remove video node from page
          ANCHOR.remove_video(anchor_to_block);
      }
  });
  
  // do not show videos
  var v_links = document.querySelectorAll('.v_title a');
  var p_links = document.querySelectorAll('.p_title a');
  
  function remove_videos(blacklist, nodelist) {
    if ( !blacklist || !nodelist ) return;
      
    var links_blacklisted = [];
    blacklist.forEach(function (video) {
      links_blacklisted.push(video.url);
    });
    
    for (var i = 0, len = nodelist.length; i < len; ++i ) {
      var anchor = nodelist[i];
      var link_raw = CROSS.video_link(anchor.href);
      if ( links_blacklisted.indexOf(link_raw) >= 0) {
        ANCHOR.remove_video(anchor);
      }
    }
  }
  // <- do not show videos
  
  
  // Retrieve blacklist from localStorage at background page
  chrome.extension.sendMessage('get_blacklist', function(response) {
    var blacklist = response;
    remove_videos(blacklist, v_links);
    remove_videos(blacklist, p_links);

  });
  
})();
