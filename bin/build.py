#!/usr/bin/env python
from os import makedirs, stat
from os.path import abspath, join, dirname, exists
import time


import envoy
from clint import args
from clint.textui import puts, colored, indent

project_dir = abspath(join(dirname(__file__), '../'))
src_dir = join(project_dir, 'src')
vendor_dir = join(project_dir, 'vendor')
build_dir = join(project_dir, 'build')

raw_target = join(build_dir, 'focuslab.js')
min_target = join(build_dir, 'focuslab.min.js')

puts(colored.green('Starting to build Willie...'))

build_list = [
    'vendor/lightningjs/lightningjs-bootstrap.js',
    'vendor/easyXDM/json2.js',
    'vendor/easyXDM/easyXDM.js',
    'src/willie.js',
]

last_modified = None


def get_mtime():
    mtime = max([stat(src_file).st_mtime for src_file in build_list])
    return mtime


def build():
    start = time.time()
    error_occurred = False

    with indent(4):

        if not exists(build_dir):
            puts(colored.yellow('Build directory missing.'))
            puts(colored.yellow('Creating a new directory at %s' % build_dir))
            makedirs(build_dir)

        puts(colored.cyan('Build List:'))
        with indent(4):
            for js_file_path in build_list:
                puts(colored.magenta(js_file_path))

        puts(colored.cyan('Concatenating...'))
        with open(raw_target, mode="w") as raw_target_file:
            for js_file_path in build_list:
                raw_target_file.write('// *****************************************\n')
                raw_target_file.write('// %s\n' % js_file_path)
                raw_target_file.write('// *****************************************\n')
                with open(join(project_dir, js_file_path), mode='r') as js_file:
                    raw_target_file.write(js_file.read())
                    raw_target_file.write('\n\n')
        with indent(4):
            puts(colored.magenta('Done.'))

        puts(colored.cyan('Minifying...'))
        with indent(4):
            closure_bin = join(vendor_dir, 'closure/compiler.jar')
            r = envoy.run('java -jar %s --js=%s  --js_output_file=%s' % (
                closure_bin,
                raw_target,
                min_target,
            ))

            if r.status_code == 0:
                puts(colored.magenta('Done.'))
            else:
                error_occurred = True
                puts(colored.red('There was an error running the closure compiler'))
                puts(r.std_out)
                puts(r.std_err)

    run_time = time.time() - start
    if not error_occurred:
        puts(colored.green('Build successfully completed in %g seconds.' % run_time))
    else:
        puts(colored.red('An error occurred :('))


if args.contains('--watch'):
    loop = True
    while loop:
        try:
            updated_last_modified = get_mtime()
            if last_modified is None or last_modified < updated_last_modified:
                puts(colored.yellow('Change detected'))
                last_modified = updated_last_modified
                build()

            time.sleep(3)
        except KeyboardInterrupt:
            puts(colored.red("Quitting..."))
            loop = False
else:
    build()

