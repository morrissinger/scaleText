/*
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

  /* Global Settings */
  var hDecrement = 0.9, /* Factor by which to iterate h-level element sizes downward */
      pDecrement = 0.95, /* Factor by which to iterate p-level element sizes downward */
      hElsSelector = 'h1, h2, h3, h4, h5, h6', /* H-Level element selectors */
      pElsSelector = 'p, li'; /* P-Level element selectors */
      minHSize = '32px',
      minPSize = '14px'

  $.fn.scaleText = function(opts) {
    var el = this;

    if (opts === undefined) {
      opts = {}
    }

    if ('hElsSelector' in opts) {
      hElsSelector = opts.hElsSelector;
    }

    if ('pElsSelector' in opts) {
      pElsSelector = opts.pElsSelector;
    }

    if ('minHSize' in opts) {
      minHSize = opts.minHSize;
    }

    if ('minPSize' in opts) {
      minPSize = opts.minPSize;
    }
    
    var pEls = $(el).children(pElsSelector);
    var hEls = $(el).children(hElsSelector);

    var height = $(el).outerHeight();
    var parentHeight = $(el).parent().outerHeight();

    // We don't want this to hang if there's some kind of problem, so using a for
    // loop rather than a while loop. Also, if overflow is not hidden, then this
    // is going to result in a full reduction in font size, because it will
    // run until i > 10, so don't run this if overflow is not hidden. Lastly, if
    // height is not constricted, don't run for the same reason.

    for (var i = 0; i <= 10; i++) {
      if (height >= parentHeight && ($(el).parent().css('overflow') == 'hidden') && !checkAutoHeight($(el))) {
        decrementSizes({h: hEls, p: pEls, minHSize: minHSize, minPSize: minPSize});
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

  function decrementSizes(opts) {
    // Don't throw errors if the are no h-level elements.
    if ('h' in opts) {
      hEls = opts.h;
    } else {
      hEls = [];
    }

    // Don't throw errors if the are no p-level elements.
    if ('p' in opts) {
      pEls = opts.p;
    } else {
      pEls = [];
    }

    // Allow overriding global value for h-level decrement
    if ('hDecrement' in opts) {
      hDecrement = opts.hDecrement;
    }

    // Allow overriding global value for p-level decrement
    if ('pDecrement' in opts) {
      pDecrement = opts.pDecrement;
    }

    decrementHEls(hEls, opts.minHSize);
    decrementPEls(pEls, opts.minPSize);
  }

  // Decrements h-level elements
  function decrementHEls(hEls, minSize) {
    $(hEls).each(function(index, el) {
      cssAttributes = {
        'font-size': sizeElAttr(el, 'font-size', hDecrement, minSize),
        'line-height': sizeElAttr(el, 'line-height', hDecrement, minSize),
        'margin-bottom': sizeElAttr(el, 'margin-bottom', hDecrement, minSize)
      };

      $(el).css('cssText', formCssText(cssAttributes));
    });
  }

  // Decrements p-level elements
  function decrementPEls(pEls, minSize) {
    $(pEls).each(function(index, el) {
      cssAttributes = {
        'font-size': sizeElAttr(el, 'font-size', pDecrement, minSize),
        'line-height': sizeElAttr(el, 'line-height', pDecrement, minSize)
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