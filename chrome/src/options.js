/*
	Copyright 2010 Nik Cubrilovic [http://nikcub.appspot.com]. All Rights Reserved.

	Use of this source code is governed by a 3-clause BSD license.
	See the LICENSE file for details.
*/


siteStoreKey = 'fidelio.sitelist';

function $$(selector) {
	return document.querySelectorAll(selector);
}



function $(sel) {
	return document.querySelector(sel);
}



function ltrim(str) {
	for (var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++);
	return str.substring(k, str.length);
}


function rtrim(str) {
	for (var j = str.length - 1; j >= 0 && isWhitespace(str.charAt(j)); j--);
	return str.substring(0, j + 1);
}


function trim(str) {
	if (typeof(str) == 'string') return ltrim(rtrim(str));
	else return str;
}


function isWhitespace(charToCheck) {
	var whitespaceChars = " \t\n\r\f.";
	return (whitespaceChars.indexOf(charToCheck) != -1);
}



function hostMatch(src1, src2) {
	var url1 = this.reverseString(src1);
	var url2 = this.reverseString(src2);
	var sub = (url1.length < url2.length) ? url1 : url2;

	return (url1.substr(0, sub.length) != url2.substr(0, sub.length));
}



function reverseString(str) {
	return str.split('').reverse().join('');
}



function getHost(url) {
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	return url.match(re)[1].toString().toLowerCase();
}



function focusInput() {
	$('#addSite').focus();
}



function autoComplete(event) {
	// console.log(event);
}



function addSiteKey(event) {
	// console.log('sitekey', event);
}



function sortedKeys(array) {
	var keys = [];
	for (var i in array) {
		keys.push(i);
	}
	keys.sort();
	return keys;
}



function CookieCache() {
	this.cookies_ = {};

	this.reset = function() {
		this.cookies_ = {};
	};

	this.add = function(cookie) {
		var domain = cookie.domain;
		if (!this.cookies_[domain]) {
			this.cookies_[domain] = [];
		}
		this.cookies_[domain].push(cookie);
	};

	this.remove = function(cookie) {
		var domain = cookie.domain;
		if (this.cookies_[domain]) {
			var i = 0;
			while (i < this.cookies_[domain].length) {
				if (cookieMatch(this.cookies_[domain][i], cookie)) {
					this.cookies_[domain].splice(i, 1);
				} else {
					i++;
				}
			}
			if (this.cookies_[domain].length == 0) {
				delete this.cookies_[domain];
			}
		}
	};

	// Returns a sorted list of cookie domains that match |filter|. If |filter| is
	//  null, returns all domains.
	this.getDomains = function(filter) {
		var result = [];
		sortedKeys(this.cookies_).forEach(function(domain) {
			if (!filter || domain.indexOf(filter) != -1) {
				result.push(domain);
			}
		});
		return result;
	};

	this.getMatched = function(filter) {
		var result = [];
		for (cookie in this.cookies_) {
			if (!hostMatch(trim(cookie), trim(filter))) {
				for (ck in this.cookies_[cookie]) {
					result.push(this.cookies_[cookie][ck]);
				}
			}
		}
		return result;
	};

	this.getCookies = function(domain) {
		return this.cookies_[domain];
	};
}



function validHostname(host) {
	if (/^(([a-z0-9]+|([a-z0-9]+[-]+[a-z0-9]+))[.])+(AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN|XN|XN|XN|XN|XN|XN|XN|XN|XN|XN|YE|YT|YU|ZA|ZM|ZW)[.]?$/i.test(host)) {
		return true;
	} else {
		return false;
	}

}



function evAddSite() {
	var site = $('#addSite').value;
	if (!validHostname(site)) {
		alert('Please enter a valid hostname');
		focusInput();
		return false;
	}
	if (haveSite(site)) {
		alert('Site already in list');
		return false;
	}
	addSite(site);
	return true;
}

// this is just never going to work...
// attempt to check if SSL exists for site when adding
// so much going wrong with this - getting x-domain errors
// random network errors, etc. even though it is supposed
// to work with extensions
// @todo file a bug
function checkHasHttps(site) {
	var supports = false;
	$('#addStatus').innerHTML = 'Checking site..';
	var xhr = new XMLHttpRequest();
	reqUrl = "https://" + site;
	// console.log('req:', reqUrl);

	xhr.onreadystatechange = function() {
		str = '..';
		switch (xhr.readyState) {
		case 0:
		case 1:
			str = 'Loading ..';
			break;
		case 2:
			str = "Loaded..";
			break;
		case 3:
			str = "sorts done..";
			break;
		case 4:
			str = "done..";
			break;
		}
		$('#addStatus').innerHTML = str;
	};

	xhr.open("HEAD", reqUrl, false);
	xhr.send();
	// if(xhr.status)
	// console.log('yep');
	// else
	// console.log('fail');
}


function rewriteCookie(cookies) {
	for (cookie in cookies) {
		if (!cookies[cookie].secure) {
			cookies[cookie].url = 'https://' + trim(cookies[cookie].domain) + cookies[cookie].path;
			cookies[cookie].secure = true;
			delete cookies[cookie].hostOnly;
			delete cookies[cookie].session;
			ret = chrome.cookies.set(cookies[cookie]);
		}
	}

}



function addSite(val) {
	var site = val;
	var table = $('#siteListBody');
	var cookies = cache.getMatched(site);
	ret = rewriteCookie(cookies);

	var row = table.insertRow(-1);
	row.insertCell(-1).innerText = site;
	row.setAttribute("id", site + "_row");
	var cell = row.insertCell(-1);
	cell.innerText = cookies.length;
	cell.setAttribute("class", "cookie_count");
	cell.setAttribute("id", site + "_cookie_count");

	var button = document.createElement("button");
	button.innerText = "del";
	button.onclick = (function(dom) {
		return function() {
			removeSite(dom);
		};
	} (site));
	// button.onClick = removeSite(site);
	var cell2 = row.insertCell(-1);
	cell2.appendChild(button);
	cell2.setAttribute("class", "button");
	$('#addSite').value = '';
	storeSite(site);
	return true;
}



function removeSite(url) {
	curList = getStorage(siteStoreKey);
	console.log('removeSite:', url, curList);
	if (curList.indexOf(url) >= 0) {
		curList = arrRemove(curList, url);
		setStorage(siteStoreKey, curList);
	}
}



function haveSite(url) {
	var result = getStorage(siteStoreKey);
	ret = result.indexOf(url);
	delete result;
	return (ret >= 0);
}



function storeSite(url) {
	curList = getStorage(siteStoreKey);
	console.log('storeSite', url, curList);
	if (curList.indexOf(url) < 0) {
		curList.push(url);
		console.log('storeSite - added:', url, curList);
		setStorage(siteStoreKey, curList);
	}
}



function getStorage(key) {
	var result = localStorage[key];
	if (typeof(result) == "undefined" || result == "undefined") {
		return ["twitter.com", "facebook.com"];
	} else {
		console.log('res:', typeof(result), result);
		var res = JSON.parse(result);
		console.log('res:', typeof(res), res);
		return res;
		// return (typeof(result) != 'undefined') ? JSON.parse(result) : [];
	}
}



function setStorage(key, value) {
	if (typeof(value) != 'undefined') localStorage[key] = JSON.stringify(value);
}



function listener(info) {
	// cache.remove(info.cookie);
	// if (!info.removed) {
	//   cache.add(info.cookie);
	// }
}



function startListening() {
	chrome.cookies.onChanged.addListener(listener);
}



function stopListening() {
	chrome.cookies.onChanged.removeListener(listener);
}



function arrRemove(arr, key) {
	var pos = arr.indexOf(key);
	if (pos >= 0) {
		arr.splice(pos, 1);
		return arr;
	}
};



function onload() {
	siteList = getStorage(siteStoreKey);

	// can you believe this? only way it works ..
	// @todo file a bug
	setTimeout(function() {
		for (site in siteList) {
			// console.log('adding ', siteList[site]);
			addSite(siteList[site]);
		}
	},
	500);

}

var cache = new CookieCache();

chrome.cookies.getAll({},
function(cookies) {
	for (var i in cookies) {
		cache.add(cookies[i]);
	}
});
