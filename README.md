# Phaser - Framework for Web Applications

OBS: This documentation is beeing updated with instructions and samples on how to use the framework.

## What is?

Phaser is a Javascript/PHP framework, currently in beta version, that smoothens the edge between client-side coding (JS) and server-side programming (PHP) to allow for an easier way of coding dynamic webpages.

The main feature of the framework is that you can easily send a request to the server using javascript and easily modify parts of the current HTML withou having to write complex javascript code.

To support this feature and allow for easily HTML manipulation, other functions are also available. Refer to the example included to see what this framework is capable of doing.

OBS: Although there are other functions working at the moment, the example will only show the ones that are finished and without bugs.

## How does it work?

This framework is made of 2 files: Phaser.js and Phaser.php
Phaser.js contains functions that can help you make dynamic requests to the server, fetch the results and update the HTML elements in the browser in a very easy way.

Requests should be done to specific php files in the server that will include the Phaser.php file. This file contains functions that will get the data requested and modify the HTML in very few steps.

## How to use it?

- Create a folder on the root of your website called 'phaser' and move Phaser.js and Phaser.php in there
- Include the Phaser.js in your HTML file (or the file that will be loaded in the browser):
```html
<script src="phaser/phaser.js"></script>
```
- When writing a event function in javascript in your HTML, for example a click event, use the following function to make a dynamic request to a PHP file:
```javascript
function funcCalledOnAClick() {
	async({url:'phpFileToAnswerRequest.php', run:'functionToRunOnThatPhpFile()'});
}
```
Please refer to the example files (index.html and loadmeasync.php) to see practical examples.
If you have a functional server put both files in there and load the index.html in your browser, to see the examples working.

## Version Info

v.0.1.0 -------------------------------------

Released functions:

JavaScipts side:
- async({});
- element("selector").set({propery:value});
- element("selector").update()
- element("selector").update(attributes)
- element("selector").update(attribute,source)
- element("selector").update({attr:"Attributtes",cache:});
- cache("selector").innerHTML;
- cache.update();

PHP side:
- p_runjs();
- p_makeCache();
