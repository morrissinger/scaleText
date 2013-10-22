scaleText
=========

Automatically scales text within a div to fit within its parent.

If you have a div with css set as overflow: hidden, you can use this jQuery plugin
to ensure that the text inside of it actually fits in the div.

I have seen some jQuery plugins that do this for title text (e.g., h-level elements),
and some that do this for body text (e.g., p-level elements),  but I have yet to see
a jQuery plugin that does this for *both*, simultaneously.

This simply scales the text down until it fits, and it is flexible, so you can pass
it arguments to fit your needs.

How to Use
----------

1.   Add javascript file to your site, somewhere, and include it, e.g.:
   `<script language="text/javascript" src="scaletext.js"></script>`
2.   Make sure you have jQuery. I've only tested this on jQuery 1.10, but it may work on earlier versions.
3.   Either: (i) Add `data-toggle="scaletext"` as an attribute to whatever div contains the text you want to scale, or (ii) include some JS at the end of your document to run the plugin (see below for some examples).


Syntax
--------
In both scenarios -- passing arguments via JavaScript and passing arguments via 
HTML -- you can use as many or as few of the arguments as you wish. There are
defaults for all of them (which happen to be the values used in the examples).

###JavaScript

####Synopsis
     $(<targetElement>).scaleText(<arguments>)

####Arguments
Options available to pass to scaleText(), in a hash:

-   `hDecrement` specifies the factor by which to decrement h-level element sizes downward.
-   `pDecrement` specifies the factor by which to decrement p-level element sizes downward.
-   `hElsSelector` specifies the h-level elements to look for. By default, this is h1, h2, h3, h4, h5, h6.
-   `pElsSelector` specifies the p-level elements to look for. By default, this is p, li.
-   `minHSize` specifies the minimum font size for h-level elements.
-   `minPSize` specifies the minimum font size p-level elements.

####Examples

#####Basic JavaScript Invocation

     <script type="text/javascript">
       $("[data-toggle=scaletext]").scaleText();
     </script>
   
#####All Arguments Specified

     <script type="text/javascript">
       $("[data-toggle=scaletext]").scaleText({
         hDecrement: 0.9, 
         pDecrement: 0.95, 
         hElsSelector: 'h1, h2, h3, h4, h5, h6', 
         pElsSelector: 'p, li',
         minHSize = '32px',
         minPSize = '14px'
       });
     </script>

### HTML

#### Synopsis

     <div data-toggle="scaletext" data-scaletext-ARGUMENT="">
       Lorem ipsum dolor sit amet...
     </div>

####Arguments
Options available to pass to scaleText(), in a hash:

-   `scaletext-hdecrement` specifies the factor by which to decrement h-level element sizes downward.
-   `scaletext-pdecrement` specifies the factor by which to decrement p-level element sizes downward.
-   `scaletext-helsselector` specifies the h-level elements to look for. By default, this is h1, h2, h3, h4, h5, h6.
-   `scaletext-pelsselector` specifies the p-level elements to look for. By default, this is p, li.
-   `scaletext-minhsize` specifies the minimum font size for h-level elements.
-   `scaletext-minpsize` specifies the minimum font size p-level elements.

####Examples

#####Basic HTML Inovcation

     <div data-toggle="scaletext">
       Lorem ipsum dolor sit amet...
     </div>

#####All Arguments Specified

     <div data-toggle="scaletext" data-scaletext-hdecrement="0.9" data-scaletext-pdecrement-"0.95" data-scaletext-helsselector="h1, h2, h3, h4, h5, h6" data-scaletext-pelsselector="p, li" data-scaletext-minhsize="32px" data-scaletext-minpsize="14px">
       Lorem ipsum dolor sit amet...
     </div>


