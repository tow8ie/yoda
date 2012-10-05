This demonstrates how a YUI modularized code base can be loaded in the browser
either:

1. Dynamically (scripts are requested by browser)
2. Statically (precompiled via Node.js)

To compile the JavaScript use:

    ./js/compiler.js --base-dir js/ --module a --output-file js/application-compiled.js --yui-lib-dir node_modules/yui/

