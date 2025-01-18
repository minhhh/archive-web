import * as docopt from 'docopt';
import { launch } from './cmd.js';
const doc = '\n\
Download webpages to a local folder for archiving purpose\n\
\n\
Usage: archive-web [--output-dir <dir>]\n\
               [--use-puppeteer | --use-phantom]\n\
               [--no-download]\n\
               [--no-timestamp]\n\
               [--timestamp-format <tf>]\n\
               [--utc]\n\
               [-v --verbose]\n\
               [--debug]\n\
               URL...\n\
\n\
       archive-web --version\n\
\n\
Download one or more URL to a folder named by current local timestamp with default format YYYYMMDDHHmmss.\n\
Can disable timestamp-based folder.\n\
Can change timestamp format.\n\
\n\
Arguments:\n\
  URL        You can specify one or more URL for processing.\n\
\n\
General Options:\n\
  -h, --help                        Show this help message and exit\n\
  --version                         Print version information\n\
  -v, --verbose                     Show verbose information\n\
  --debug......                     Show debug information [default: false].\n\
\n\
Output Options:\n\
  -o, --output-dir <dir>            Name of the parent folder. Default to current folder\n\
  --use-puppeteer                   Use headless browser Chromium\n\
  --use-phantom                     Use headless browser Phantom\n\
  --no-download                     Only generate the timestamp folder and not actually download the content\n\
  --no-timestamp                    Disable the timestamp folder\n\
  -t, --timestamp-format <tf>       Specify timestamp format supported by `moment` [default: YYYYMMDDHHmmss].\n\
  --utc                             Use UTC time. [default: false].\n\
\n\
Examples:\n\
\n\
  archive-web --no-timestamp <url>\n\
        Download url(s) to current folder without timestamp\n\
\n\
  archive-web -o another_folder <url>\n\
        Download url(s) to another folder instead of the current folder\n\
\n\
  dl-page --utc --timestamp-format YYYYMMDDHHmmssSSS <url>\n\
        Use UTC time. Timestamp extended to milliseconds, so e.g.: 20191021153025478\n\
\n ';
var kwargs = {
    name: 'archive-web',
    version: 'archive-web 0.1.1',
};
const main = async () => {
    try {
        var args = docopt.docopt(doc, kwargs);
        if (args['--debug']) {
            console.log(JSON.stringify(args));
        }
        await launch(args);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
main();
