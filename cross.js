/*****************************
 * functions and others defined
 * may be used in different parts
 * of extension, eg
 *   options.js
 *   background.js
 *****************************/

var CROSS = (function () {
  
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
  
  return {
    video_link: video_link
  }

})();
