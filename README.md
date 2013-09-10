# Carousell

A simple javascript plugin for creating a touch based carousel.

[mediastuttgart.github.io/typeright](http://mediastuttgart.github.io/carousell)

## Latest version

0.1.0

## Install

Get a packaged source file:

+ [carousell.pkgd.js](https://raw.github.com/mediastuttgart/carousell/v0.1.0/dist/carousell.pkgd.js)
+ [carousell.pkgd.min.js](https://raw.github.com/mediastuttgart/carousell/v0.1.0/dist/carousell.pkgd.min.js)

Or install via [Bower](http://bower.io):

``` bash
bower install carousell
```

## Build

First, clone a copy of the main Carousell git repository by running:

``` bash
git clone git://github.com/mediastuttgart/carousell.git
```

Install the grunt-cli and bower packages if you haven't before. These should be done as global installs:

``` bash
npm install -g grunt-cli bower
```

Make sure you have grunt and bower installed by testing:

``` bash
grunt -version
bower -version
```

Enter the Carousell directory and install the Node and Bower dependencies:

``` bash
cd carousell && npm install && bower install
```

Then run grunt to build Carousell:

``` bash
grunt
```

The built version of Carousell will be put in the `dist/` subdirectory, along with the minified copy and packaged version including dependencies.

## RequireJS

Carousell works with RequireJS.

1. Install Carousell and its dependencies
2. Update your [RequireJS paths config](http://requirejs.org/docs/api.html#config-paths) so it can find those modules

``` js
requirejs.config({
    paths: {
        "eventEmitter": "vendor/eventEmitter"
    }
});
```

## MIT License

Carousell is released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
