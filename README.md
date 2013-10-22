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
   <script language="text/javascript" src="scaletext.js"></script
2.   Make sure you have jQuery. I've only tested this on jQuery 1.10, but it may work on earlier versions.
3.   Add `data-toggle="scaletext"` as an attribute to whatever div contains the text you want to scale.
4.   Include some JS at the end of your document to run the plugin (see below for some examples).


Examples
--------

Basic use:

   <script type="text/javascript">
     $("[data-toggle=scaletext]").scaleText();
   </script>
   
All arguments specified:

   <script type="text/javascript">
     $("[data-toggle=scaletext]").scaleText({
       hDecrement: 0.9, 
       pDecrement: 0.95, 
       hElsSelector: 'h1, h2, h3, h4, h5, h6', 
       pElsSelector: 'p, li'
     });
   </script>
   
`hDecrement` specifies the factor by which to decrement h-level element sizes downward.
`pDecrement` specifies the factor by which to decrement p-level element sizes downward.
`hElsSelector` specifies the h-level elements to look for. By default, this is h1, h2, h3, h4, h5, h6.
`pElsSelector` specifies the p-level elements to look for. By default, this is p, li.
