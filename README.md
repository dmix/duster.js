Duster.js - Node script to watch & precompile directory of dustjs templates
==============

Based on the original script by Dan McGrady http://dmix.ca

A simple Node script <a href="#">Duster.js</a> to watch a directory of .dust templates and compile them into .js files which can be included into an HTML file.

Why? The dust.js documentation does not mentioned a clear way to work with dust templates in a purely client-side approach, instead focusing on server-side node.js applications.

For my backbone.js app, the only option was to include the dust-full.js file and compile the templates on each browser load. The file is much larger than the normal dust-core.js and this approach provides no extra value over other templating solutions (performance, browser caching, external file management etc).

So I wrote a script to pre-compile dust.js files whenever they are modified in a folder.

## Install
Clone this repository

Run the installation 
    $ npm install

Get the growl app from the App Store (*not free) or from here https://bitbucket.org/pmetzger/growl/downloads

Be sure to install growlnotify plugin

## Usage
Create a file named .dusterjs in your home directory and add the input and output paths to it. The file is expected to be in YAML format

Example: 

    ---
    input_path:   /Users/<username>/src.dust/
    output_path:  /Users/<username>/dust/

Create dust.js templates in the <input_path> dir with the file extension .dust and create <output_path> directory where files will be compiled to, then run watcher script:

    $ node duster.js

## Example:
    <input_path>/tweet.dust
    <input_path>/user.dust

Compiles to:

    <output_path>/tweet.js
    <output_path>/user.js

## Changes by Suresh Jayanty

* Added support for growl notifications

* Added support for settings file

* Ignoring .swp files created when some one uses vim to edit the dust files
