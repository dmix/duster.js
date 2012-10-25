// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca
// slight modifications by Suresh Jayanty
var fs = require('fs'),
	dust = require('dustjs-linkedin'),
	watch = require('watch'),
	yaml = require('js-yaml'),
	colors = require('colors'),
	childprocess = require('child_process'),
	file_options = {
		'input_path': './src.dust',
		'output_path': './dust'
	},
	user_settings_file = process.env['HOME'] + '/.dusterjs',
	svnRegex = /\.svn/,
	swpRegex = /\.swp/,
	gitRegex = /\.git/
	dustRegex = /\.dust$/;


function growl(message, sticky) {
	var command = '/usr/local/bin/growlnotify -p 1 -m "' + message + '"',
		growlnotice;
	if (sticky) {
		command += ' -s';
	}

	growlnotice = childprocess.exec(command, function(error, stdout, stderr) {});
	growlnotice.on('exit', function(code) {});
}

function compile_dust(path, curr, prev) {
	if (swpRegex.exec(path)) {
		console.log(('Ignoring file: ' + path).red);
		return;
	}
	if (svnRegex.exec(path)) {
		console.log(('Ignoring file: ' + path).red);
		return;
	}
	if (gitRegex.exec(path)) {
		console.log(('Ignoring file: ' + path).red);
		return;
	}
	fs.readFile(path, function(err, data) {
		if (err) {

			growl('Error: ' + err + ' : ' + path , true);
			throw err;
		}

		var filename = path.split("/").reverse()[0].replace(".dust", "");
		var filepath = file_options.output_path +  '/' + filename + ".js";
		var compiled = '';
		try {
			compiled = dust.compile(new String(data), filename);

			fs.writeFile(filepath, compiled, function(err) {
				if (err) {
					growl('Error: ' + err, true);
					throw err;
				}
				console.log('Saved ' + filepath);
				growl('Saved ' + filepath);
			});
		} catch (err) {
			growl('Error: ' + err, true);
		}
	});
}

function createMonitor() {
	try {
		watch.createMonitor(file_options.input_path, {
			'ignoreDotFiles': true
		}, function(monitor) {
			console.log("Watching " + file_options.input_path);
			monitor.files['*.dust', '*/*'];
			monitor.on("created", compile_dust);
			monitor.on("changed", compile_dust);
		});
	} catch (err) {
		growl('Error: ' + err, true);
		console.log(err);
	}
}

function processCurrentFiles() {
	fs.readdir(file_options.input_path, function(err, files) {
        if(!err) {
            files.forEach(function(filename) {
            	var dustFile;
            	if(!dustRegex.exec(filename)) {
            		return;
            	}
            	dustFile = filename.replace('.dust', '') + '.js';
                fs.stat(file_options.output_path + '/' + dustFile, function(err, props) {
                    if(err) {
                        console.log('file not found: ' + file_options.output_path + '/' + dustFile);
                        compile_dust(file_options.input_path + '/' + filename);
                    }
                });
            });
        }
    });
}

function main() {
	fs.exists(user_settings_file, function(exists) {
		if (exists) {
			fs.readFile(user_settings_file, 'utf8', function(err, data) {
				if (err) {
					return;
				}

				try {
					yaml.loadAll(data, function(doc) {
						if (doc.input_path) {
							file_options.input_path = doc.input_path;
						}
						if (doc.output_path) {
							file_options.output_path = doc.output_path;
						}

						growl('Watching ' + file_options.input_path + ' for changes');
						growl('Saving compiled templates to ' + file_options.output_path);

						processCurrentFiles();
						createMonitor();
					});
				} catch (err) {
					growl('Error: ' + err, true);
				}
			});
		} else {
			growl('Watching ' + file_options.input_path + ' for changes');
			growl('Saving compiled templates to ' + file_options.output_path);

			processCurrentFiles();
			createMonitor();
		}
	});
}

main();
