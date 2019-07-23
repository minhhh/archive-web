"use strict";

var async = _interopRequireWildcard(require("async"));

var tmp = _interopRequireWildcard(require("tmp"));

var fs = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var _events = require("events");

var _ewait = require("ewait");

var _websiteScraper = _interopRequireDefault(require("website-scraper"));

var _moment = _interopRequireDefault(require("moment"));

var _websiteScraperPuppeteer = _interopRequireDefault(require("website-scraper-puppeteer"));

var _websiteScraperPhantom = _interopRequireDefault(require("website-scraper-phantom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var launch = function launch(args) {
  var tmpDirPath = null;
  var parentPath = null;
  var emitter = new _events.EventEmitter();
  async.waterfall([function (next) {
    var all = new _ewait.WaitForAll({
      timeout: 2147483647,
      event: "done"
    });
    all.add([emitter]);
    all.wait();
    next();
  }, function (next) {
    tmp.dir({
      keep: true
    }, function _tempDirCreated(_err, _path) {
      if (_err) {
        next(_err);
        return;
      }

      if (args["--verbose"]) {
        console.log("Temp Dir: ", _path);
      }

      tmpDirPath = _path;
      next();
    });
  }, function (next) {
    async.map(args.URL, function (_item, _next) {
      var plugins = [];

      if (args["--use-puppeteer"]) {
        plugins.push(new _websiteScraperPuppeteer["default"]());
      }

      if (args["--use-phantom"]) {
        plugins.push(new _websiteScraperPhantom["default"]());
      }

      var options = {
        urls: _item,
        directory: path.join(tmpDirPath, encodeURIComponent(_item)),
        recursive: false,
        maxDepth: 0,
        plugins: plugins
      };
      (0, _websiteScraper["default"])(options, _next);
    }, next);
  }, function (res, next) {
    parentPath = path.join(args["--output-dir"] || process.cwd(), args["--no-timestamp"] ? "" : args["--utc"] ? (0, _moment["default"])().utc().format(args["--timestamp-format"]) : (0, _moment["default"])().local().format(args["--timestamp-format"]));
    fs.copy(tmpDirPath, parentPath, {
      overwrite: true
    }, function (_err) {
      if (_err) {
        next(_err);
        return;
      }

      next();
    });
  }], function (err, res) {
    if (err) {
      process.stderr.write("Encountered error: " + err);
      emitter.emit("done");
      process.exit(1);
    }

    console.log("Done! Output to " + path.resolve(parentPath));
    emitter.emit("done");
  });
};

exports.launch = launch;