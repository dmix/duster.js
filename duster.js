#!/usr/bin/env node
// duster.js 
// Node script to watch & precompile directory of dust.js templates

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
      var compiled = dust.compile(String(data), templateId);
      
      var dirname = path.dirname(output_path);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }

      fs.writeFile(output_path, compiled, function(err) {
        if (err) throw err;
        console.log('Saved ' + output_path);
      });
    });
  }

  watch.createMonitor(input_path, {
    persistent: true,
    interval: 100
  }, function (monitor) {
    console.log("Watching " + input_path);
    monitor.files = ['*.dust', '*/*'];
    monitor.on("created", function (f, stat) {
      if (fs.lstatSync(f).isDirectory()) {
        return;
      }
      compile_dust(f);
    });
    monitor.on("changed", function (f, curr, prev) {
      if (fs.lstatSync(f).isDirectory()) {
        return;
      }
      compile_dust(f);
    });
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

