var request = require('request');
var fs = require('fs');
var path = require('path');
var srcLists = ['./less/flag-icon-list.less', './sass/_flag-icon-list.scss'];
var src = ['./less/flag-icon.less', './sass/flag-icon.scss'];
var countries, content, lines, alpha2;

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
  srcLists.forEach(function (srcPath) {
    content = fs.readFileSync(path.resolve(__dirname, srcPath), 'utf8');
    lines = content.split("\n").map(function (line) {

      // Get the Alpha-2 country code, match it with the list of countries and extend the funciton with Alpha-3 code as well
      alpha2 = line.substring(line.indexOf('flag-icon(') + 10, line.indexOf('flag-icon(') + 10 + 2);
      for (var i = 0; i < countries.length; i++) {
        if (countries[i]['alpha-2'].toLowerCase() === alpha2) {
          line = line.replace('flag-icon(' + alpha2, ('flag-icon(' + alpha2 + ', ' + countries[i]['alpha-3'].toLowerCase()));
          break;
        }
      }
      return line;
    });
    var ext = path.extname(srcPath);
    fs.writeFileSync(path.resolve(__dirname, srcPath.replace(ext, '') + '-extended' + ext), lines.join('\n'));
  });

  // Create an extended entry point file with update reference to new extended list
  src.forEach(function (srcPath) {
    content = fs.readFileSync(path.resolve(__dirname, srcPath), 'utf8');
    lines = content.split("\n").map(function (line) {
        if(line.indexOf('flag-icon-list') >= 0 ){
            line = line.replace('flag-icon-list', 'flag-icon-list-extended');
        }
        if(line.indexOf('flag-icon-more') >= 0 ){
            line = '';
        }
        return line;
    });
    var ext = path.extname(srcPath);
    fs.writeFileSync(path.resolve(__dirname, srcPath.replace(ext, '') + '-extended' + ext), lines.join('\n'));
  });

});
