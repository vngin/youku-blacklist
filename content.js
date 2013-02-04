/*******************************
 * load this script in youku.com 
 *******************************/

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
