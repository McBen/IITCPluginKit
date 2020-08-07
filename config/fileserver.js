const express = require('express');
const fs = require('fs');

const port = 8100;
const publicDir = 'dist/';



var IndexPage = function (req, res) {

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

        return `
            <div class='script'>
                <a href='${meta['filename']}'>${name} (${meta['filename']})</a> <span>${meta['version']}</span><br>
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

    res.send('<!DOCTYPE html><html><head><style>' + css() + '</style></head><body>' + scriptList() + '</body>');
};



var app = express();
app.get('/', IndexPage);
app.get('/index', IndexPage);
app.use(express.static(publicDir));

app.listen(port, function () {
    console.log('ScriptServer listening at http://localhost:%s', port);
    console.log('  serving files from %s', publicDir);
});







