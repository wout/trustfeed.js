# trustfeed.js

A library-agnostic micro API wrapper for Trustpilot.

Trustfeed.js is licensed under the terms of the MIT License.

## Usage
Include this plugin into your document:

```html
<script src="trustfeed.js"></script>
```

Create one or more elements with class name `trustfeed`:

```html
<div class="trustfeed"></div>
```

Finally, define your clientId and load the feed:

```javascript
Trustfeed.load({
  clientId: 1234567
})
```

This will fill every html element with class name `trustfeed` with the latest items.

## Customizing
There is a variaty of configuration options.

### class
The class name of the elements filled with the trustpilot stream:

```javascript
Trustfeed.load({
  clientId: 1234567
, class: 'my-class'
})
```

_defaults to: 'trustfeed'_

### limit
The maximum amount of reviews to be showed:

```javascript
Trustfeed.load({
  clientId: 1234567
, limit: 5
})
```

_defaults to: 10_
_absolute maximum: 10_


### maxCharacters
The maximum amount of charaters for the content of the review:

```javascript
Trustfeed.load({
  clientId: 1234567
, maxCharacters: 50
})
```

_defaults to: 145_

### readMore
Template for the read more link:

```javascript
Trustfeed.load({
  clientId: 1234567
, readMore: '<a href="{{url}}">Give me more!</a>'
})
```

_defaults to:_
```html
<a href="{{url}}" target="_blank">Read more</a>
```

### starSize
The size of the stars:

```javascript
Trustfeed.load({
  clientId: 1234567
, starSize: 'large'
})
```

_defaults to: 'medium'_
_available options: 'small', 'medium', 'large'_

### template
The template for every review:

```javascript
Trustfeed.load({
  clientId: 1234567
, template: '<article class="trustfeed-entry"><h3>{{title}}</h3><div class="stars stars-{{stars}}"></div><p class="content">{{content}}{{more}}</p><p class="author">{{name}}</p></article><p class="date">{{date}}</p>'
})
```

Within the template the following variables are available:
- title (review title)
- content (review content)
- url (link to the review)
- more (the `redMore` template)
- score (review score)
- stars (number of stars)
- image (review stars image)
- name (name of the user)
- date (date of the review)
- datetime (date and time of the review)

_defaults to:_
```html
<article class="trustfeed-entry"><h3>{{title}}</h3><div class="stars stars-{{stars}}"></div><p class="content">{{content}}{{more}}</p><p class="author">{{name}}</p></article>
```




