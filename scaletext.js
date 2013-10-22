/*!
/* ========================================================================
 * scaletext.js: Automatically scales text within a div to fit within its parent.
 * https://github.com/morrissinger/scaleText
 * ========================================================================

The MIT License (MIT)

Copyright (c) 2013 Morris Singer

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function ( $ ) {


/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
// 
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
// 
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
// 
// About: Release History
// 
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),
    
    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),
    
    timeout_id,
    
    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  
  // Property: jQuery.resize.delay
  // 
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.
  
  jq_resize[ str_delay ] = 250;
  
  // Property: jQuery.resize.throttleWindow
  // 
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  // 
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  // 
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.
  
  jq_resize[ str_throttle ] = true;
  
  // Event: resize event
  // 
  // Fired when an element's width or height changes. Because browsers only
  // provide this event for the window element, for other elements a polling
  // loop is initialized, running every <jQuery.resize.delay> milliseconds
  // to see if elements' dimensions have changed. You may bind with either
  // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
  // 
  // Usage:
  // 
  // > jQuery('selector').bind( 'resize', function(e) {
  // >   // element's width or height has changed!
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop is not created until at least one callback is actually
  //   bound to the 'resize' event, and this single polling loop is shared
  //   across all elements.
  // 
  // Double firing issue in jQuery 1.3.2:
  // 
  // While this plugin works in jQuery 1.3.2, if an element's event callbacks
  // are manually triggered via .trigger( 'resize' ) or .resize() those
  // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
  // events system. This is not an issue when using jQuery 1.4+.
  // 
  // > // While this works in jQuery 1.4+
  // > $(elem).css({ width: new_w, height: new_h }).resize();
  // > 
  // > // In jQuery 1.3.2, you need to do this:
  // > var elem = $(elem);
  // > elem.css({ width: new_w, height: new_h });
  // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
  // > elem.resize();
      
  $.event.special[ str_resize ] = {
    
    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );
      
      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );
      
      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
    },
    
    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );
      
      // Remove any data stored on the element.
      elem.removeData( str_data );
      
      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },
    
    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var old_handler;
      
      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.
      
      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data );
        
        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        
        old_handler.apply( this, arguments );
      };
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
    
  };
  
  function loopy() {
    
    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){
      
      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );
        
        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }
        
      });
      
      // Loop.
      loopy();
      
    }, jq_resize[ str_delay ] );
    
  };
  
})(jQuery,this);



  /* Global Settings */
  var hDecrement = 0.9, /* Factor by which to iterate h-level element sizes downward */
      pDecrement = 0.95, /* Factor by which to iterate p-level element sizes downward */
      hElsSelector = 'h1, h2, h3, h4, h5, h6', /* H-Level element selectors */
      pElsSelector = 'p, li'; /* P-Level element selectors */
      minHSize = '32px',
      minPSize = '14px'

  // Allow invocation with the HTML syntax.
  $(document).ready(function() {
    $("[data-toggle=scaletext").scaleText();
  });
  
  $.fn.scaleText = function(funcOpts) {
    var el = this;

    var dataOpts = {
      hDecrement:   ($(el).data('scaletext-hdecrement')   === undefined) ? hDecrement   : $(el).data('hdecrement'),
      pDecrement:   ($(el).data('scaletext-pdecrement')   === undefined) ? pDecrement   : $(el).data('scaletext-pdecrement'),
      hElsSelector: ($(el).data('scaletext-helsselector') === undefined) ? hElsSelector : $(el).data('scaletext-helsselector'),
      pElsSelector: ($(el).data('scaletext-pelsselector') === undefined) ? pElsSelector : $(el).data('scaletext-pelsselector'),
      minHSize:     ($(el).data('scaletext-minhsize')     === undefined) ? minHSize     : $(el).data('scaletext-minhsize'),
      minPSize:     ($(el).data('scaletext-minpsize')     === undefined) ? minPSize     : $(el).data('scaletext-minpsize'),
    }

    var opts = $.extend(dataOpts, funcOpts);

    doScale(el, opts);

    $(el).on('resize', function(e) {
      $(el).children(opts.hElsSelector).each(function(index, hEl) {
        $(hEl).css('cssText', '');
      });
      $(el).children(opts.pElsSelector).each(function(index, pEl) {
        $(pEl).css('cssText', '');
      })
      doScale(el, opts);
    });
  }

  function doScale(el, opts) {
    
    var pEls = $(el).children(opts.pElsSelector);
    var hEls = $(el).children(opts.hElsSelector);

    var height = $(el).outerHeight();
    var parentHeight = $(el).parent().outerHeight();

    // We don't want this to hang if there's some kind of problem, so using a for
    // loop rather than a while loop. Also, if overflow is not hidden, then this
    // is going to result in a full reduction in font size, because it will
    // run until i > 10, so don't run this if overflow is not hidden. Lastly, if
    // height is not constricted, don't run for the same reason.

    for (var i = 0; i <= 10; i++) {
      if (height >= parentHeight && ($(el).parent().css('overflow') == 'hidden') && !checkAutoHeight($(el))) {
        decrementSizes(hEls, pEls, opts);
        var height = jQuery(el).outerHeight();
        var parentHeight = jQuery(el).parent().outerHeight();
      }
    }

  }

  function checkAutoHeight(el) {
    var origHeight = $(el).parent().outerHeight();
    var tester = $(el).append('<div class="scaleTextHeightCheck" style="display: block; height: 1px; width: 1px; content: \'\';""></div>')
    var newHeight = $(el).parent().outerHeight();
    $('.scaleTextHeightCheck').detach();
    return (origHeight < newHeight);
  }

  function decrementSizes(hEls, pEls, opts) {
    decrementHEls(hEls, opts.minHSize, opts);
    decrementPEls(pEls, opts.minPSize, opts);
  }

  // Decrements h-level elements
  function decrementHEls(hEls, minSize, opts) {
    $(hEls).each(function(index, el) {
      cssAttributes = {
        'font-size': sizeElAttr(el, 'font-size', opts.hDecrement, minSize),
        'line-height': sizeElAttr(el, 'line-height', opts.hDecrement, minSize),
        'margin-bottom': sizeElAttr(el, 'margin-bottom', opts.hDecrement, minSize)
      };

      $(el).css('cssText', formCssText(cssAttributes));
    });
  }

  // Decrements p-level elements
  function decrementPEls(pEls, minSize, opts) {
    $(pEls).each(function(index, el) {
      cssAttributes = {
        'font-size': sizeElAttr(el, 'font-size', opts.pDecrement, minSize),
        'line-height': sizeElAttr(el, 'line-height', opts.pDecrement, minSize)
      };

      $(el).css('cssText', formCssText(cssAttributes));
    });
  }

  // Returns a decremented size for a given element attribute
  function sizeElAttr(el, attr, decrement, minSize) {
    var units = '';

    if ($(el).css(attr).indexOf('px') > -1 ) {
      units = 'px';
    } else if ($(el).css(attr).indexOf('em') > -1 ) {
      units = 'em';
    } else if ($(el).css(attr).indexOf('pt') > -1 ) {
      units = 'pt';
    } else if ($(el).css(attr).indexOf('%') > -1 ) {
      units = '%';
    }

    if (minSize.indexOf('px') > -1 ) {
      minSizeUnits = 'px';
    } else if (minSize.indexOf('em') > -1 ) {
      minSizeUnits = 'em';
    } else if (minSize.indexOf('pt') > -1 ) {
      minSizeUnits = 'pt';
    } else if (minSize.indexOf('%') > -1 ) {
      minSizeUnits = '%';
    }

    // Force decrement to 1 if already at or below min size font.
    if (parseInt($(el).css('font-size').replace(units, '')) <= minSize.replace(minSizeUnits, '')) {
      decrement = 1;
    }

    return parseInt(parseInt($(el).css(attr).replace(units, '')) * decrement).toString() + units;
  }

  // Forms CSS Text
  function formCssText(cssAttributes) {
    var cssText = '';

    $.each(cssAttributes, function(key, val) {
      cssText = cssText + key + ': ' + val + ' !important;'
    })

    return cssText;
  }

})(jQuery)