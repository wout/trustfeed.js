# trustfeed.js

A library-agnostic micro API wrapper for Trustpilot.

Trustfeed.js is licensed under the terms of the MIT License.

## Usage
1. Include this plugin into your document:

```html
<script src="trustfeed.js"></script>
```

2. Create one or more elements with class name `trustfeed`:

```html
<div class="trustfeed"></div>
```


3. Finally, define your clientId and load the feed:

```javascript
Trustfeed.load({
  clientId: 1234567
})
```

## Customizing