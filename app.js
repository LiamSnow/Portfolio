'use strict';

const express = require('express');
const app = express();
const fs = require("fs");
const path = require('path');
app.use(express.static('src'));
app.use('/images', express.static(__dirname + '/src/images/'));

// Hosting
app.get('/', (req, res) => {
	getPage('/src/pages/index.html', function (a) {
		res.send(a);
	})
});

app.get('/blog', (req, res) => {
	getPage('/src/pages/blog.html', function (a) {
		res.send(a);
	})
});

app.get('*', (req, res) => {
	fs.readFile(path.join(__dirname, '/src/pages/404.html'), 'utf8', function (err, data) {
		if (err) { console.error(err); return; }

		res.send(data);
	});
});

//Page Functions
function getPage(dir, callback) {
	fs.readFile(path.join(__dirname, dir), 'utf8', function (err, data) {
		if (err) { console.error(err); return; }

		addDefaultPage(data, function (parsedPage) {
			callback(parsedPage);
		});
	});

	function addDefaultPage(data, callback) {
		function ds(a) {
			var s = data.lastIndexOf(`<${a}>`);
			var e = data.lastIndexOf(`</${a}>`);
			if (s != -1 && e != -1) {
				var r = data.substring(s + a.length + 2, e);
				data = data.slice(0, s) + data.slice(e + a.length + 3);
				return r;
			}
			else return;
		}

		function dsm(a, lnb, lne) {
			var ret = "";
			var r = true;
			while (r) {
				var n = ds(a);
				if (n)
					ret += (lnb + n + lne);
				else
					r = false;
			}
			return ret;
		}

		var title = ds('title');
		var css = dsm(`css`, `<link href="lib/css/`, `.css" type="text/css" rel="stylesheet">`);
		var javascript = dsm(`javascript`, `<script src="`, `"></script>`);

		fs.readFile(path.join(__dirname, '/src/main.html'), 'utf8', function (err, pageData) {
			if (err) { next(err); return; }

			function r(f, t) {
				while (pageData.indexOf('${' + f + '}') != -1) {
					pageData = pageData.replace('${' + f + '}', t);
				}
			}

			r('content', data);
			r('title', title);
			r('css', css);
			r('javascript', javascript);

			callback(pageData);
		});
	}
}


// Localhost (def localhost:5000)
if (module === require.main) {
	const server = app.listen(process.env.PORT || 5000, () => {
		const port = server.address().port;
		console.log(`Hosting Portfolio at localhost:${port}`);
	});
}
module.exports = app;