// Taken from this handy SO answer
// https://stackoverflow.com/a/40899767

import { createReadStream } from 'fs';
import { createServer } from 'http';
import { dirname, extname, join, sep } from 'path';
import { fileURLToPath } from 'url';

// __filename & __dirname don't exist for ESM so this is to replicate them
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = join(__dirname); // add folders here if necessary (e.g. 'public')

const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

const server = createServer(function (req, res) {
    const reqpath = req.url.toString().split('?')[0];

    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', mime.txt);
        return res.end('Method not implemented');
    }

    const file = join(dir, reqpath.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + sep) !== 0) {
        res.statusCode = 403;
        res.setHeader('Content-Type', mime.txt);
        return res.end('Forbidden');
    }

    const type = mime[extname(file).slice(1)] || mime.txt;
    const s = createReadStream(file);

    s.on('open', function () {
        res.setHeader('Content-Type', type);
        s.pipe(res);
    });

    s.on('error', function () {
        res.setHeader('Content-Type', mime.txt);
        res.statusCode = 404;
        res.end('Not found');
    });
});

// Define the port and host
const port = 3000;
const host = 'localhost';

// Start the server
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
