# JaimeJS

J`aime JS!! and HTML 5 

# License

The MIT License (MIT)
Copyright (c) 2012 Nicolas Traeder

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

# Requirements

* JQuery 1.7.1 http://www.jquery.com

# HTML 5 new "data" attributes

### data-action (required)

the event that should bind to the DOM-Element

possible values: click, dblclick, load, change(inputs,select,textarea only), submit(form only) 

### data-function

If this parameter is set a function is called when the event is triggered which was set in "data-action"

### data-request

the request URI for the AJAX request 

### data-type

the AJAX request type

JSONP, POST, GET


(only possible if the data-request attribute is set)

### data-callback 

the callback function that gets called after the ajax request finished
(only possible if the data-request attribute is set)

### data-target

a id of a DOM-Element in which data of a request will be loaded
(only possible if the data-request attribute is set)

### data-placeholder

a id of a DOM-Element which will be replaced by the data of the request.
(only possible if the data-request attribute is set)


# Example HTML Markup

### Example Button with click action ###
```
<button id="btn-twitter" data-action="click" data-request="http://api.twitter.com/1/users/lookup.json?screen_name=cakephp&callback=?"
		   data-callback="twitterCallback" data-type="JSONP">ClickExample</button>
```

#Todo

* better example.
