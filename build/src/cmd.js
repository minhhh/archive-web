import * as tmp from 'tmp';
import fs from 'fs-extra';
import * as path from 'path';
import scrape from 'website-scraper';
import moment from 'moment';
const launch = async (args) => {
    let tmpDirPath = '';
    const parentPath = path.join(args['--output-dir'] || process.cwd(), args['--no-timestamp']
        ? ''
        : args['--utc']
            ? moment().utc().format(args['--timestamp-format'])
            : moment().local().format(args['--timestamp-format']));
    const tmpDirResult = tmp.dirSync({ keep: true });
    tmpDirPath = tmpDirResult.name;
    if (args['--verbose']) {
        console.log('Temp Dir: ', tmpDirPath);
    }
    const plugins = [];
    if (args['--use-puppeteer']) {
        // @ts-ignore
        const PuppeteerPlugin = await import('website-scraper-puppeteer');
        plugins.push(new PuppeteerPlugin.default());
    }
    if (args['--use-phantom']) {
        // @ts-ignore
        const PhantomPlugin = await import('website-scraper-phantom');
        plugins.push(new PhantomPlugin());
    }
    if (args['--no-download']) {
        for (const item of args.URL) {
            fs.mkdirpSync(path.join(parentPath, encodeURIComponent(item)));
        }
    }
    else {
        for (const item of args.URL) {
            const options = {
                urls: item,
                directory: path.join(tmpDirPath, encodeURIComponent(item)),
                recursive: false,
                maxDepth: 0,
                plugins: plugins,
            };
            await scrape(options);
        }
        fs.moveSync(tmpDirPath, parentPath, { overwrite: true });
    }
    console.log('Done! Output to ' + path.resolve(parentPath));
};
export { launch };
