#!/usr/bin/env node
// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca
// Modified by Chris Dew http://www.barricane.com to work nicely with Express
// and to deal with sub directories properly (i.e. create files in sub directories)

var fs = require('fs'),
    path = require('path'),
    dust = require('dustjs-linkedin'),
    watch = require('watch'),

    // get current working directory and path to config file
    cwd = process.cwd().substr(0),
    config = path.normalize(cwd + '/duster.json');

function duster (data) {
  var config = data,
      input_path = path.normalize(cwd + config.raw_dir);

  function compile_dust(filePath, curr, prev) {
    // read dust template
    fs.readFile(filePath, function(err, data) {
      if (err) throw err;
      
      // set our template id to the filename
      var templateId = path.basename(filePath, '.dust'),

      // and mirror our template path
          output_path = cwd + config.pre_dir + filePath.substring(input_path.length);
      output_path = path.normalize(output_path.substring(0, output_path.lastIndexOf('.')) + '.js');

      // compile and save
      var compiled = dust.compile(new String(data), templateId);
      
      fs.writeFile(output_path, compiled, function(err) {
        if (err) throw err;
        console.log('Saved ' + output_path);
      });
    });
  }

  watch.createMonitor(input_path, function (monitor) {
    console.log("Watching " + input_path);
    monitor.files['*.dust', '*/*'];
    monitor.on("created", compile_dust);
    monitor.on("changed", compile_dust);
  });
}

// read configuration file
fs.readFile(config, 'utf8', function (err, data) {
  if (err) { 
    console.log('Error: ' + err);
    return;
  }

  duster(JSON.parse(data));
});

