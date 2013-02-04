// js loaded in options.html

// --> some shorthands


var $d = document;

function $c(tag_name) {
  return document.createElement(tag_name);
}

// <-- shorthands ends

function Video(o) {
  this.url = o.url;
  this.title = o.title;
  this.blocked_at = o.blocked_at;
  this.thumb = o.thumb || '';
  this.node = $c('div');
  
  this.build_node();
}

Video.prototype = {
  /*
  <div class="video">
    <div class="thumb">
      <img alt="" src="http://g2.ykimg.com/0100641F464DC97644FCEF05323006446BEC2C-711B-BBDA-7241-642BA9516392" />
    </div>
    <div class="title">
      <a href="http://v.youku.com/v_show/id_XMjY1ODgwOTI0.html"></a>
    </div>
    <div class="blocked-at">
      <span></span>
      <span class="date">1990-01-01 12:34:56</span>
    </div>
  </div>
  */
  build_node: function () {
    
    var thumb_elem = $c('div');
    var thumb_anchor = $c('a');
    var title_elem = $c('div');
    var blocked_at_elem = $c('div');
    
    this.node.className = 'video';
    this.node.appendChild(thumb_elem);
    this.node.appendChild(title_elem);
    this.node.appendChild(blocked_at_elem);
    
    thumb_elem.className = 'thumb';
    title_elem.className = 'title';
    blocked_at_elem.className = 'blocked-at';
    
    var thumb_img = $c('img');
    thumb_img.src = this.thumb;
    thumb_img.alt = '';
    thumb_anchor.target = '_blank';
    thumb_anchor.href = this.url;
    thumb_anchor.appendChild(thumb_img);
    thumb_elem.appendChild(thumb_anchor);
    
    var title_anchor = $c('a');
    title_anchor.href = this.url;
    title_anchor.innerHTML = this.title;
    title_elem.appendChild(title_anchor);
    
    var blocked_at_text = $c('span');
    blocked_at_text.innerHTML = '屏蔽：';
    blocked_at_elem.appendChild(blocked_at_text);
    
    var blocked_at_date = $c('span');
    blocked_at_date.className = 'date';
    blocked_at_date.innerHTML = this.blocked_at;
    blocked_at_elem.appendChild(blocked_at_date);
  }
};

// main
(function () {
  
  // bing clear-all button to clear blacklist
  document.getElementById('clear-all').addEventListener('click', function (){
    UTIL.local.set('blacklist', '');
    document.getElementById('videos').innerHTML = '';
    
  });
  
  var videos = UTIL.local.get('blacklist');
  var videos_num = (videos || []).length;
  for (var i = 0; i < videos_num; i ++ ) {
    
    var v = videos[i];
 
    var one = new Video({
      url: v.url,
      thumb: v.thumb,
      title: v.title,
      blocked_at: UTIL.humane_date(v.blocked_at)
    });
    
    $d.querySelector('#videos').appendChild(one.node);
  }
  
})();
