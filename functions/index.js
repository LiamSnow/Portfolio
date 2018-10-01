const functions = require('firebase-functions');
const request = require('request');

exports.getPage = functions.https.onRequest((req, res) => {
	var url = req.headers['x-forwarded-host'];

	if (url == "localhost:5000")
		url = "http://"  + url;
	else
		url = "https://" + url;

	if (req.url.indexOf('blog/') != -1)
		url += req.url.replace('blog', 'blogs') + ".html";
	else
		url += "/pages" + (req.url == "/" ? "/index" : req.url) + ".html";

	console.log("File url " + url);

	request(url, function (error, response, body) {
		if (error) { return error; }

		function ds(a) {
			var s = body.lastIndexOf(`<${a}>`);
			var e = body.lastIndexOf(`</${a}>`);
			if (s != -1 && e != -1) {
				var r = body.substring(s + a.length + 2, e);
				body = body.slice(0, s) + body.slice(e + a.length + 3);
				return r;
			}
			else return;
		}

		var title = ds("title");

		var css = "";
		var scss = true; while (scss) {
			var a = ds("css");
			if (a) css += `<link href="../css/${a}.css" rel="stylesheet">`;
			else scss = false;
		}

		var content = body;

		res.status(response.statusCode).send(
(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" />

	<meta name="Description" content="Liam Snow's Portfolio" />
	<meta name="keywords" content="Liam,Liam Snow,Portfolio,Blog" />
	<meta name="theme-color" content="#171a1f" />
	<meta name="background_color" content="#171a1f" />
	<link rel="manifest" href="../manifest.json">
	<link rel="shortcut icon" href="../images/icon.jpg">

	<title>Liam Snow: ${title}</title>

	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-123806824-1"></script>
	<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date);gtag("config","UA-123806824-1");</script>

	<script defer src="/__/firebase/5.3.1/firebase-app.js"></script>
	<script defer src="/__/firebase/init.js"></script>

	<link type="text/css" rel="stylesheet" href="../imports/material.css" />
	<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

	<link href="../css/main.css" rel="stylesheet">
	${css}

	<script type="application/ld+json">
		{
		"@context": "http://schema.org",
		"@type": "Person",
		"name": "Liam Snow",
		"image": "https://liamsnow.com/images/me.jpg",
		"url": "https://liamsnow.com",
		"sameAs": [
		"https://github.com/LiamSnow",
		"https://www.facebook.com/liam.snow.7121",
		"https://twitter.com/LiamSnow13?lang=en",
		"https://www.youtube.com/channel/UC5pYcDrWJKhc6dy6TDvS-ow"
		],
		"affiliation": {
		"@type": "Organization",
		"name": "BreakerBots"
		},
		"birthDate": "2003-10-17T07:00:00.000Z",
		"email": "liamsnow03@gmail.com",
		"height": {
		"@type": "Distance",
		"name": "6 ft"
		},
		"jobTitle": "Breakerbots Lead Programmer",
		"gender": "Male"
		}
	</script>
	<script type="application/ld+json">
		{
		"@context": "http://schema.org",
		"@type": "WebSite",
		"url": "https://liamsnow.com",
		"name": "Liam Snow's Portfolio"
		}
	</script>
	<script type="application/ld+json">
		{
		"@context": "http://schema.org",
		"@type": "WebPage",
		"url": "https://liamsnow.com",
		"name": "Liam Snow's Portfolio"
		}
	</script>
	<script type="application/ld+json">
		{
		"@context": "http://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": [
		{
		"@type": "ListItem",
		"position": 1,
		"item": {
		"@id": "https://liamsnow.com",
		"name": "About"
		}
		},
		{
		"@type": "ListItem",
		"position": 2,
		"item": {
		"@id": "https://liamsnow.com/projects",
		"name": "Projects"
		}
		}
		]
		}
	</script>
</head>
<body>
	<header class="a">
		<header-left class="header-section">
			<img onclick="s8a9hs('')" src="../images/iconw.jpg" />
			<header-title--wrapper>
				<header-title>Liam Snow: ${title}</header-title>
			</header-title--wrapper>
		</header-left>
		<header-right class="header-section">
			<i onclick="td4269()" class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle" aria-pressed="true" tabindex="-1"><img style="width: 32px" src="../images/icons/menu.png"></i>
		</header-right>
		<header-border--wrapper>
			<header-border></header-border>
		</header-border--wrapper>
	</header>

	<aside class="breaker-drawer--wrapper mdc-drawer mdc-drawer--temporary mdc-typography main-nav-drawer mdc-drawer--animating" data-mdc-auto-init="MDCTemporaryDrawer" style="--mdc-temporary-drawer-opacity:0;">
		<nav class="breaker-drawer mdc-drawer__drawer">
			<nav class="mdc-drawer__content mdc-list">
				<a class="mdc-list-item mdc-ripple-upgraded" href="/projects" data-mdc-auto-init="MDCRipple" data-mdc-tabindex-handled="true" tabindex="-1">
					Projects
				</a>
				<a class="mdc-list-item mdc-ripple-upgraded" href="/blog" data-mdc-auto-init="MDCRipple" data-mdc-tabindex-handled="true" tabindex="-1">
					Blog
				</a>
			</nav>
		</nav>
	</aside>

	<container>
		${content}
	</container>

	<footer>
		<footer-section>
			<footer-top>
				<img src="../images/icony.jpg" />
				<div>
					<div>
						This site is created using HTML, CSS and Javascript along with <a href="https://material.io/" target="_blank">Google's Material Desing Components</a>.
						This website is also hosted through
						<a href="https://firebase.google.com/" target="_blank">Firebase</a>.
					</div>
				</div>
			</footer-top>
			<footer-divider></footer-divider>
			<footer-bottom>
				<footer-contact--title>Contact Me</footer-contact--title>
				<footer-contact>
					<a href="https://github.com/LiamSnow" target="_blank"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/github.jpg" /></i></a>
					<a href="mailto:liamsnow03@gmail.com"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/email.jpg" /></i></a>
					<a href="https://www.youtube.com/channel/UC5pYcDrWJKhc6dy6TDvS-ow" target="_blank"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/youtube.jpg" /></i></a>
					<a href="https://twitter.com/LiamSnow13" target="_blank"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/twitter.jpg" /></i></a>
					<a href="https://plus.google.com/u/0/101968490516050014998" target="_blank"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/google+.jpg" /></i></a>
					<a href="https://www.facebook.com/liam.snow.7121" target="_blank"><i class="mdc-icon-toggle" data-mdc-auto-init="MDCIconToggle"><img style="width: 100%;" src="../images/social/facebook.jpg" /></i></a>
				</footer-contact>
			</footer-bottom>
		</footer-section>
	</footer>

	<transitions>
		<page-fade--open></page-fade--open>
		<page-fade--close></page-fade--close>
	</transitions>
	
	<scripts>
		<script src="../imports/material.js"></script>
		<script>mdc.autoInit();</script>
		<script>
			window.s8a9hs=function(a){document.querySelector("page-fade--close").classList.add("a");setTimeout(function(){window.location.pathname=a},400)};window.td4269=function(){document.querySelector(".mdc-drawer").MDCTemporaryDrawer.open=!document.querySelector(".mdc-drawer").MDCTemporaryDrawer.open};
		</script>
	</scripts>
</body>
</html>			
`)
		);
	});
});