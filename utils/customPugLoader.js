const path = require("path");
const dirname = path.dirname;
const loaderUtils = require("loader-utils");
const nodeResolve = require("resolve").sync;
const walk = require('pug-walk');

module.exports = function (source) {
    this.cacheable && this.cacheable();

    let modulePaths = {};
    modulePaths.pug = require.resolve("pug");
    modulePaths.load = nodeResolve("pug-load", {basedir: dirname(modulePaths.pug)});
    modulePaths.runtime = nodeResolve("pug-runtime", {basedir: dirname(modulePaths.pug)});

    let pug = require(modulePaths.pug);
    let load = require(modulePaths.load);

    let req = loaderUtils.getRemainingRequest(this).replace(/^!/, "");

    let query = loaderUtils.getLoaderConfig(this, "pugLoader");

    let loadModule = this.loadModule;
    let resolve = this.resolve;
    let loaderContext = this;
    let callback;

    let fileContents = {};
    let filePaths = {};

    let missingFileMode = false;

    function getFileContent(context, request) {
        request = loaderUtils.urlToRequest(request, query.root);
        let baseRequest = request;
        let filePath;

        filePath = filePaths[context + " " + request];
        if (filePath) return filePath;

        let isSync = true;
        resolve(context, request, function (err, _request) {
            if (err) {
                resolve(context, request, function (err2, _request) {
                    if (err2) return callback(err2);

                    request = _request;
                    next();
                });
                return;
            }

            request = _request;
            next();
            function next() {
                loadModule("-!" + path.join(__dirname, "stringify.loader.js") + "!" + request, function (err, source) {
                    if (err) return callback(err);

                    filePaths[context + " " + baseRequest] = request;
                    fileContents[request] = JSON.parse(source);

                    if (!isSync) {
                        run();
                    }
                });
            }
        });

        filePath = filePaths[context + " " + baseRequest];
        if (filePath) return filePath;

        isSync = false;
        missingFileMode = true;
        throw "continue";
    }

    let plugin = loadModule ? {
        postParse: function (ast) {
            return walk(ast, function (node) {
                if ([
                        "Mixin",
                        "MixinBlock",
                        "NamedBlock"
                    ].indexOf(node.type) !== -1) {
                    ast._mustBeInlined = true;
                }
            });
        },
        resolve: function (request, source) {
            if (!callback) {
                callback = loaderContext.async();
            }

            if (!callback) {
                return load.resolve(request, source);
            }

            let context = dirname(source.split("!").pop());
            return getFileContent(context, request);
        },
        read: function (path) {
            if (!callback) {
                return load.read(path);
            }

            return fileContents[path];
        },
        postLoad: function postLoad(ast) {
            return walk(ast, function (node, replace) {
                if (node.file && node.file.ast) {
                    postLoad(node.file.ast);
                }

                if (node.type === "Include") {
                    if (node.file.ast._mustBeInlined) {
                        ast._mustBeInlined = true;
                    }
                }
            }, function (node, replace) {
                if (node.type === "Include" && !(node.block && node.block.nodes.length) && !node.file.ast._mustBeInlined) {
                    replace({
                        type: "Code",
                        val: "require(" + loaderUtils.stringifyRequest(loaderContext, node.file.fullPath) + ").call(this, locals)",
                        buffer: true,
                        mustEscape: false,
                        isInline: false,
                        line: node.line,
                        filename: node.filename
                    });
                }
            });
        }
    } : {};

    run();
    function run() {
        let compiled;
        try {

            let localesPath;

            if (process.cwd() + path.sep == path.normalize(path.join(__dirname, '../'))) {
                localesPath = process.cwd();
            } else {
                localesPath = '../../';
            }

            compiled = pug.render(source, {
                __: function (key) {
                    let translations = require(path.join(localesPath, 'locales', 'default.js'));
                    return translations[key] || key;
                }
            });
        } catch (e) {
            if (missingFileMode) {
                missingFileMode = false;
                return;
            }
            throw e;
        }

        loaderContext.callback(null, `
            ;\nmodule.exports = {
                template: ${JSON.stringify(compiled)}
            }
        `);
    }
};
