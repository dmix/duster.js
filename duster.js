// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca

var input_path = "./dusts"; // directory of dust templates are stored with .dust file extension
var output_path = "./javascripts/dusts/"; // directory where the compiled .js files should be saved to

var fs = require('fs');
var dust = require('dustjs-linkedin');
var watch = require('watch');

function compile_dust(path, curr, prev) {
  fs.readFile(path, function(err, data) {
    if (err) throw err;

    var filename = path.split("/").reverse()[0].replace(".dust", "");
    var filepath = output_path + filename + ".js";
    var compiled = dust.compile(new String(data), filename);

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
