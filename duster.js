#!/usr/bin/env node
// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca
// Modified by Chris Dew http://www.barricane.com to work nicely with Express
// and to deal with sub directories properly (i.e. create files in sub directories)

var input_path = "./views/"; // directory of dust templates are stored with .dust file extension
var input_parts = 1;
var output_path = "./public/js/dust/"; // directory where the compiled .js files should be saved to

var fs = require('fs');
var dust = require('dustjs-linkedin');
var watch = require('watch');

function compile_dust(path, curr, prev) {
  fs.readFile(path, function(err, data) {
    if (err) throw err;

    var split_path = path.split("/");
    var filename = split_path.reverse()[0].replace(".dust", "");
    var destpath_parts = split_path.slice(input_parts, split_path.length - 1);
    var destpath = destpath_parts.join("/");
    if (destpath.length > 0) destpath = destpath + "/";

    // Should this check that dest path exists and if not recursively mkdir
    // until it does?  At the moment, manual creation of directories is required.

    var filepath = output_path + destpath + filename + ".js";
    var compiled = dust.compile(new String(data), destpath + filename);
    
    fs.writeFile(filepath, compiled, function(err) {
      if (err) throw err;
      console.log('Saved ' + filepath);
    });
  });
}

watch.createMonitor(input_path, function (monitor) {
  console.log("Watching " + input_path);
  monitor.files['*.dust', '*/*'];
  monitor.on("created", compile_dust);
  monitor.on("changed", compile_dust);
})
