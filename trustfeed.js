// trustfeed.js 0.1.0 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license

var Trustfeed = this.Trustfeed = {
  // Settings
  load: function(options) {
    var option, script, protocol

    // Define default settings
    this.settings = {
      class:         'trustfeed'
    , template:      '<article class="trustfeed-entry"><h3>{{title}}</h3><div class="stars tf-stars-{{stars}} tf-stars-{{starSize}}"></div><p class="content">{{content}}{{more}}</p><p class="author">{{name}}</p></article>'
    , readMore:      '<a href="{{url}}" target="_blank">Read more</a>'
    , starSize:      'medium'
    , maxCharacters: 145
    , limit:         10
    }

    // Merge custom settings
    for (option in options)
      this.settings[option] = options[option]

    // Determine protocol
    protocol = window.location.protocol == 'https:' ? 'https:' : 'http:'

    // Load data
    script = document.createElement('script')
    script.src = this.interpolate('{{protocol}}//{{subdomain}}.trustpilot.com/tpelements/{{clientId}}/f.jsonp', {
      clientId:   this.settings.clientId
    , protocol:   protocol
    , subdomain:  protocol == 'http:' ? 's' : 'ssl'
    })
    document.getElementsByTagName('head')[0].appendChild(script)

  }
  // Run result
, run: function(data) {
    var i, elements

    // Store data
    this.data = data
    this.data.Reviews.reverse()
    this.data.Reviews = this.data.Reviews.slice(0, this.settings.limit)
  
    // Get all elements
    elements = document.getElementsByClassName(this.settings.class)
  
    // Iterate all elements
    for (i = elements.length - 1; i >= 0; i--)
      this.build(elements[i])

  }
  // Build element
, build: function(element) {
    var i, review

    // Clear existing content
    element.innerHTML = ''

    // Add reviews
    for (i = 0; i < this.data.Reviews.length; i++)
      element.innerHTML = element.innerHTML + this.interpolate(this.settings.template, this.review(this.data.Reviews[i]))
    
  }
  // Prepare data
, review: function(review) {
    var content = review.Content
      , more    = ''

    // Truncate content if required
    if (content.length > this.settings.maxCharacters) {
      content = content.substring(0, this.settings.maxCharacters) + '... '
      more    = this.interpolate(this.settings.readMore, { url: review.Url })
    }

    return {
      title:    review.Title
    , content:  content
    , url:      review.Url
    , more:     more
    , score:    review.TrustScore.Score
    , stars:    review.TrustScore.Stars
    , image:    review.TrustScore.StarsImageUrls[this.settings.starSize]
    , name:     review.User.Name
    , date:     review.Created.HumanDate
    , datetime: review.Created.Human
    , starSize: this.settings.starSize
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
  Trustfeed.run(data)
}