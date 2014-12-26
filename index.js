var http = require('http');
var url = require('url');
var inflection = require('inflection');

var hangar = function(url, protractor) {
  this.url = url;
  this.protractor = protractor;
};

var hangarHeaders = {
  Factory: 'hangar',
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

hangar.prototype.create = function(name, data) {
  var self = this;
  return this.protractor.promise.controlFlow().execute(function() {
    var deferred = self.protractor.promise.defer();

    var options = url.parse(self.url+inflection.pluralize(name));

    var wrappedData = {};
    wrappedData[name] = data;
    wrappedData = JSON.stringify(wrappedData);

    options.method = 'POST';
    options.headers = {};
    for (var key in hangarHeaders) {
      options.headers[key] = hangarHeaders[key];
    }
    options.headers['Content-Length'] = wrappedData.length;

    var req = http.request(options, function(res) {
      var responseData = '';
      res.on('data', function(chunk) {
        responseData += chunk;
      });
      res.on('end', function() {
        if (res.statusCode == 200 || res.statusCode == 201) {
          deferred.fulfill(JSON.parse(responseData));
        } else {
          deferred.reject(responseData);
        }
      });
    }).on('error', function(e) {
      deferred.reject(e.message);
    });
    req.write(wrappedData);
    req.end();

    return deferred.promise;
  });
};

hangar.prototype.attributesFor = function(name) {
  var self = this;
  return this.protractor.promise.controlFlow().execute(function() {
    var deferred = self.protractor.promise.defer();

    var options = url.parse(self.url+inflection.pluralize(name)+'/new');
    options.headers = {};
    for (var key in hangarHeaders) {
      options.headers[key] = hangarHeaders[key];
    }

    http.get(options, function(res) {
      var responseData = '';
      res.on('data', function(chunk) {
        responseData += chunk;
      });
      res.on('end', function() {
        if (res.statusCode == 200) {
          deferred.fulfill(JSON.parse(responseData));
        } else {
          deferred.reject(responseData);
        }
      });
    }).on('error', function(e) {
      deferred.reject(e.message);
    });

    return deferred.promise;
  });
};

hangar.prototype.clear = function(name) {
  var self = this;
  return this.protractor.promise.controlFlow().execute(function() {
    var deferred = self.protractor.promise.defer();

    var options = url.parse(self.url);

    options.method = 'DELETE';
    options.headers = {};
    for (var key in hangarHeaders) {
      options.headers[key] = hangarHeaders[key];
    }

    http.request(options, function(res) {
      if (res.statusCode == 204) {
        deferred.fulfill();
      } else {
        deferred.reject();
      }
    }).on('error', function(e) {
      deferred.reject(e.message);
    }).end();

    return deferred.promise;
  });
};

module.exports = hangar;
