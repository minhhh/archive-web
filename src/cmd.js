import * as async from "async";
import * as tmp from "tmp";
import * as fs from "fs-extra";
import * as path from "path";
import { EventEmitter } from "events";
import { WaitForAll } from "ewait";
import scrape from "website-scraper";
import moment from "moment";

var launch = function(args) {
  var tmpDirPath = null;
  var parentPath = null;
  var emitter = new EventEmitter();
  async.waterfall(
    [
      function(next) {
        var all = new WaitForAll({
          timeout: 2147483647,
          event: "done"
        });

        all.add([emitter]);
        all.wait();
        next();
      },
      function(next) {
        tmp.dir(
          {
            keep: true
          },
          function _tempDirCreated(_err, _path) {
            if (_err) {
              next(_err);
              return;
            }

            if (args["--verbose"]) {
              console.log("Temp Dir: ", _path);
            }
            tmpDirPath = _path;

            next();
          }
        );
      },
      function(next) {
        async.map(
          args.URL,
          (_item, _next) => {
            var plugins = [];
            if (args["--use-puppeteer"]) {
              var PuppeteerPlugin = require("website-scraper-puppeteer");
              plugins.push(new PuppeteerPlugin());
            }
            if (args["--use-phantom"]) {
              var PhantomPlugin = require("website-scraper-phantom");
              plugins.push(new PhantomPlugin());
            }
            const options = {
              urls: _item,
              directory: path.join(tmpDirPath, encodeURIComponent(_item)),
              recursive: false,
              maxDepth: 0,
              plugins: plugins
            };

            scrape(options, _next);
          },
          next
        );
      },
      function(res, next) {
        parentPath = path.join(
          args["--output-dir"] || process.cwd(),
          args["--no-timestamp"]
            ? ""
            : args["--utc"]
            ? moment()
                .utc()
                .format(args["--timestamp-format"])
            : moment()
                .local()
                .format(args["--timestamp-format"])
        );
        fs.copy(tmpDirPath, parentPath, { overwrite: true }, _err => {
          if (_err) {
            next(_err);
            return;
          }
          next();
        });
      }
    ],
    function(err, res) {
      if (err) {
        process.stderr.write("Encountered error: " + err);
        emitter.emit("done");
        process.exit(1);
      }
      console.log("Done! Output to " + path.resolve(parentPath));
      emitter.emit("done");
    }
  );
};

exports.launch = launch;
