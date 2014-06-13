// trustfeed.js 0.1.2 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license

var Trustfeed = this.Trustfeed = {
  // Initialize status
  status:     'waiting'
  // Initialize instances store
, instances: []
  // Initialize defaults
, defaults: function() {
    return {
      class:         'trustfeed'
    , template:      '<article class="trustfeed-entry"><h3>{{title}}</h3><div class="stars tf-stars-{{stars}} tf-stars-{{starSize}}"></div><p class="content">{{content}}{{more}}</p><p class="author">{{name}}</p></article>'
    , readMore:      '<a href="{{url}}" target="_blank">Read more</a>'
    , starSize:      'medium'
    , maxCharacters: 145
    , limit:         10
    , offset:        0
    , reverse:       true
    }
  }
  // Load instance
, load: function(options) {
    var settings
      , option

    // Get fresh defaults object
    settings = this.defaults()

    // Store settings
    this.instances.push(settings)

    // Merge custom settings
    for (option in options)
      settings[option] = options[option]

    if (this.status == 'waiting') {
      // Set loading status
      this.status = 'loading'

      // Determine protocol
      var protocol = window.location.protocol == 'https:' ? 'https:' : 'http:'

      // Load data
      var script = document.createElement('script')
      script.src = this.interpolate('{{protocol}}//{{subdomain}}.trustpilot.com/tpelements/{{clientId}}/f.jsonp', {
        clientId:   settings.clientId
      , protocol:   protocol
      , subdomain:  protocol == 'http:' ? 's' : 'ssl'
      })
      document.getElementsByTagName('head')[0].appendChild(script)
    }

    // Wait for data to arrive
    function proceed() {
      if (Trustfeed.status == 'loaded')
        Trustfeed.run(Trustfeed.data)
      else
        setTimeout(proceed, 50)
    }
    
    proceed()

  }
  // Receive data
, receive: function(data) {
    this.data = data
    this.status = 'loaded'
  }
  // Run result
, run: function() {
    var i, settings, elements, data

    // Run every instance
    while (settings = this.instances.shift()) {
      // Get a fresh copy of data
      data = JSON.parse(JSON.stringify(this.data))

      // Manipulate data
      if (settings.reverse === true)
        data.Reviews.reverse()

      data.Reviews = data.Reviews.slice(settings.offset, settings.limit + settings.offset)
      
      // Get all elements
      elements = document.getElementsByClassName(settings.class)
      
      // Iterate all elements
      for (i = elements.length - 1; i >= 0; i--)
        this.build(elements[i], settings, data)
    }

  }
  // Build element
, build: function(element, settings, data) {
    var i, review

    // Clear existing content
    element.innerHTML = ''

    // Add reviews
    for (i = 0; i < data.Reviews.length; i++)
      element.innerHTML = element.innerHTML + this.interpolate(settings.template, this.review(data.Reviews[i], settings))
    
  }
  // Prepare data
, review: function(review, settings) {
    var content = review.Content
      , more    = ''

    // Truncate content if required
    if (content.length > settings.maxCharacters) {
      content = content.substring(0, settings.maxCharacters) + '... '
      more    = this.interpolate(settings.readMore, { url: review.Url })
    }

    return {
      title:    review.Title
    , content:  content
    , url:      review.Url
    , more:     more
    , score:    review.TrustScore.Score
    , stars:    review.TrustScore.Stars
    , image:    review.TrustScore.StarsImageUrls[settings.starSize]
    , name:     review.User.Name
    , date:     review.Created.HumanDate
    , datetime: review.Created.Human
    , starSize: settings.starSize
    }
  }
  // Interpoate string
, interpolate: function(string, data) {
    for (var key in data)
      string = string.replace(new RegExp('{{' + key + '}}', 'g'), data[key])

    return string
  }

}

// Add global callback
function trustpilot_jsonp_callback(data) {
  Trustfeed.receive(data)
}