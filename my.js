/**********************************
 * My module 
 * ver 0.13 applied in youkuhelper
 * Removes functions that require jQuery
 * Changes:
 *    Removes cookie function
 *    Removes JSON
 *********************************/

(function (ns) {
    if (ns == undefined) {
        var ns = window;
    }
    else if ( ns in window ){
        var ns = window[ns];
    }
    else {
        var ns = window[ns] = {};
    }
    
    // My module starts
    var stringToArray = function (str, sep) {
        return str.split(sep).map(function (val) {
            return val.trim();
        });
    };
  
  var subset = function (small, big) {
    
    if (typeof small != 'object' || typeof big != 'object') {
      return false;
    }
    
    for (var i in small) {
      if ( small[i] != big[i]) {
        return false;
      }
    }
    
    return true;
  };
      
    var bring = function (from, stuff, to) {
        
        if (typeof stuff != 'string') {
            return undefined;
        }
        
        var towhere = window;
        
        if (to) {
            if (window[to]) {
                towhere = window[to];
            }
            else {
                towhere = window[to] = {};
            }
        }

        //console.log(towhere);
        
        var stuff = stringToArray(stuff, ',');
        
        stuff.forEach(function (value) {
            
            if ( !towhere.hasOwnProperty(value) ) {
                //console.log(value);
                towhere[value] = window[from][value];
            }
        });
    };
    
    var local = {
    
        set: function(key, value){
            var str = typeof value != 'string' ? JSON.stringify(value) : value;
            localStorage.setItem(key, str);
        },
        
        get: function(key){
            try {
                return JSON.parse(localStorage.getItem(key));
            } 
            catch (e) {
                console.log(e.message);
            }
            return localStorage.getItem(key);
        }
    };

    var RESTR = {
        
        // http://regexlib.com/Search.aspx?k=URL
        url: "(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*"
    };
    
    var isURL = function (str) {
        
        var re = new RegExp('^' + RESTR.url + '$');
        //console.log(re);
        
        if ( re.test(str) ) {
            return true;
        }
        return false;
    }
    
    // ONLY find the first url
    var findURL = function (str) {
        
        var re = new RegExp(RESTR.url);
        var result = re.exec(str);
        
        return result ? result[0] : null;
        
    };
  
  // source is a function
  var clone = function (source) {
    
    var temp = function () {
      return source.apply(this, arguments);
    };
    
    for (var i in source.prototype) {
            temp.prototype[i] = source.prototype[i];
        }
        
        for (var i in source) {
            temp[i] = source[i];
        }
    
    return temp;
  };
  
  var copy = function (source) {
    
    var tempname = '_temp';
    
    while (true) {
      
      if ( !window.hasOwnProperty(tempname) ) {
        break;
      }
      
      tempname = '_' + tempname;
        }
    
    var evalstr = source.toString();
        window.eval('var ' + tempname + ' = ' + evalstr);
    
    var temp = window[tempname];
    delete window[tempname];
    
    for (var i in source.prototype) {
      temp.prototype[i] = source.prototype[i];
    }
    
    for (var i in source) {
      temp[i] = source[i];
    }
    
    return temp;    
  };
  
  var inherit = function (Child, Parent) {
        var fn = function () {
            //first Parent, then Child
            Parent.apply(this, arguments);
            Child.apply(this, arguments);
        };
    
    fn.prototype = Parent.prototype;
    
    for (var i in Child.prototype) {
        fn.prototype[i] = Child.prototype[i]; 
    }
    
    for (var i in Parent) {
      fn[i] = Parent[i];
    }
    
    for (var i in Child) {
      fn[i] = Child[i];
    }
    
    return fn;
    };
  
  var isEmpty = function (obj) {
    
    for (var i in obj) {
      return false; 
    }
    
    return true;
  };
    
  var htmlEncode = function (str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g, '&quot;').replace(/\s/g, '&nbsp;').replace(/\n/g, '<br />');
  };
  
  var htmlDecode = function (str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
  };
  
  // http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
  var htmlStrip = function (html) {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent||tmp.innerText;
  };
  
  // Reference: 
  //    https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date
  // Returns:
  //    local datetime, eg. 2012-01-23 12:34:56 
  var datetime = function (d) {
    function pad(n){return n<10 ? '0'+n : n}
    
    return d.getUTCFullYear()+'-'
        + pad(d.getMonth()+1)+'-'
        + pad(d.getDate())+' '
        + pad(d.getHours())+':'
        + pad(d.getMinutes())+':'
        + pad(d.getSeconds());
  };
    
    var format = function (str) {
        var i = 0;
        
        for (; i < arguments.length; i ++ ) {                
            str = str.replace(new RegExp('\\{' + i + '\\}', "g"), arguments[i+1]);
        }
        return str;
    };
  
  var Drawers = function () {
    
  };
  
  Drawers.prototype = {
    
    array: function () {
      var arr = [];
      
      for (var i in this) {
        if ( isNaN(parseInt(i)) ) {
                    continue;
                }
        
        arr.push(this[i]);
      }
      return arr;
    },
    
    indexes: function () {
      var arr = [];
      
      for (var i in this) {
        
        var idx = parseInt(i);
        if ( isNaN(idx) ) {
          continue;
        }
        
        arr.push(idx);
      }
      
      return arr;
    },
    
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    forEach: function (fun) {
      "use strict";
            var a = this.array();
      
        if (a === void 0 || a === null)
          throw new TypeError();
    
        var t = Object(a);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
          throw new TypeError();
    
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
          if (i in t)
            fun.call(thisp, t[i], i, t);
        }
    },
    
    push: function (val) {
      this[this.count()] = val;
      return this.count();
    },
    
    first: function () {
      
      var l = Infinity;
      for (var prop in this) {
        var i = parseInt(prop);
          if ( isNaN(i) ) {
                    continue;
                }
            
        if ( i >= 0 && i < l) {
          l = i;
        }
      }
      
      if (l == Infinity) {
          return null;  
      }
      
      return [l, this[l]];
    },
    
    last: function () {
      var l = -1;
      for ( var prop in this) {
        var i = parseInt(prop);
        if ( isNaN(i) ) {
          continue;
        }
        
        if ( i > l ){
            l = i;  
        }
      }
      
      if (l == -1) {
        return null;
      }
      
      return [l, this[l]];
    },
    
    count: function () {
      return this.array().length;
    },
    
    insert: function (i, val) {
      this[i] = val;
      return this.count();
    },
    
    pop: function (i) {
      
      var t;
      var n = this.last()[0];
      
      if (typeof i == 'undefined') {
        
        t = this[n]
        delete this[n];
        return t;
      }
      
      if ( i > n || i < 0) {
        return null;
      }
      
      if ( isNaN(i) ) {
        return null;
      }   

            t = this[i];
            delete this[i];
            return t;
    },
    
    // if one drawer has {a: 1, b: 2}, and items is {a: 1}
    // then the index of this drawer is returned
      indexOf: function (items) {
      
      if ( typeof items != 'object' ) {
        return -1;
      }
      
        for (var i in this) {
        if ( isNaN(parseInt(i)) ){
          continue;
        }
        
        if ( subset(items, this[i]) ) {
          return parseInt(i);
        }
      }
      
      return -1;
    },
    
    // draw the first drawer out
    one: function (items) {
      var i = this.index(items);
      return i > -1 ? this[i] : null;
    },
    
    remove: function (items) {
      var i = this.index(items);
      return this.pop(i);
    }
  };
  
    
  // callout(what, [how], [callback])
  // what:       
  //     content to popup
  // how:        
  //     times
  //         1   - same content occurs only once,
  //     timeout
  //         -1  - does not close the popup,
  // callback(dom):
  //     executed after popup, param dom is the popup dom
  var callout = function (what) {
    
    var how = typeof arguments[1] == 'object' ? arguments[1] : {};
    
    how = {
      // timeout must be given -1
            timeout: how.timeout || 15000,
        times: how.times || null
    };
    
    var callouts = $('._callouts').get();
    var len = callouts.length;
    
    // needs improvement
        if (how.times == 1) {
        
      for (var i = 0; i < len; i ++ ) {
            if ( callouts[i].getElementsByTagName('span')[1].innerText == what )
            return;
      }
    }

    var zindex = 100 + len;
  
        if ($) {
            var $wrapper = $('<div class="_callouts"/>');
            var $close = $('<span>×</span>');
      var content = $('<span />').text(what);
            var onclose = function () {
                $wrapper.slideUp(150);
            };
 
            $close
                .click(onclose)
                .css({
                    fontSize: '20px',
                    border: '0px #bbbbbb solid',
          borderRadius: '20px',
                    color: '#bbbbbb',
                    width: '16px',
                    textAlign: 'center',
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 6,
                    left: 14
                })
                .mouseenter(function () {
                    $(this).css({
                        color: '#555555',
                        borderColor: '#555555'
                    });
                })
                .mouseout(function () {
                   $(this).css({
                       color: '#bbbbbb',
                       borderColor: '#bbbbbb'
                   });
                });
                
            $wrapper
                .css({
                    zIndex: zindex,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '8px 8px 10px 50px',
                    color: '#000000',
                    position: 'fixed',
                    left: '32%',
                    right: '32%',
                    top: 0,
                    display: 'none',
                    opacity: 1,
                    backgroundColor: '#fefde2',
          border: '1px #ebe19e solid',
                    borderBottomLeftRadius: '2px',
                    borderBottomRightRadius: '2px',
          minHeight: '18px',
          wordWrap: 'break-word',
                    boxShadow: '0 0 10px #333'
                })
                .prependTo('body')
                .append($close)
                .append(content)        
        .slideDown(150);
                
            //console.log(how.timeout);
            if ( how.timeout > 0 ) setTimeout(onclose, how.timeout);
        }
    
        else {
            return window.alert(what);
        }
    
    if (typeof arguments[1] == 'function') 
            arguments[1]($wrapper.get(0));
            
        if (typeof arguments[2] == 'function')
            arguments[2]($wrapper.get(0));
    };
  
  var I18N = function (dict) {
      // "|| {}" is for something like DICTS['en_US'], but 'en_US' does not in DICTS
      this.dict = dict || {}; 
  }
  
  I18N.prototype.translate = function (text) {
      return this.dict[text] ? this.dict[text] : text;
  };

  /*
   * JavaScript Pretty Date
   * Copyright (c) 2008 John Resig (jquery.com)
   * Licensed under the MIT license.
   */
  // Takes an ISO time and returns a string representing how
  // long ago the date represents.
  function prettyDate(time){
      var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
          diff = (((new Date()).getTime() - date.getTime()) / 1000),
          day_diff = Math.floor(diff / 86400);
              
      if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
          return;
              
      return day_diff == 0 && (
              diff < 60 && "just now" ||
              diff < 120 && "1 minute ago" ||
              diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
              diff < 7200 && "1 hour ago" ||
              diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
          day_diff == 1 && "Yesterday" ||
          day_diff < 7 && day_diff + " days ago" ||
          day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
  }
  
  /*
   * Javascript Humane Dates
   * Copyright (c) 2008 Dean Landolt (deanlandolt.com)
   * Re-write by Zach Leatherman (zachleat.com)
   * 
   * Adopted from the John Resig's pretty.js
   * at http://ejohn.org/blog/javascript-pretty-date
   * and henrah's proposed modification 
   * at http://ejohn.org/blog/javascript-pretty-date/#comment-297458
   * 
   * Licensed under the MIT license.
   * 
   * Notes:
   *    It considers time zone offset and displays time difference locally
   */
  
  function humane_date(date_str){
      var time_formats = [
          [60, 'just now'],
          [90, '1 minute'], // 60*1.5
          [3600, 'minutes', 60], // 60*60, 60
          [5400, '1 hour'], // 60*60*1.5
          [86400, 'hours', 3600], // 60*60*24, 60*60
          [129600, '1 day'], // 60*60*24*1.5
          [604800, 'days', 86400], // 60*60*24*7, 60*60*24
          [907200, '1 week'], // 60*60*24*7*1.5
          [2628000, 'weeks', 604800], // 60*60*24*(365/12), 60*60*24*7
          [3942000, '1 month'], // 60*60*24*(365/12)*1.5
          [31536000, 'months', 2628000], // 60*60*24*365, 60*60*24*(365/12)
          [47304000, '1 year'], // 60*60*24*365*1.5
          [3153600000, 'years', 31536000], // 60*60*24*365*100, 60*60*24*365
          [4730400000, '1 century'], // 60*60*24*365*100*1.5
      ];
  
      var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," "),
          dt = new Date,
          seconds = ((dt - new Date(time) + (dt.getTimezoneOffset() * 60000)) / 1000),
          token = ' ago',
          i = 0,
          format;
  
      if (seconds < 0) {
          seconds = Math.abs(seconds);
          token = '';
      }
  
      while (format = time_formats[i++]) {
          if (seconds < format[0]) {
              if (format.length == 2) {
                  return format[1] + (i > 1 ? token : ''); // Conditional so we don't return Just Now Ago
              } else {
                  return Math.round(seconds / format[2]) + ' ' + format[1] + (i > 1 ? token : '');
              }
          }
      }
  
      // overflow for centuries
      if(seconds > 4730400000)
          return Math.round(seconds / 4730400000) + ' Centuries' + token;
  
      return date_str;
  };
    // pretty date ends
        
  // Assign to window or other namespace
  ns.callout = callout;
  ns.bring = bring;
  ns.local = local;
  ns.clone = clone;
  ns.Drawers = Drawers;
  ns.subset = subset;
  ns.inherit = inherit;
  ns.format = format;
  ns.htmlEncode = htmlEncode;
  ns.htmlDecode = htmlDecode;
  ns.htmlStrip = htmlStrip;
  ns.datetime = datetime;
  ns.isEmpty = isEmpty;
  ns.I18N = I18N;
  
  // binding modules of other authors'
  ns.humane_date = humane_date;
  ns.prettyDate = prettyDate;
  
})('UTIL');
