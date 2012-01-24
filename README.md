Willie
======
FocusLab's embeded javascript tracking library.

![Groundskeeper Willie](http://upload.wikimedia.org/wikipedia/en/d/dc/GroundskeeperWillie.png)

Usage
-----

Public API details coming soon!


Development
-----------

Willie is a little tricky to develop.  Since it is intended to be embeded on
sites all over the internet it has a few challenges that it has to deal with:

* Sites may do all sorts of things to change the JS enviornment that could
  conflict with our code (globals, modifying prototypes, etc).
* Similarly we could create conflicts with existing JS on pages that we get
  embeded in.
* We need to create little or no performace impact on the pages that we embed
  into.
* We need to load as quickly as possible to increase the chances that we'll
  capture the user's activity before the navigate away from the page.
* We need to communicate with a REST API (Trigger API) that lives on a
  different domain than the page we are embeded in.
* We need to work with relatively old browsers.  While FocusLab doesn't need
  to care about IE6 for our application, we may have clients who place Willie
  on sites that do care about IE6 compatibility.

To deal with this we are leveraging two libraries that take care of most of
the really hard parts of the challenges above: [LightningJS][1] and
[EasyXDM][2].

LightningJS provides a bunch of tools to help us load our code
with a minimal impact.  Additionally LightningJS helps us isolate our code
from the code running in the embeded page to avoid conflicts in either
direction.

EasyXDM provides a cross-browser API for doing cross-domain requests.

While these libraries help us out a ton by solving these problems for us, they
do have a cost.  They make it a bit difficult to create testable and
maintainable code.  To address these challenges we are using [Jasmine][3] and
a custom build script.  Jasmie provides a reasonable testing framework which
runs within a web browser (giving us as close to real world conditions as
possible).  The build script allows us to write maintable code spread across
many files that then gets concatenated and minified into something that can
run in production.

### Dev Process

Our goal is to develop Willie in an environment that is as close to the real
world as possible.  This can sometimes create frustrations for doing rapid
development but it goes a long way towards getting stuck with hard to
replicate bugs in production.

Once you have your environment setup (see instructions below) testing Willie
is relatively straightforward.  There are two peices you will need to do: get
the build process running and run the tests in your web browser.  To get the
build process going follow the steps below:

1.  Open a terminal window and naviage to the directory where you have Willie
    checked out.
1.  Activate your virtualenv (the build script is written in Python and has a
    few dependencies).
1.  Run the command `./bin/build.py --watch`.  By including the `--watch` the
    build script will watch for changes in the source files for Willie and
    automatically re-run the build process as needed.

When the build script is running, it will generate a `focuslab.js` and a
`focuslab.min.js` file in the `build` directory.  These files are what the
Jasmine spec runner will load and what your tests will run against.  By using
this process any problems that arise due to the concatenation or minifcation
process will be idenitified as soon as they are introduced as opposed to
during the release process.

Note that to kill the build script when it is in "watch" mode, hit `ctrl-c`.

Finally to run the test suite for Willie, you want to open the
`tests/SpecRunner.html` file in a web browser.  It is reccomended that you do
this via a local web server (nginx, apache, etc) instead of using a file URL
as some things might behave in unexpected ways when loaded via a file URL
(cookies, caching, etc).


### Setting up dev environment

To run the build script you will need to have a relatively recent version of
Python installed (2.7 is preferred but 2.6 should work) and a Java runtime
(we use the [Closure compiler][4] to minify JS).  Once you have these
dependencies installed, there are a few python dependencies that you will need
to install.  It is recommended that you install the python dependencies into
a [virtualenv][5] (see also [virtualenvwrapper][6]).  Once you've created and
activated your virtualenv, you can install the Python dependencies for the
build script by running `pip install -r requirements.txt` from the root of the
Willie project directory.  Once these dependencies you should be able to
successfully run `./bin/build.py`.

The other bit of setup which is strongly recommended but not strictly required
is to setup a local web server to serve the Jasime spec runner and JS files.
What server you use doesn't really matter, for conveinence below are
instructions on setting up Nginx on OSX using [Homebrew][7]:

1.  `brew update`
1.  `brew install nginx`
1.  `nginx`
1.  ln -s /path/to/willie /usr/local/Cellar/nginx/<nginx_version>/html

After running these commands you should be able to open
[http://localhost:8080/willie/tests/SpecRunner.html][8] in your web browser.


[1]: http://lightningjs.com/
[2]: http://easyxdm.net/
[3]: https://github.com/pivotal/jasmine
[4]: http://code.google.com/closure/compiler/
[5]: http://pypi.python.org/pypi/virtualenv
[6]: http://www.doughellmann.com/projects/virtualenvwrapper/
[7]: http://mxcl.github.com/homebrew/
[8]: http://localhost:8080/willie/tests/SpecRunner.html
