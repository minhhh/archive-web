# archive-web
Download a webpage for archiving purpose

When saving web pages for later use, we would normally use [Wayback machine](https://web.archive.org/) or [archive.is](http://archive.is/) but sometimes these websites can be unavailable. Therefore, we would sometimes archive web pages to our own static server. `archive-web` makes archiving easier by downloading the web pages to appropriate folder structure with timestamp similar to [Wayback machine](https://web.archive.org/), so you can just put the downloaded folder to your static server and it'll work.

If you download [https://www.npmjs.com](https://www.npmjs.com) then the final link looks like this: [https://yourserver/20190724002159/https%3A%2F%2Fwww.npmjs.com/index.html](https://yourserver/20190724002159/https%3A%2F%2Fwww.npmjs.com/index.html)

## Install
```
Use npm
$ npm install -g archive-web

Use yarn
$ yarn global add archive-web
```

## Usage
```
archive-web -h

Usage: archive-web [--output-dir <dir>]
               [--use-puppeteer | --use-phantom]
               [--no-timestamp]
               [--timestamp-format <tf>]
               [--utc]
               [-v --verbose]
               [--debug]
               URL...

       archive-web --version

Download one or more URL to a folder named by current local timestamp with default format YYYYMMDDHHmmss.
Can disable timestamp-based folder.
Can change timestamp format.

Arguments:
  URL        You can specify one or more URL for processing.

General Options:
  -h, --help                        Show this help message and exit
  --version                         Print version information
  -v, --verbose                     Show verbose information
  --debug......                     Show debug information [default: false].

Output Options:
  -o, --output-dir <dir>            Name of the parent folder. Default to current folder
  --use-puppeteer                   Use headless browser Chromium
  --use-phantom                     Use headless browser Phantom
  --no-timestamp                    Disable the timestamp folder
  -t, --timestamp-format <tf>       Specify timestamp format supported by `moment` [default: YYYYMMDDHHmmss].
  --utc                             Use UTC time. [default: false].
```

## Examples
Archive a web page

```
$ archive-web https://www.npmjs.com/package/website-scraper

> Download to <current_folder>/20190724002159/ https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebsite-scraper
```

Archive a web page but don't save in a timestamp folder

```
$ archive-web --no-timestamp https://www.npmjs.com/package/website-scraper

> Download to <current_folder>/https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebsite-scraper
```

Use milliseconds timestamp

```
$ archive-web --timestamp-format YYYYMMDDHHmmssSSS https://www.npmjs.com/package/website-scraper

> Download to <current_folder>/20190724003816744/https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebsite-scraper
```

Use UTC time
```
$ archive-web --utc https://www.npmjs.com/package/website-scraper
```

Download multiple web pages at the same time
```
$ archive-web <site1> <site2> ...
```

## Changelog

**0.0.1**

* Initial commit

## License
MIT © [Ha.Minh](https://github.com/minhhh)

	