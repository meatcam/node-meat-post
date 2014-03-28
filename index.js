var request = require('request');
var _ = require('lodash');

var endpoints = {
  intl: 'https://chat.meatspac.es/add/chat',
  fr: 'https://fr.meatspac.es/add/chat',
  staging: 'http://chat-staging.meatspac.es/add/chat',
  tv: 'https://meatspaces.tv/api/add/show'
};

var Poster = function(options) {
  var target = 'tv';
  var endpoint = endpoints.tv;

  this.sending = false;

  function apiKey() {
    return {
      intl: options.apiKey,
      fr: options.frApiKey,
      staging: options.stagingApiKey,
      tv: options.tvApiKey
    }[target];
  }

  function formData(message, gif) {
    var data = {
      fingerprint: options.fingerprint,
      apiKey: apiKey(),
      message: message,
      picture: 'data:image/gif;base64,' + gif
    };

    if (target === 'tv') {
      _.extend(data, {
        twitter: {
          username: options.twitterUsername,
          id: options.twitterId
        }
      });
    }

    return data;
  }

  this.setTarget = function(t) {
    target = t;
    endpoint = endpoints[t] || t;
  };

  this.send = function(message, gif, callback) {
    if (this.sending) {
      return callback(new Error('Cannot send two gifs at the same time'));
    }
    this.sending = true;
    request.post(endpoint, {
      form: formData(message, gif)
    }, function(err, response, body) {
      this.sending = false;
      callback(err, response, body);
    });
  };
};

module.exports = Poster;
