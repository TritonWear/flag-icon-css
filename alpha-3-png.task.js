var request = require('request');
var glob = require('glob');
var path = require('path');
var countries, content, path, alpha2;
var mv = require('mv');

// Get list of countries with Alpha-2 and Alpha-3 country codes
request.get('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json', function (err, response, body) {
  if (err) {
    throw err;
  }
  try {
    countries = JSON.parse(body);
  } catch (err) {
    throw err;
  }
  glob('./flags/png/*.png', function(err, files) {
    files.forEach(function(fp) {
      console.log(fp);
    // Get the Alpha-2 country code, match it with the list of countries and extend the funciton with Alpha-3 code as well
    for (var i = 0; i < countries.length; i++) {
      if (countries[i]['alpha-2'].toLowerCase() === fp.replace('./flags/png/', '').replace('.png', '').toLowerCase()) {
        mv(fp, path.join('./flags/png-alpha-3/', countries[i]['alpha-3'] + '.png'), {mkdirp: true}, function() {
          console.log('moved');
        });
      }
    }
  });
});
});