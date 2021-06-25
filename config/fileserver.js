const express = require('express');
const myIP = require('my-ip');
const fs = require('fs');

let port = 8100;
const publicDir = 'dist/';


let pidx = process.argv.indexOf("-p");
if (pidx === -1) pidx = process.argv.indexOf("--port");
if (pidx !== -1) port = parseInt(process.argv[pidx + 1])


function localIP() {
    return myIP() + ":" + port;
}

var IndexPage = function (request, response) {

    function scriptList() {

        var html = '';

        fs.readdirSync(publicDir).forEach(file => {
            if (fs.lstatSync(publicDir + file).isFile() && file.search(/\.user\.js$/) >= 0) {
                let meta = readScriptMeta(file);
                html += createScriptBlock(meta);
            }
        });

        return html;
    }


    function readScriptMeta(filename) {
        let contents = fs.readFileSync(publicDir + filename).toString();

        let meta = { filename: filename };

        let regex = /^\s*\/\/\s*@(\w+)\s+(.+)$/mg;// example: "// @key values"
        let match = regex.exec(contents);
        while (match != null) {
            meta[match[1]] = match[2];
            match = regex.exec(contents);
        }

        return meta;
    }

    function createScriptBlock(meta) {
        let name = meta['name'] || 'unknown';
        let desc = meta['description']; // .gsub(/^\[.*\]/,'')

        // for mobile: intent://reswue.gitlab.io/iitc/reswue2.user.js#Intent;scheme=https;action=android.intent.action.VIEW;end;
        let linkDirect = meta['filename'];
        let linkIntent = `intent://${localIP()}/${meta['filename']}#Intent;scheme=https;action=android.intent.action.VIEW;end;`
        let link = isMobileClient() ? linkIntent : linkDirect;

        return `
            <div class='script'>
                <a href='${link}'>${name} (${meta['filename']})</a> <span>${meta['version']}</span><br>
                <div class='desc'>${desc}</div>
            </div>`;
    }

    function css() {
        return `
            body { font-family: arial; }
            h1 { border-bottom: 1px solid; font-size: 1.2em; }
            .desc { margin-left: 2em; background: #ececec; }
            .script { padding-bottom: 0.3em; }
            .script span { font-size: 0.8em; }
            .collapse{  cursor: pointer;  display: block;  background: #cdf;}
            .collapse + input{  display: none;}
            .collapse + input + div{  display:none;}
            .collapse + input:checked + div{  display:block;}
        `;
    }

    function isMobileClient() {
        const ua = request.headers['user-agent'];
        return /Android/.test(ua);
    }

    const head = `<!DOCTYPE html><html><head>
            <title>IITCPluginKit Fileserver</title>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <style>${css()}</style>
        </head>`

    response.send(head + `<body>${scriptList()}</body>`);
};



var app = express();
app.get('/', IndexPage);
app.get('/index', IndexPage);
app.use(express.static(publicDir));

app.listen(port, function () {
    console.log('ScriptServer listening at http://%s or http://localhost:%s', localIP(), port);
    console.log(' (use -p number to change port)');
    console.log('  serving files from %s', publicDir);
});







