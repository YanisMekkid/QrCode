/*!
 * JSQR - JavaScript Quick Response Code Encoder Library v1.0.2
 * http://www.jsqr.de
 *
 * Copyright 2011-2015, Jens Duttke
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.jsqr.de/license
 *
 * Date: 2015-11-13
 */
(function (window, undefined) {
	var Input = function (dataType, data) {
		if (typeof dataType !== 'undefined') {
			if (!isEnumValue(this.DATA_TYPE, dataType)) {
				throw new TypeError('Unsupported dataType');
			}
		} else {
			dataType = this.DATA_TYPE.DEFAULT;
		}
		try {
			Object.defineProperty(this, 'dataType', {
				configurable: false,
				writeable: true,
				get: function () { return dataType; },
				set: function (value) {
					if (isEnumValue(this.DATA_TYPE, value)) {
						dataType = value;
					} else {
						throw new TypeError('Unsupported dataType');
					}
				}
			});
		} catch (e) {
			this.dataType = dataType;
		}

		if (typeof(data) === 'object') {
			this.data = copyObject(data);
		} else {
			this.data = data;
		}
	};

	Input.prototype.DATA_TYPE = {
		DEFAULT: 0,
		TEXT: 0,						// Free Formatted Text
		URL: 1,							// Browse to a Website
		BOOKMARK: 2,					// Bookmark a Website
		CALL: 3,						// Make a Phone Call
		SMS: 4,							// Send an SMS
		EMAIL: 5,						// Send an E-Mail
		VCARD: 6,						// Create a vCard
		MECARD: 7,						// Create a meCard
		VEVENT: 8,						// Create a vCalendar Event
		GOOGLE_MAPS: 9,					// Googlem Maps
		BING_MAPS: 10,					// Bing Maps
		GEO: 11,						// Geographical Coordinates
		ITUNES: 12,						// iTunes App URL
		ITUNES_REVIEW: 13,				// iTunes App Review URL
		ANDROID_MARKET: 14,				// Android Market Search
		FACEBOOK_USER_PROFILE: 15,		// Facebook User Profile
		FOURSQUARE: 16,					// Foursquare Venue URL
		TWEET_FETCH: 17,				// Encode Latest Tweet of a User
		TWEET: 18,						// Tweet on Twitter
		BLACKBERRY_MESSENGER_USER: 19,	// Create Blackberry Messenger User
		ANDROID_WIFI: 20,				// WIFI Network for Android
		WIKIPEDIA: 21,					// Wikipedia Article URL
		YOUTUBE_USER: 22,				// Youtube User Videos
		YOUTUBE_VIDEO: 23,				// Youtube Video URL for iPhone
		BITCOIN: 24						// Bitcoin
	};

	Input.prototype.toString = function () {
		var	_this = this,
			str, tmp, replaceObj;

		switch (this.dataType) {
			case this.DATA_TYPE.DEFAULT:
			case this.DATA_TYPE.TEXT:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.text', 'string', 'number');
					validateRequired('data.text');
					return dataStr('text');
				} else { // string or number
					validateRequired('data');
					return dataStr();
				}

			case this.DATA_TYPE.URL:
				validateType('data', 'string', 'object');
				if (typeof this.data === 'object') {
					validateType('data.url', 'string');
					validateRequired('data.url');
					return (/^[a-zA-Z]+:\/\//.test(dataStr('url')) ? '' : 'http://') + dataStr('url');
				} else { // string
					validateRequired('data');
					return (/^[a-zA-Z]+:\/\//.test(dataStr()) ? '' : 'http://') + dataStr();
				}

			case this.DATA_TYPE.BOOKMARK:
				// https://www.nttdocomo.co.jp/english/service/developer/make/content/barcode/function/application/bookmark/
				validateType('data', 'object');
				validateType('data.title', 'string', 'number');
				validateType('data.url', 'string');
				validateRequired('data.title', 'data.url');

				return 'MEBKM:TITLE:' + dataStr('title') + ';URL:' + (/^[a-zA-Z]+:\/\//.test(dataStr('url')) ? '' : 'http://') + dataStr('url');

			case this.DATA_TYPE.CALL:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.phoneNumber', 'string', 'number');
					validateRequired('data.phoneNumber');
					return 'TEL:' + dataStr('phoneNumber');
				} else { // string or number
					validateRequired('data');
					return 'TEL:' + dataStr();
				}

			case this.DATA_TYPE.SMS:
				validateType('data', 'object');
				validateType('data.phoneNumber', 'string', 'number');
				validateType('data.message', 'string', 'number');
				validateRequired('data.phoneNumber');

				return 'SMSTO:' + dataStr('phoneNumber') + ':' + dataStr('message');

			case this.DATA_TYPE.EMAIL:
				// MATMSG: http://www.nttdocomo.co.jp/english/service/imode/make/content/barcode/function/application/mail/
				validateType('data', 'object');
				validateType('data.recipient', 'string');
				validateType('data.subject', 'string');
				validateType('data.body', 'string');
				validateRequired('data.recipient');

				// return 'MATMSG:TO:' + dataStr('recipient') + ';SUB:' + dataStr('subject') + ';BODY:' + dataStr('body');
				return 'SMTP:' + dataStr('recipient').replace(':', '') + ':' + dataStr('subject').replace(/:/g, '\\:') + ':' + dataStr('body');

			case this.DATA_TYPE.VCARD:
				// http://tools.ietf.org/html/rfc2426
				validateType('data', 'object');
				validateType('data.version', 'string', 'number');
				validateType('data.type', 'string');
				validateType('data.firstName', 'string', 'number');
				validateType('data.middleName', 'string', 'number');
				validateType('data.lastName', 'string', 'number');
				validateType('data.organization', 'string', 'number');
				validateType('data.title', 'string', 'number');
				validateType('data.mobilePhone', 'string', 'number');
				validateType('data.work', 'object');
				validateType('data.work.street', 'string', 'number');
				validateType('data.work.city', 'string');
				validateType('data.work.zip', 'string', 'number');
				validateType('data.work.state', 'string');
				validateType('data.work.country', 'string');
				validateType('data.work.phone', 'string', 'number');
				validateType('data.work.fax', 'string', 'number');
				validateType('data.work.eMail', 'string');
				validateType('data.work.url', 'string');
				validateType('data.home', 'object');
				validateType('data.home.street', 'string', 'number');
				validateType('data.home.city', 'string', 'number');
				validateType('data.home.zip', 'string', 'number');
				validateType('data.home.state', 'string', 'number');
				validateType('data.home.country', 'string');
				validateType('data.home.phone', 'string', 'number');
				validateType('data.home.eMail', 'string');
				validateType('data.home.url', 'string');
				validateType('data.birthday', Date, null);
				validateRequired('data.version', 'data.type');

				replaceObj = {
					'\\':'\\\\',
					';':'\\;',
					',':'\\,',
					'\n':'\\n'
				};

				str = [];

				switch (parseFloat(dataStr('version'))) {
					case 2.1:
						str[0] = '2.1';
						break;
					case 3:
						str[0] = '3.0';
						break;
					default:
						throw new Error('Unsupported VCARD.version (' + dataStr('version') + ')');
				}

				switch (dataStr('type').toLowerCase()) {
					case 'person':
						str[1] = (dataStr('firstName').length > 0 || dataStr('middleName').length > 0 || dataStr('lastName').length > 0 ? 'FN:' + (translateChars(dataStr('firstName'), replaceObj) + ' ' + translateChars(dataStr('middleName'), replaceObj) + ' ' + translateChars(dataStr('lastName'), replaceObj)).replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '') + '\n' : '') +
							(dataStr('organization').length > 0 ? 'ORG:' + translateChars(dataStr('organization'), replaceObj) + '\n' : '');
						break;
					case 'company':
						str[1] = (dataStr('organization').length > 0 ? 'ORG:' + translateChars(dataStr('organization'), replaceObj) + '\n' : '') +
							(dataStr('organization').length > 0 ? 'FN:' + translateChars(dataStr('organization'), replaceObj) + '\n' : '') +
							'X-ABShowAs:COMPANY\n';
						break;
					default:
						throw new Error('Unsupported VCARD.type (' + dataStr('type') + ')');
				}

				return 'BEGIN:VCARD\n' +
					'VERSION:' + str[0] + '\n' +
					(dataStr('lastName').length > 0 || dataStr('firstName').length > 0 || dataStr('middleName').length > 0 ? 'N:' + translateChars(dataStr('lastName'), replaceObj) + ';' + translateChars(dataStr('firstName'), replaceObj) + ';' + translateChars(dataStr('middleName'), replaceObj) + ';;\n' : '') +
					str[1] +
					(dataStr('title').length > 0 ? 'TITLE:' + translateChars(dataStr('title'), replaceObj) + '\n' : '') +
					(data('work') && dataStr('work.eMail').length > 0 ? 'EMAIL;' + (str[0] === '3.0' ? 'type=INTERNET;type=' : 'INTERNET;') + 'WORK:' + translateChars(dataStr('work.eMail'), replaceObj) + '\n' : '') +
					(data('home') && dataStr('home.eMail').length > 0 ? 'EMAIL;' + (str[0] === '3.0' ? 'type=INTERNET;type=' : 'INTERNET;') + 'HOME:' + translateChars(dataStr('home.eMail'), replaceObj) + '\n' : '') +
					(dataStr('mobilePhone').length > 0 ? 'TEL;' + (str[0] === '3.0' ? 'type=' : '') + 'CELL:' + translateChars(dataStr('mobilePhone'), replaceObj) + '\n' : '') +
					(data('work') && dataStr('work.phone').length > 0 ? 'TEL;' + (str[0] === '3.0' ? 'type=' : '') + 'WORK:' + translateChars(dataStr('work.phone'), replaceObj) + '\n' : '') +
					(data('home') && dataStr('home.phone').length > 0 ? 'TEL;' + (str[0] === '3.0' ? 'type=' : '') + 'HOME:' + translateChars(dataStr('home.phone'), replaceObj) + '\n' : '') +
					(data('work') && dataStr('work.fax').length > 0 ? 'TEL;' + (str[0] === '3.0' ? 'type=WORK,' : 'WORK;') + 'FAX:' + translateChars(dataStr('work.fax'), replaceObj) + '\n' : '') +
					(data('work') && (dataStr('work.street').length > 0 || dataStr('work.city').length > 0 || dataStr('work.state').length > 0 || dataStr('work.zip').length > 0 || dataStr('work.country').length > 0) ? 'ADR;' + (str[0] === '3.0' ? 'type=' : '') + 'WORK:;;' + translateChars(dataStr('work.street'), replaceObj) + ';' + translateChars(dataStr('work.city'), replaceObj) + ';' + translateChars(dataStr('work.state'), replaceObj) + ';' + translateChars(dataStr('work.zip'), replaceObj) + ';' + translateChars(dataStr('work.country'), replaceObj) + '\n' : '') +
					(data('home') && (dataStr('home.street').length > 0 || dataStr('home.city').length > 0 || dataStr('home.state').length > 0 || dataStr('home.zip').length > 0 || dataStr('home.country').length > 0) ? 'ADR;' + (str[0] === '3.0' ? 'type=' : '') + 'HOME:;;' + translateChars(dataStr('home.street'), replaceObj) + ';' + translateChars(dataStr('home.city'), replaceObj) + ';' + translateChars(dataStr('home.state'), replaceObj) + ';' + translateChars(dataStr('home.zip'), replaceObj) + ';' + translateChars(dataStr('home.country'), replaceObj) + '\n' : '') +
					(data('birthday') && data('birthday') !== null ? 'BDAY;value=date:' + data('birthday').getFullYear() + ('0' + (data('birthday').getMonth() + 1)).substr(-2) + ('0' + data('birthday').getDate()).substr(-2) + ';' : '') +
					(data('work') && dataStr('work.url').length > 0 ? 'URL;' + (str[0] === '3.0' ? 'type=' : '') + 'WORK:' + translateChars(dataStr('work.url'), replaceObj) + '\n' : '') +
					(data('home') && dataStr('home.url').length > 0 ? 'URL;' + (str[0] === '3.0' ? 'type=' : '') + 'HOME:' + translateChars(dataStr('home.url'), replaceObj) + '\n' : '') +
					'END:VCARD';

			case this.DATA_TYPE.MECARD:
				// http://www.nttdocomo.co.jp/english/service/imode/make/content/barcode/function/application/addressbook/index.html
				// http://www.nttdocomo.co.jp/english/service/imode/make/content/barcode/function/application/common/
				validateType('data', 'object');
				validateType('data.firstName', 'string', 'number');
				validateType('data.lastName', 'string', 'number');
				validateType('data.eMail', 'string');
				validateType('data.phoneNumber', 'string', 'number');
				validateType('data.videoCall', 'string', 'number');
				validateType('data.birthday', Date, null);
				validateType('data.poBox', 'string', 'number');
				validateType('data.room', 'string', 'number');
				validateType('data.street', 'string', 'number');
				validateType('data.city', 'string');
				validateType('data.state', 'string');
				validateType('data.zip', 'string', 'number');
				validateType('data.country', 'string');
				validateType('data.url', 'string', 'number');
				validateType('data.memo', 'string', 'number');

				replaceObj = {
					'\\':'\\\\',
					':':'\\:',
					';':'\\;',
					',':'\\,'
				};

				return 'MECARD:' +
					(dataStr('lastName').length > 0 || dataStr('firstName') > 0 ? 'N:' + translateChars(dataStr('lastName'), replaceObj) + (dataStr('firstName').length > 0 ? ',' + translateChars(dataStr('firstName'), replaceObj) : '') + ';' : '') +
					(dataStr('phoneNumber').length > 0 ? 'TEL:' + translateChars(dataStr('phoneNumber'), replaceObj) + ';' : '') +
					(dataStr('videoCall').length > 0 ? 'TEL-AV:' + translateChars(dataStr('videoCall'), replaceObj) + ';' : '') +
					(dataStr('eMail').length > 0 ? 'EMAIL:' + translateChars(dataStr('eMail'), replaceObj) + ';' : '') +
					(dataStr('url').length > 0 ? 'URL:' + translateChars(dataStr('url'), replaceObj) + ';' : '') +
					(dataStr('memo').length > 0 ? 'NOTE:' + translateChars(dataStr('memo'), replaceObj) + ';' : '') +
					(data('birthday') && data('birthday') !== null ? 'BDAY:' + data('birthday').getFullYear() + ('0' + (data('birthday').getMonth() + 1)).substr(-2) + ('0' + data('birthday').getDate()).substr(-2) + ';' : '') +
					(dataStr('street').length > 0 ? 'ADR:' + translateChars(dataStr('poBox'), replaceObj) + ',' + translateChars(dataStr('room'), replaceObj) + ',' + translateChars(dataStr('street'), replaceObj) + ',' + translateChars(dataStr('city'), replaceObj) + ',' + translateChars(dataStr('state'), replaceObj) + ',' + translateChars(dataStr('zip'), replaceObj) + ',' + translateChars(dataStr('country'), replaceObj) + ';' : '') +
					';';

			case this.DATA_TYPE.VEVENT:
				// http://tools.ietf.org/html/rfc5545
				validateType('data', 'object');
				validateType('data.format', 'string');
				validateType('data.summary', 'string', 'number');
				validateType('data.description', 'string', 'number');
				validateType('data.locationName', 'string', 'number');
				validateType('data.fullDay', 'boolean');
				validateType('data.startDate', Date);
				validateType('data.endDate', Date);
				validateRequired('data.format', 'data.summary', 'data.fullDay', 'data.startDate', 'data.endDate');

				if (Date.parse(dataStr('startDate')) > Date.parse(dataStr('endDate'))) {
					throw new RangeError('VEVENT.startDate must be older than VEVENT.endDate');
				}

				replaceObj = {
					'\\':'\\\\',
					';':'\\;',
					',':'\\,',
					'\n':'\\n'
				};

				str = 'BEGIN:VEVENT\n' +
					'SUMMARY:' + translateChars(dataStr('summary'), replaceObj) + '\n' +
					(dataStr('description').length > 0 ? 'DESCRIPTION:' + translateChars(dataStr('description'), replaceObj) + '\n' : '') +
					(dataStr('locationName').length > 0 ? 'LOCATION:' + translateChars(dataStr('locationName'), replaceObj) + '\n' : '') +
					'DTSTART:' + data('startDate').getFullYear() + ('0' + (data('startDate').getMonth() + 1)).substr(-2) + ('0' + data('startDate').getDate()).substr(-2) + (!data('fullDay') ? 'T' + ('0' + data('startDate').getHours()).substr(-2) + ('0' + data('startDate').getMinutes()).substr(-2) + ('0' + data('startDate').getSeconds()).substr(-2) : '') + '\n' +
					'DTEND:' + data('endDate').getFullYear() + ('0' + (data('endDate').getMonth() + 1)).substr(-2) + ('0' + data('endDate').getDate()).substr(-2) + (!data('fullDay') ? 'T' + ('0' + data('endDate').getHours()).substr(-2) + ('0' + data('endDate').getMinutes()).substr(-2) + ('0' + data('endDate').getSeconds()).substr(-2) : '') + '\n' +
					'END:VEVENT';

				switch (dataStr('format').toLowerCase()) {
					case 'icalendar':	// iCalendar
						return 'BEGIN:VCALENDAR\n' +
							'VERSION:2.0\n' +
							str + '\n' +
							'END:VCALENDAR';
					case 'zxing':	// ZXing
						return str;
					default:
						throw new Error('Unsupported VEVENT.format (' + dataStr('format') + ')');
				}

			case this.DATA_TYPE.GOOGLE_MAPS:
				validateType('data', 'object');
				validateType('data.locationName', 'string');
				validateType('data.longitude', 'string', 'number');
				validateType('data.latitude', 'string', 'number');
				validateRequired('data.longitude', 'data.latitude');

				return 'http://maps.google.com/maps?f=q&q=' + dataStr('latitude') + '%2C' + dataStr('longitude') + '+%28' + encodeURIComponent(dataStr('locationName')) + '%29';

			case this.DATA_TYPE.BING_MAPS:
				validateType('data', 'object');
				validateType('data.longitude', 'string', 'number');
				validateType('data.latitude', 'string', 'number');
				validateRequired('data.longitude', 'data.latitude');

				return 'http://www.bing.com/maps/?v=2&cp=' + dataStr('latitude') + '~' + dataStr('longitude') + '&lvl=16&dir=0&sty=r';

			case this.DATA_TYPE.GEO:
				validateType('data', 'object');
				validateType('data.longitude', 'string', 'number');
				validateType('data.latitude', 'string', 'number');
				validateRequired('data.longitude', 'data.latitude');

				return 'GEO:' + dataStr('latitude') + ',' + dataStr('longitude');

			case this.DATA_TYPE.ITUNES:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.appId', 'string', 'number');
					validateRequired('data.appId');
					str = dataStr('appId');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				if (!(/\d+$/).test(str)) {
					throw new Error('Invalid ITUNES.appId. The id must be numeric');
				}
				return 'http://itunes.apple.com/app/id' + (/\d+$/).exec(str)[0];

			case this.DATA_TYPE.ITUNES_REVIEW:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.appId', 'string', 'number');
					validateRequired('data.appId');
					str = dataStr('appId');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				if (!(/\d+$/).test(str)) {
					throw new Error('Invalid ITUNES.appId. The id must be numeric');
				}
				return 'itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=' + (/\d+$/).exec(str)[0];

			case this.DATA_TYPE.ANDROID_MARKET:
				// http://developer.android.com/guide/publishing/publishing.html

				validateType('data', 'object');
				validateType('data.searchType', 'string');
				validateType('data.linkType', 'string');
				validateType('data.search', 'string', 'number');
				validateRequired('data.searchType', 'data.linkType', 'data.search');

				switch (dataStr('linkType').toLowerCase()) {
					case 'market':
						str = 'market://';
						break;
					case 'website':
						str = 'http://market.android.com/';
						break;
					default:
						throw new Error('Unsupported ANDROID_MARKET.linkType (' + dataStr('linkType') + ')');
				}

				switch (dataStr('searchType').toLowerCase()) {
					case 'raw':
						return str + 'search?q=' + encodeURIComponent(dataStr('search'));
					case 'package':
						return str + 'search?q=pname%3A' + encodeURIComponent(dataStr('search'));
					case 'publisher':
						return str + 'search?q=pub%3A' + encodeURIComponent(dataStr('search'));
					case 'details':
						return str + 'details?id=' + encodeURIComponent(dataStr('search'));
					default:
						throw new Error('Unsupported ANDROID_MARKET.searchType (' + dataStr('searchType') + ')');
				}

			case this.DATA_TYPE.FACEBOOK_USER_PROFILE:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.profileId', 'string', 'number');
					validateRequired('data.profileId');
					str = dataStr('profileId');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				if ((/^\d{15}$/).test(str)){
					return 'fb://profile/' + str;
				} else if ((/(\/profile\/|(\?|&)id=)(\d{15})(%26|&|$)/).test(str)) {
					return 'fb://profile/' + (/(\/profile\/|(\?|&)id=)(\d{15})(%26|&|$)/).exec(str)[3];
				}
				throw new Error('Invalid FACEBOOK_USER_PROFILE.videoId. The id must be numeric, 15 characters in length');

			case this.DATA_TYPE.FOURSQUARE:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.venueId', 'string', 'number');
					validateRequired('data.venueId');
					str = dataStr('venueId');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}
				if (!(/\d+$/).test(str)) {
					throw new Error('Invalid FOURSQUARE.venueId. The id must be numeric');
				}
				return 'http://foursquare.com/venue/' + (/\d+$/).exec(str)[0];

			case this.DATA_TYPE.WIKIPEDIA:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.url', 'string', 'number');
					validateRequired('data.url');
					str = dataStr('url');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				replaceObj = {
					' ':'_'
				};

				tmp = (/\/\/([a-z\-]*)\.?wikipedia.org\/wiki\/(.*)/i).exec(str);
				if (tmp === null || tmp.length !== 3) {
					return 'http://qrwp.org/' + translateChars(str, replaceObj);
				} else {
					return 'http://' + (tmp[1].length > 0 ? tmp[1] + '.' : '') + 'qrwp.org/' + translateChars(tmp[2], replaceObj);
				}

			case this.DATA_TYPE.YOUTUBE_USER:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.userName', 'string', 'number');
					validateRequired('data.userName');
					str = dataStr('userName');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				return 'http://youtube.com/user/' + str;

			case this.DATA_TYPE.YOUTUBE_VIDEO:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.videoId', 'string', 'number');
					validateRequired('data.videoId');
					str = dataStr('videoId');
				} else { // string or number
					validateRequired('data');
					str = dataStr();
				}

				if ((/^[-_A-Za-z0-9]+$/).test(str)){
					return 'youtube://' + str;
				} else if ((/(youtu.be\/|(\?|&)v=|\/v\/)([-_A-Za-z0-9]+)(%26|&|$)/).test(str)) {
					return 'youtube://' + (/(youtu.be\/|(\?|&)v=|\/v\/)([-_A-Za-z0-9]+)(%26|&|$)/).exec(str)[3];
				}
				throw new Error('Invalid YOUTUBE.videoId. The id must be alphanumeric');

			case this.DATA_TYPE.TWEET_FETCH:
				throw new Error('DATA_TYPE.TWEET_FETCH is currently unsupported');

			case this.DATA_TYPE.TWEET:
				validateType('data', 'string', 'number', 'object');
				if (typeof this.data === 'object') {
					validateType('data.text', 'string', 'number');
					validateRequired('data.text');
					return 'http://twitter.com/home?status=' + encodeURIComponent(dataStr('text'));
				} else { // string or number
					validateRequired('data');
					return 'http://twitter.com/home?status=' + encodeURIComponent(dataStr());
				}

			case this.DATA_TYPE.BLACKBERRY_MESSENGER_USER:
				validateType('data', 'object');
				validateType('data.firstName', 'string');
				validateType('data.lastName', 'string');
				validateType('data.bbmPin', 'string');
				validateRequired('data.bbmPin');

				if (!(/^[A-Za-z0-9]{8}$/).test(dataStr('bbmPin'))) {
					throw new Error('Invalid BLACKBERRY_MESSENGER_USER.bbmPin. The pin must be alphanumeric, eight characters in length');
				}
				return 'bbm:' + dataStr('bbmPin') + '00000000' + dataStr('firstName') + ' ' + dataStr('lastName');

			case this.DATA_TYPE.ANDROID_WIFI:
				validateType('data', 'object');
				validateType('data.ssid', 'string');
				validateType('data.password', 'string', 'number');
				validateType('data.networkType', 'string');
				validateRequired('data.ssid', 'data.networkType');

				return 'WIFI:S:' + dataStr('ssid') +
					';T:' + dataStr('networkType') +
					(dataStr('password').length > 0 ? ';P:' + dataStr('password') : '') +
					';;';

			case this.DATA_TYPE.BITCOIN:
				validateType('data', 'string', 'object');
				if (typeof this.data === 'object') {
					validateType('data.hash', 'string');
					validateRequired('data.hash');
					return (/^bitcoin:/.test(dataStr('hash')) ? '' : 'bitcoin:') + dataStr('hash');
				} else { // string
					validateRequired('data');
					return (/^bitcoin:/.test(dataStr()) ? '' : 'bitcoin:') + dataStr();
				}

			default:
				throw new TypeError('Unsupported dataType');
		}

		function data (propsPath) {
			var prop = _this.data;

			if (typeof propsPath === 'string') {
				var	props = propsPath.split('.'), i;

				for (i = 0; i < props.length; i++) {
					prop = prop[props[i]];
				}
			}
			return prop;
		}

		function dataStr (propsPath) {
			var dat = data(propsPath);
			return (typeof dat === 'undefined' ? '' : dat.toString());
		}

		function translateChars (str, replaceObj) {
			for (var r in replaceObj) {
				if (replaceObj.hasOwnProperty(r)) {
					str = str.replace(r, replaceObj[r], 'g');
				}
			}
			return str;
		}

		function validateType () {
			var	props = arguments[0].split('.'),
				prop = _this, i;

			for (i = 0; i < props.length; i++) {
				prop = prop[props[i]];
			}
			for (i = 1; i < arguments.length; i++) {
				if ((typeof prop === 'object' && typeof arguments[i] === 'function' && prop !== null && prop.constructor === arguments[i]) || (prop === null && arguments[i] === null) || (typeof prop === arguments[i])) {
					return true;
				}
				if (typeof arguments[i] === 'function') {
					arguments[i] = arguments[i].name;
				}
			}
			if (typeof prop === 'undefined') {
				throw new TypeError(arguments[0] + ' is undefined');
			} else {
				throw new TypeError('Unexcepted type (' + typeof prop + ') of ' + arguments[0] + ' (' + [].slice.call(arguments, 1).join('|') + ')');
			}
		}

		// Throws an error if a property is a string, but contains no characters.
		function validateRequired () {
			var props, prop, i, j;

			for (i = 0; i < arguments.length; i++) {
				props = arguments[i].split('.');
				prop = _this;

				for (j = 0; j < props.length; j++) {
					prop = prop[props[j]];
				}

				if (typeof prop === 'string' && prop.length === 0) {
					throw new Error(arguments[i] + ' cannot be empty');
				}
			}
		}
	};

	var Code = function (encodeMode, version, errorCorrection) {
		if (typeof encodeMode === 'object' && typeof version === 'undefined' && typeof errorCorrection === 'undefined') {
			errorCorrection = encodeMode.errorCorrection;
			version = encodeMode.version;
			encodeMode = encodeMode.encodeMode;
		}

		if (typeof encodeMode !== 'undefined') {
			if (!isEnumValue(this.ENCODE_MODE, encodeMode)) {
				throw new TypeError('Unsupported encodeMode');
			}
		} else {
			encodeMode = this.ENCODE_MODE.UTF8;
		}
		try {
			Object.defineProperty(this, 'encodeMode', {
				configurable: false,
				writeable: true,
				get: function () { return encodeMode; },
				set: function (value) {
					if (isEnumValue(this.ENCODE_MODE, value)) {
						encodeMode = value;
					} else {
						throw new TypeError('Unsupported encodeMode');
					}
				}
			});
		} catch (e) {
			this.encodeMode = encodeMode;
		}

		if (typeof version !== 'undefined') {
			if (typeof version !== 'number') {
				throw new TypeError('Invalid version type');
			} else if (version < -40 || version > 40) {
				throw new RangeError('Invalid version value');
			}
		} else {
			version = this.DEFAULT;
		}
		try {
			Object.defineProperty(this, 'version', {
				configurable: false,
				writeable: true,
				get: function () { return version; },
				set: function (value) {
					if (typeof value !== 'number') {
						throw new TypeError('Invalid version type');
					} else if (value < -40 || value > 40) {
						throw new RangeError('Invalid version value');
					} else {
						version = value;
					}
				}
			});
		} catch (e) {
			this.version = version;
		}

		if (typeof errorCorrection !== 'undefined') {
			if (!isEnumValue(this.ERROR_CORRECTION, errorCorrection)) {
				throw new TypeError('Invalid errorCorrection');
			}
		} else {
			errorCorrection = this.ERROR_CORRECTION.M;
		}
		try {
			Object.defineProperty(this, 'errorCorrection', {
				configurable: false,
				writeable: true,
				get: function () { return errorCorrection; },
				set: function (value) {
					if (isEnumValue(this.ERROR_CORRECTION, value)) {
						errorCorrection = value;
					} else {
						throw new TypeError('Invalid errorCorrection');
					}
				}
			});
		} catch (e) {
			this.errorCorrection = errorCorrection;
		}
	};

	Code.prototype.ENCODE_MODE = {
		NUMERIC: 1,				// Numeric Mode [0-9]
		ALPHA_NUMERIC: 2,		// Alphanumeric Mode [A-Z0-9 $%*+-./:]
		BYTE: 4,				// 8-bit Byte Mode (JIS X 0201)
		UTF8: 0x14,				// 8-bit Byte Mode (UTF-8)
		UTF8_SIGNATURE: 0x24,	// 8-bit Byte Mode (UTF-8 with Signature)

		// UNSUPPORTED
		STRUCTURED_APPEND: 3,	// Structured Append Mode
		FNC1_POS1: 5,			// FNC1 Mode (First Position)
		ECI: 7,					// Extended Channel Interpretation (ECI) Mode
		KANJI: 8,				// Kanji Mode (Shift JIS/JIS X 0208)
		FNC1_POS2: 9			// FNC1 Mode (Second Position)
	};

	Code.prototype.ERROR_CORRECTION = {
		L: 1,					// Low
		M: 0,
		Q: 3,
		H: 2					// High
	};

	Code.prototype.DEFAULT = 0;

	// Returns the currently used version (if this.version is negative or zero, the value will differ from it)
	Code.prototype.getVersion = function (input) {
		if (this.version > 0) {
			return this.version;
		} else {
			return encodeMatrix(processInput(input, this), this, true);
		}
	};

	// Returns the at least required version (this.version is ignored)
	Code.prototype.getMinVersion = function (input) {
		var code = new Code(this.encodeMode, this.DEFAULT, this.errorCorrection);
		return encodeMatrix(processInput(input, code), code, true);
	};

	var Matrix = function (input, code) {
		var matrix, i,
			_this = this;

		matrix = encodeMatrix(processInput(input, code), code);

		for (i = 0; i < matrix.length; i++) {
			this[i] = matrix[i];
		}

		try {
			Object.defineProperty(this, 'scale', {
				configurable: false,
				writeable: true,
				get: function () { return scale; },
				set: function (value) {
					if (typeof value !== 'number') {
						throw new TypeError('Invalid scale type');
					} else if (value <= 0 || value > 256) {
						throw new RangeError('Scale value out of range');
					} else {
						scale = value;
					}
				}
			});

			var scale = 4;
		} catch (e) {
			this.scale = 4;
		}

		try {
			Object.defineProperty(this, 'margin', {
				configurable: false,
				writeable: true,
				get: function () { return margin; },
				set: function (value) {
					if (typeof value !== 'number') {
						throw new TypeError('Invalid margin type');
					} else if (value < 0 || value > 256) {
						throw new RangeError('Margin value out of range');
					} else {
						margin = value;
					}
				}
			});

			var margin = 4;
		} catch (e) {
			this.margin = 4;
		}

		try {
			Object.defineProperty(this, 'color1', {
				configurable: false,
				writeable: true,
				get: function () { return color1; },
				set: function (value) {
					if (typeof value === 'string') {
						color1 = value;
					} else {
						throw new TypeError('Invalid color1 type');
					}
				}
			});

			var color1 = 'rgb(0,0,0)';
		} catch (e) {
			this.color1 = 'rgb(0,0,0)';
		}

		try {
			Object.defineProperty(this, 'color0', {
				configurable: false,
				writeable: true,
				get: function () { return color0; },
				set: function (value) {
					if (typeof value === 'string') {
						color0 = value;
					} else {
						throw new TypeError('Invalid color2 type');
					}
				}
			});

			var color0 = 'none';
		} catch (e) {
			this.color0 = 'none';
		}

		try {
			Object.defineProperty(this, 'length', {
				configurable: false,
				writeable: false,
				get: function () {
					return matrix.length;
				}
			});
		} catch (e) {
			this.length = new function () {
				this.toString = function () {
					return matrix.length;
				};
			};
		}

		try {
			Object.defineProperty(this, 'width', {
				configurable: false,
				writeable: false,
				get: function () {
					return matrix.length + (_this.margin << 1);
				}
			});
		} catch (e) {
			this.width = new function () {
				this.toString = function () {
					return matrix.length + (_this.margin << 1);
				};
			};
		}

		try {
			Object.defineProperty(this, 'pixelWidth', {
				configurable: false,
				writeable: false,
				get: function () {
					return (matrix.length + (_this.margin << 1)) * _this.scale;
				}
			});
		} catch (e) {
			this.pixelWidth = new function () {
				this.toString = function () {
					return (matrix.length + (_this.margin << 1)) * _this.scale;
				};
			};
		}

		/* *********** */

		this.draw = function (canvas, left, top) {
			var	context = canvas.getContext('2d'),
				scale = this.scale,
				margin = this.margin,
				x, y;

			for (y = 0; y < matrix.length; y++) {
				for (x = 0; x < matrix[y].length; x++) {
					if (matrix[y][x]) {
						context.fillRect(left + (x + margin) * scale, top + (y + margin) * scale, scale, scale);
					}
				}
			}
		};

		/*
			If not specified elsewise, the default tag type for the pixel-elements is DIV.
			Make sure pixel-elements in the output-container are block elements and have no margin, padding, border, outline or anything else which could affect the layout of the div-blocks.
			If the boolean value positionOnly is not set, "position:absolute" and "background" is set for each tag. It's recommend to set this positionOnly to "true" and set these CSS properties using a CSS selector (#out div div { ... }) to improve the speed.
			This function use a horizontal RLE compression to keep the number of required DIV-elements smaller. The compression ratio is about 1:2.
			A compression ratio of 1:3 would be possible, if we would addionally use a vertical RLE, but this would require much more complex code.

			Example:          horizontal RLE:   horizontal + vertical RLE:
			********          --------          --------
			*      *          -      -          |      |
			* **** *          - ---- -          | ++++ |
			* **** *          - ---- -          | ++++ |
			* **** *          - ---- -          | ++++ |
			* **** *          - ---- -          | ++++ |
			*      *          -      -          |      |
			********          --------          |------|
			44 DIVs           12 DIVs           5 DIVs
			(here, the compression ratio is higher, because of the simple structure of the block)
		*/
		this.drawHTML = function (container, tagName, positionOnly) {
			tagName = tagName || 'div';

			var	scale = this.scale,
				margin = this.margin,
				background = this.color1,
				html = '<div style="position:relative; background:' + this.color2 + '">',
				x, y, xW;

			for (y = 0; y < matrix.length; y++) {
				for (x = 0; x < matrix.length; x = x + xW) {
					xW = 1;
					if (matrix[y][x] === 1) {
						while (x + xW < matrix.length && matrix[y][x + xW] === 1) { xW ++; }
						if (positionOnly) {
							// Faster but requires a additional stylesheet (#out div div { position:absolute; background:#000; height:4px; }):
							html += '<' + tagName + ' style="width:' + (xW * scale) + 'px; height:' + scale + 'px; left:' + ((x + margin) * scale) + 'px; top:' + ((y + margin) * scale) + 'px;"></' + tagName + '>';
						} else {
							html += '<' + tagName + ' style="position:absolute; width:' + (xW * scale) + 'px; height:' + scale + 'px; left:' + ((x + margin) * scale) + 'px; top:' + ((y + margin) * scale) + 'px; background:' + background + ';"></' + tagName + '>';
						}
					}
				}
			}
			html += + '</div>';

			if (container && typeof container.innerHTML != 'undefined') {
				container.innerHTML = html;
			}
			return html;
		};

		this.toDataURL = function () {
		};

		this.toSVG = function () {
		};

		this.toArray = function () {
			var x, y, arr = typedArray(matrix.length + (margin << 1), 0);

			for (y = 0; y < matrix.length; y++) {
				arr[y + margin] = typedArray(matrix[y].length + (margin << 1), 0);
				for (x = 0; x < matrix[y].length; x++) {
					arr[y + margin][x + margin] = matrix[y][x];
				}
			}
			return arr;
		};

		this.toString = function () {
			return this.toArray().toString();
		};
	};

	// ==== Private Constants =================================================

	var	/* Should be "const", but the IE doesn't support that */
		VI = {										// Describing the versionInfo-Array
			TOTAL_BYTES: 0,							// Total data bytes
			REMAINDER_BITS: 1,						// Number of Remainder bits
			ECC_BYTES: 2,							// Number of ECC bytes [M, L, H, Q]
			EC_BLOCKS: 3,							// Number of Error Correction Blocks [Short, Long]
			ALIGNMENT_PATTERN_POSITION_OFFSET: 4,	// Alignment Pattern position offsets
			VERSION_PATTERN: 5						// Version Information Pattern
		},
		versionInfo = [
			null,
			[  26, 0, [  10,   7,   17,   13], [[ 1,  0], [ 1,  0], [ 1,  0], [ 1,  0]],  0, null],		// 1
			[  44, 7, [  16,  10,   28,   22], [[ 1,  0], [ 1,  0], [ 1,  0], [ 1,  0]], 12, null],
			[  70, 7, [  26,  15,   44,   36], [[ 1,  0], [ 1,  0], [ 2,  0], [ 2,  0]], 16, null],
			[ 100, 7, [  36,  20,   64,   52], [[ 2,  0], [ 1,  0], [ 4,  0], [ 2,  0]], 20, null],
			[ 134, 7, [  48,  26,   88,   72], [[ 2,  0], [ 1,  0], [ 2,  2], [ 2,  2]], 24, null],		// 5
			[ 172, 7, [  64,  36,  112,   96], [[ 4,  0], [ 2,  0], [ 4,  0], [ 4,  0]], 28, null],
			[ 196, 0, [  72,  40,  130,  108], [[ 4,  0], [ 2,  0], [ 4,  1], [ 2,  4]], 16, 0x07c94],
			[ 242, 0, [  88,  48,  156,  132], [[ 2,  2], [ 2,  0], [ 4,  2], [ 4,  2]], 18, 0x085bc],
			[ 292, 0, [ 110,  60,  192,  160], [[ 3,  2], [ 2,  0], [ 4,  4], [ 4,  4]], 20, 0x09a99],
			[ 346, 0, [ 130,  72,  224,  192], [[ 4,  1], [ 2,  2], [ 6,  2], [ 6,  2]], 22, 0x0a4d3],	// 10
			[ 404, 0, [ 150,  80,  264,  224], [[ 1,  4], [ 4,  0], [ 3,  8], [ 4,  4]], 24, 0x0bbf6],
			[ 466, 0, [ 176,  96,  308,  260], [[ 6,  2], [ 2,  2], [ 7,  4], [ 4,  6]], 26, 0x0c762],
			[ 532, 0, [ 198, 104,  352,  288], [[ 8,  1], [ 4,  0], [12,  4], [ 8,  4]], 28, 0x0d847],
			[ 581, 3, [ 216, 120,  384,  320], [[ 4,  5], [ 3,  1], [11,  5], [11,  5]], 20, 0x0e60d],
			[ 655, 3, [ 240, 132,  432,  360], [[ 5,  5], [ 5,  1], [11,  7], [ 5,  7]], 22, 0x0f928],	// 15
			[ 733, 3, [ 280, 144,  480,  408], [[ 7,  3], [ 5,  1], [ 3, 13], [15,  2]], 24, 0x10b78],
			[ 815, 3, [ 308, 168,  532,  448], [[10,  1], [ 1,  5], [ 2, 17], [ 1, 15]], 24, 0x1145d],
			[ 901, 3, [ 338, 180,  588,  504], [[ 9,  4], [ 5,  1], [ 2, 19], [17,  1]], 26, 0x12a17],
			[ 991, 3, [ 364, 196,  650,  546], [[ 3, 11], [ 3,  4], [ 9, 16], [17,  4]], 28, 0x13532],
			[1085, 3, [ 416, 224,  700,  600], [[ 3, 13], [ 3,  5], [15, 10], [15,  5]], 28, 0x149a6],	// 20
			[1156, 4, [ 442, 224,  750,  644], [[17,  0], [ 4,  4], [19,  6], [17,  6]], 22, 0x15683],
			[1258, 4, [ 476, 252,  816,  690], [[17,  0], [ 2,  7], [34,  0], [ 7, 16]], 24, 0x168c9],
			[1364, 4, [ 504, 270,  900,  750], [[ 4, 14], [ 4,  5], [16, 14], [11, 14]], 24, 0x177ec],
			[1474, 4, [ 560, 300,  960,  810], [[ 6, 14], [ 6,  4], [30,  2], [11, 16]], 26, 0x18ec4],
			[1588, 4, [ 588, 312, 1050,  870], [[ 8, 13], [ 8,  4], [22, 13], [ 7, 22]], 26, 0x191e1],	// 25
			[1706, 4, [ 644, 336, 1110,  952], [[19,  4], [10,  2], [33,  4], [28,  6]], 28, 0x1afab],
			[1828, 4, [ 700, 360, 1200, 1020], [[22,  3], [ 8,  4], [12, 28], [ 8, 26]], 28, 0x1b08e],
			[1921, 3, [ 728, 390, 1260, 1050], [[ 3, 23], [ 3, 10], [11, 31], [ 4, 31]], 24, 0x1cc1a],
			[2051, 3, [ 784, 420, 1350, 1140], [[21,  7], [ 7,  7], [19, 26], [ 1, 37]], 24, 0x1d33f],
			[2185, 3, [ 812, 450, 1440, 1200], [[19, 10], [ 5, 10], [23, 25], [15, 25]], 26, 0x1ed75],	// 30
			[2323, 3, [ 868, 480, 1530, 1290], [[ 2, 29], [13,  3], [23, 28], [42,  1]], 26, 0x1f250],
			[2465, 3, [ 924, 510, 1620, 1350], [[10, 23], [17,  0], [19, 35], [10, 35]], 26, 0x209d5],
			[2611, 3, [ 980, 540, 1710, 1440], [[14, 21], [17,  1], [11, 46], [29, 19]], 28, 0x216f0],
			[2761, 3, [1036, 570, 1800, 1530], [[14, 23], [13,  6], [59,  1], [44,  7]], 28, 0x228ba],
			[2876, 0, [1064, 570, 1890, 1590], [[12, 26], [12,  7], [22, 41], [39, 14]], 24, 0x2379f],	// 35
			[3034, 0, [1120, 600, 1980, 1680], [[ 6, 34], [ 6, 14], [ 2, 64], [46, 10]], 26, 0x24b0b],
			[3196, 0, [1204, 630, 2100, 1770], [[29, 14], [17,  4], [24, 46], [49, 10]], 26, 0x2542e],
			[3362, 0, [1260, 660, 2220, 1860], [[13, 32], [ 4, 18], [42, 32], [48, 14]], 26, 0x26a64],
			[3532, 0, [1316, 720, 2310, 1950], [[40,  7], [20,  4], [10, 67], [43, 22]], 28, 0x27541],
			[3706, 0, [1372, 750, 2430, 2040], [[18, 31], [19,  6], [20, 61], [34, 34]], 28, 0x28c69]	// 40
		],
		formatInfo = [
			[0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
			[0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
			[0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b],
			[0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed]
		],
		pdp = [	// Position Detection Pattern
			[1,1,1,1,1,1,1],
			[1,0,0,0,0,0,1],
			[1,0,1,1,1,0,1],
			[1,0,1,1,1,0,1],
			[1,0,1,1,1,0,1],
			[1,0,0,0,0,0,1],
			[1,1,1,1,1,1,1]
		],
		ap = [	// Alignment Pattern
			[1,1,1,1,1],
			[1,0,0,0,1],
			[1,0,1,0,1],
			[1,0,0,0,1],
			[1,1,1,1,1]
		],
		maskPattern = [
			function (j, i) { return (i + j) % 2 === 0; },
			function (j, i) { return i % 2 === 0; },
			function (j, i) { return j % 3 === 0; },
			function (j, i) { return (i + j) % 3 === 0; },
			function (j, i) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0; },
			function (j, i) { return (i * j) % 2 + (i * j) % 3 === 0; },
			function (j, i) { return ((i * j) % 2 + (i * j) % 3) % 2 === 0; },
			function (j, i) { return ((i * j) % 3 + (i + j) % 2) % 2 === 0; }
		],
		BIT_TYPE = {
			FINDER: 0x02,
			SEPARATOR: 0x04,
			TIMING: 0x08,
			ALIGNMENT: 0x10,
			VERSION: 0x20,
			FORMAT: 0x40,
			DATA: 0x80
		};

	// ==== Private Encoding Function =========================================

	function encodeMatrix (data, code, returnVersion) {
		var	i, j, x, y, len,				// Counter variables (used in for-loops)
			version = code.version,			// "Cached" version for faster access
			ecLevel = code.errorCorrection;	// "Cached" ecLevel for faster access

		// ==== Step 1: Data Encodation ===========================================

		// ---- Data analysis & Bit stream generation -----------------------------

		var	bitStream = new Array(versionInfo[versionInfo.length - 1][VI.TOTAL_BYTES] * 8),
			bitStreamLen = 0,
			cciLength,	// Number of bits in Character Count Indicator
			minVersion;

		switch (code.encodeMode) {
			case code.ENCODE_MODE.NUMERIC:
				var num = 0;
				for (i = 0; i < data.length; i++) {
					if (data[i] >= 0x30 && data[i] <= 0x39) {
						num = (num * 10) + (data[i] - 0x30);
						if ((i % 3) === 2) {
							bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(num, 10));
							num = 0;
						}
					} else {
						throw new TypeError('Invalid data format');
					}
				}
				switch (i % 3) {
					case 1:		// one number remaining
						bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(num, 4));
						break;
					case 2:		// two numbers remaining
						bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(num, 7));
						break;
					default:	// no number remaining
						break;
				}

				if (version > 0) {
					if (version >= 1 && version <= 9) {
						cciLength = 10;
					} else if (version >= 10 && version <= 26) {
						cciLength = 12;
					} else if (version >= 27 && version <= 40) {
						cciLength = 14;
					}
				} else {	// Auto detecting version, TODO: This code is similar for all data types -> make a function for it
					minVersion = getMinVersionByBits(bitStreamLen + 4 + 10, ecLevel);
					if (minVersion > 0) {
						if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
						if (minVersion >= 1 && minVersion <= 9) {
							cciLength = 10;
						} else {
							minVersion = getMinVersionByBits(bitStreamLen + 4 + 12, ecLevel);
							if (minVersion > 0) {
								if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
								if (minVersion >= 10 && minVersion <= 26) {
									cciLength = 12;
								} else {
									minVersion = getMinVersionByBits(bitStreamLen + 4 + 14, ecLevel);
									if (minVersion > 0) {
										if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
										if (minVersion >= 27 && minVersion <= 40) {
											cciLength = 14;
										} else {
											throw new RangeError('Bug in version detection');
										}
									} else {
										throw new RangeError('Too much data');
									}
								}
							} else {
								throw new RangeError('Too much data');
							}
						}
					} else {
						throw new RangeError('Too much data');
					}

					version = minVersion;
				}
				break;

			case code.ENCODE_MODE.ALPHA_NUMERIC:
				var charMap = [
						48,49,50,51,52,53,54,55,56,57,													// 0-9
						65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,	// A-Z
						32,36,37,42,43,45,46,47,58														// SP, $, %, *, +, -, ., /, :
					],
					charCode1, charCode2;

				for (i = 0; i < data.length - 1; i += 2) {
					charCode1 = indexInArray((data[i] & 0x60) === 0x60 ? data[i] & 0x5f : data[i], charMap);
					charCode2 = indexInArray((data[i + 1] & 0x60) === 0x60 ? data[i + 1] & 0x5f : data[i + 1], charMap);
					if (charCode1 === -1 || charCode2 === -1) {
						throw new Error('Character not supported in ALPHA_NUMERIC encoding mode');
					}
					bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits((charCode1 * 45) + charCode2, 11));
				}

				if (i === (data.length - 1)) {
					charCode1 = indexInArray((data[i] & 0x60) === 0x60 ? data[i] & 0x5f : data[i], charMap);
					if (charCode1 === -1) {
						throw new Error('Character not supported in ALPHA_NUMERIC encoding mode');
					}
					bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(charCode1, 6));
				}

				if (version > 0) {
					if (version >= 1 && version <= 9) {
						cciLength = 9;
					} else if (version >= 10 && version <= 26) {
						cciLength = 11;
					} else if (version >= 27 && version <= 40) {
						cciLength = 13;
					}
				} else {	// Auto detecting version, TODO: This code is similar for all data types -> make a function for it
					minVersion = getMinVersionByBits(bitStreamLen + 4 + 9, ecLevel);
					if (minVersion > 0) {
						if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
						if (minVersion >= 1 && minVersion <= 9) {
							cciLength = 9;
						} else {
							minVersion = getMinVersionByBits(bitStreamLen + 4 + 11, ecLevel);
							if (minVersion > 0) {
								if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
								if (minVersion >= 10 && minVersion <= 26) {
									cciLength = 11;
								} else {
									minVersion = getMinVersionByBits(bitStreamLen + 4 + 13, ecLevel);
									if (minVersion > 0) {
										if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
										if (minVersion >= 27 && minVersion <= 40) {
											cciLength = 13;
										} else {
											throw new RangeError('Bug in version detection');
										}
									} else {
										throw new RangeError('Too much data');
									}
								}
							} else {
								throw new RangeError('Too much data');
							}
						}
					} else {
						throw new RangeError('Too much data');
					}

					version = minVersion;
				}
				break;

			case code.ENCODE_MODE.BYTE:
			case code.ENCODE_MODE.UTF8:
			case code.ENCODE_MODE.UTF8_SIGNATURE:
				for (i = 0; i < data.length; i++) {
					bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(data[i], 8));
				}

				if (version > 0) {
					if (version >= 0 && version <= 9) {
						cciLength = 8;
					} else if (version >= 10 && version <= 40) {
						cciLength = 16;
					}
				} else {	// Auto detecting version, TODO: This code is similar for all data types -> make a function for it
					minVersion = getMinVersionByBits(bitStreamLen + 4 + 8, ecLevel);
					if (minVersion > 0) {
						if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
						if (minVersion >= 1 && minVersion <= 9) {
							cciLength = 8;
						} else {
							minVersion = getMinVersionByBits(bitStreamLen + 4 + 16, ecLevel);
							if (minVersion > 0) {
								if (minVersion < Math.abs(version)) { minVersion = Math.abs(version); }
								if (minVersion >= 10 && minVersion <= 40) {
									cciLength = 16;
								} else {
									throw new RangeError('Bug in version detection');
								}
							} else {
								throw new RangeError('Too much data');
							}
						}
					} else {
						throw new RangeError('Too much data');
					}

					version = minVersion;
				}
				break;

			case code.ENCODE_MODE.KANJI:
				// UNSUPPORTED
				throw new Error('Encoding mode "KANJI" not supported yet');
				/*
					if (version >= 0 && version <= 9) {
						cciLength = 8;
					} else if (version >= 10 && version <= 26) {
						cciLength = 10;
					} else if (version >= 27 && version <= 40) {
						cciLength = 12;
					}
				*/
				break;

			default:
				throw new Error('Unsupported encoding mode');
				break;
		}

		if (returnVersion) {
			return version;
		}

		bitStream = toBits(code.encodeMode & 0xf, 4).concat(toBits(data.length, cciLength)).concat(bitStream);
		bitStreamLen += (4 + cciLength);

		// ---- Size check --------------------------------------------------------

		var maxDataBits = versionInfo[version][VI.TOTAL_BYTES] - versionInfo[version][VI.ECC_BYTES][ecLevel] << 3;

		if (bitStreamLen > maxDataBits) {
			throw new RangeError('Too much data for the selected version');
		}

		// ---- Append Terminator & Padding ---------------------------------------

		var termLength = maxDataBits - bitStreamLen;
		if (termLength > 4) { termLength = 4; }
		bitStreamLen = arrayCopy(bitStream, bitStreamLen, typedArray(termLength, 0));
		bitStreamLen = arrayCopy(bitStream, bitStreamLen, typedArray((8 - (bitStreamLen % 8)) % 8, 0));

		for (i = 0, len = (maxDataBits - bitStreamLen) >>> 3; i < len; i++) {
			bitStreamLen = arrayCopy(bitStream, bitStreamLen, i & 1 ? [0,0,0,1,0,0,0,1] : [1,1,1,0,1,1,0,0]);
		}

		// ---- Bit stream to codeword conversion / Subdivision into blocks -------

		// dataBlockSize contains the size of shortest data block, the longest data block has a size of dataBlockSize+1
		var	dataBlockSize = Math.floor((versionInfo[version][VI.TOTAL_BYTES] - versionInfo[version][VI.ECC_BYTES][ecLevel]) / (versionInfo[version][VI.EC_BLOCKS][ecLevel][0] + versionInfo[version][VI.EC_BLOCKS][ecLevel][1])),
			eccBlockSize = Math.floor(versionInfo[version][VI.ECC_BYTES][ecLevel]  / (versionInfo[version][VI.EC_BLOCKS][ecLevel][0] + versionInfo[version][VI.EC_BLOCKS][ecLevel][1])),
			dataBlocks = [],
			codeword = [];

		for (i = 0, len = versionInfo[version][VI.EC_BLOCKS][ecLevel][0]; i < len; i++) {
			codeword = [];
			for (j = 0; j < dataBlockSize; j++) {
				codeword.push(toByte(bitStream.splice(0, 8)));
			}
			dataBlocks.push(codeword);
		}

		for (i = 0, len = versionInfo[version][VI.EC_BLOCKS][ecLevel][1]; i < len; i++) {
			codeword = [];
			for (j = 0; j <= dataBlockSize; j++) {
				codeword.push(toByte(bitStream.splice(0, 8)));
			}
			dataBlocks.push(codeword);
		}

		// ==== Step 2: Error Correction Codeword generation ======================

		// ---- Galois Field Generation -------------------------------------------

		var gf = [], gfRev = [];
		j = 1;
		for (i = 0; i < 255; i++) {
			gf.push(j);
			gfRev[j] = i;
			j <<= 1;
			if (j > 0xff) { j = 0x11d ^ j; }	// pp = 285 = 0x11d
		}

		// ---- Generator Polynomial Generation -----------------------------------

		var gp = [1];
		for (i = 0, len = eccBlockSize; i < len; i++) {
			gp[i + 1] = 1;

			for (j = i; j > 0; j--) {
				if (gp[j] > 0) {
					gp[j] = gp[j - 1] ^ gf[(gfRev[gp[j]] + i) % 0xff];
				} else {
					gp[j] = gp[j - 1];
				}
			}
			gp[0] = gf[(gfRev[gp[0]] + i) % 0xff];
		}

		var gpi = [];	// inverted order
		for (i = gp.length - 1; i >= 0; i--) {
			gpi.push(gp[i]);
		}

		// ---- Error Correction Code Generation ----------------------------------

		var eccBlocks = [];

		for (j = 0; j < dataBlocks.length; j++) {
			eccBlocks[j] = [].concat(dataBlocks[j]).concat(typedArray(eccBlockSize, 0));

			var firstByte;
			while (eccBlocks[j].length >= gpi.length) {
				firstByte = eccBlocks[j][0];
				for (i = 0; i < gpi.length; i++) {
					eccBlocks[j][i] ^= gf[(gfRev[gpi[i]] + gfRev[firstByte]) % 0xff];
				}
				if (eccBlocks[j].shift() !== 0) {
					throw new Error('Bug while generating the ECC');
				}
			}
		}

		// ---- Interleave Blocks / Back-conversion into bit stream ---------------

		bitStream = new Array(versionInfo[versionInfo.length - 1][VI.TOTAL_BYTES] * 8);
		bitStreamLen = 0;

		for (i = 0; i <= dataBlockSize; i++) {
			for (j = 0; j < dataBlocks.length; j++) {
				if (i < dataBlocks[j].length) {
					bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(dataBlocks[j][i], 8));
				}
			}
		}

		for (i = 0; i < eccBlockSize; i++) {
			for (j = 0; j < eccBlocks.length; j++) {
				if (i < eccBlocks[j].length) {
					bitStreamLen = arrayCopy(bitStream, bitStreamLen, toBits(eccBlocks[j][i], 8));
				}
			}
		}

		// ==== Step 3: Module placement in matrix ================================

		// ---- Matrix Initialization ---------------------------------------------

		var noOfModules = 17 + (version << 2),
			matrix = new Array(noOfModules);

		for (i = 0; i < noOfModules; i++) {
			matrix[i] = typedArray(noOfModules, 0);
		}

		// ---- Finder Pattern ----------------------------------------------------

		matrixCopy(matrix, 0, 0, pdp, BIT_TYPE.FINDER);
		matrixCopy(matrix, 0, noOfModules - 7, pdp, BIT_TYPE.FINDER);
		matrixCopy(matrix, noOfModules - 7, 0, pdp, BIT_TYPE.FINDER);

		// ---- Separators --------------------------------------------------------

		for (i = 0; i < 8; i++) {
			// Top-left
			matrix[i][7] = BIT_TYPE.SEPARATOR;
			matrix[7][i] = BIT_TYPE.SEPARATOR;

			// Top-right
			matrix[i][noOfModules - 8] = BIT_TYPE.SEPARATOR;
			matrix[7][(noOfModules - 1) - i] = BIT_TYPE.SEPARATOR;

			// Bottom-left
			matrix[(noOfModules - 1) - i][7] = BIT_TYPE.SEPARATOR;
			matrix[noOfModules - 8][i] = BIT_TYPE.SEPARATOR;
		}

		// ---- Timing Pattern ----------------------------------------------------

		for (i = 8; i < (noOfModules - 8); i++) {
			matrix[i][6] = BIT_TYPE.TIMING | ((i + 1) % 2);
			matrix[6][i] = BIT_TYPE.TIMING | ((i + 1) % 2);
		}

		// ---- Alignment Pattern -------------------------------------------------

		if (version > 1) {
			var	appOffset = versionInfo[version][VI.ALIGNMENT_PATTERN_POSITION_OFFSET],
				appMax = (version * 4) + 10;

			y = appMax;
			while (true) {
				x = appMax;
				while (true) {
					if (!(
						(x === 6 && y === 6) ||
						(x === 6 && y === (noOfModules - 7)) ||
						(x === (noOfModules - 7) && y === 6)
					)) {
						matrixCopy(matrix, x - 2, y - 2, ap, BIT_TYPE.ALIGNMENT);
					}
					if (x === 6) { break; }
					x -= appOffset;
					if (x < 18) { x = 6; }
				}
				if (y === 6) { break; }
				y -= appOffset;
				if (y < 18) { y = 6; }
			}
		}

		// ---- Version Information -----------------------------------------------

		if (version >= 7) {
			var v = versionInfo[version][VI.VERSION_PATTERN];
			for (i = 0; i < 6; i++) {
				for (j = 0; j < 3; j++) {
					matrix[(noOfModules - 11) + j][i] = BIT_TYPE.VERSION | (v & 1);
					matrix[i][(noOfModules - 11) + j] = BIT_TYPE.VERSION | (v & 1);
					v = v >> 1;
				}
			}
		}

		// ---- Reserving space for Format Information ----------------------------

		for (i = 0; i < 8; i++) {
			matrix[(noOfModules - 1) - i][8] = BIT_TYPE.FORMAT | 0;
			matrix[8][(noOfModules - 1) - i] = BIT_TYPE.FORMAT | 0;

			if (i !== 6) {
				matrix[8][i] = BIT_TYPE.FORMAT | 0;
				matrix[i][8] = BIT_TYPE.FORMAT | 0;
			}
		}
		matrix[8][8] = BIT_TYPE.FORMAT | 0;
		matrix[noOfModules - 8][8] = BIT_TYPE.FORMAT | 1;

		// ---- Symbol character placement ----------------------------------------

		var	dir = -1;	// -1 = Upwards / +1 = Downwards
		x = y = noOfModules - 1;
		for (i = 0; i < bitStreamLen; i++) {
			matrix[y][x] = BIT_TYPE.DATA | bitStream[i];
			do {
				if (
					((x > 6) && ((x & 1) === 0)) ||
					((x < 6) && ((x & 1) === 1))
				) {
					x--;
				} else if (((dir === -1) && (y === 0)) || ((dir === 1) && (y === (noOfModules - 1)))) {
					if (x === 0) {	// reached end of pattern
						if (i < bitStreamLen - 1) {
							// This should be impossible
							throw new RangeError('Too much data while writing the symbol');
						}
						break;
					}

					dir = -dir;
					x--;
					if (x === 6) { x--; }
				} else {
					y += dir;
					x++;
				}
			} while (matrix[y][x] !== 0);
		}

		// ==== Step 4: Masking Pattern selection & add Format Information ========

		// ---- Create masked matrices & add Format Information modules -----------

		var	maskedMatrices = [],
			formatBits;

		for (i = 0; i < maskPattern.length; i++) {
			maskedMatrices[i] = [];
			for (y = 0; y < noOfModules; y++) {
				maskedMatrices[i][y] = [];
				for (x = 0; x < noOfModules; x++) {
					if (matrix[y][x] & BIT_TYPE.DATA) {
						maskedMatrices[i][y][x] = (matrix[y][x] ^ maskPattern[i](x, y)) & 1;
					} else {
						maskedMatrices[i][y][x] = matrix[y][x] & 1;
					}
				}
			}

			// Add Format Information modules
			formatBits = toBits(formatInfo[ecLevel][i], 15);
			maskedMatrices[i][noOfModules - 1][8] = maskedMatrices[i][8][0] = formatBits[0];
			maskedMatrices[i][noOfModules - 2][8] = maskedMatrices[i][8][1] = formatBits[1];
			maskedMatrices[i][noOfModules - 3][8] = maskedMatrices[i][8][2] = formatBits[2];
			maskedMatrices[i][noOfModules - 4][8] = maskedMatrices[i][8][3] = formatBits[3];
			maskedMatrices[i][noOfModules - 5][8] = maskedMatrices[i][8][4] = formatBits[4];
			maskedMatrices[i][noOfModules - 6][8] = maskedMatrices[i][8][5] = formatBits[5];
			maskedMatrices[i][noOfModules - 7][8] = maskedMatrices[i][8][7] = formatBits[6];
			maskedMatrices[i][8][noOfModules - 8] = maskedMatrices[i][8][8] = formatBits[7];
			maskedMatrices[i][8][noOfModules - 7] = maskedMatrices[i][7][8] = formatBits[8];
			maskedMatrices[i][8][noOfModules - 6] = maskedMatrices[i][5][8] = formatBits[9];
			maskedMatrices[i][8][noOfModules - 5] = maskedMatrices[i][4][8] = formatBits[10];
			maskedMatrices[i][8][noOfModules - 4] = maskedMatrices[i][3][8] = formatBits[11];
			maskedMatrices[i][8][noOfModules - 3] = maskedMatrices[i][2][8] = formatBits[12];
			maskedMatrices[i][8][noOfModules - 2] = maskedMatrices[i][1][8] = formatBits[13];
			maskedMatrices[i][8][noOfModules - 1] = maskedMatrices[i][0][8] = formatBits[14];
		}

		// ---- Evaluate: Scoring of masking results ------------------------------

		var	selectedMask = 0,
			selectedMaskScore = 0xffffffff,
			n1, n2, n3, n4, score;

		for (i = 0; i < maskPattern.length; i++) {
			n1 = n2 = n3 = n4 = score = 0;
			for (y = 0; y < noOfModules; y++) {
				for (x = 0; x < noOfModules; x++) {
					// Evaluate: Adjacent modules in row/column in same color
					if (
						(x >= 6) && (
							((
								maskedMatrices[i][y][x - 6] &
								maskedMatrices[i][y][x - 5] &
								maskedMatrices[i][y][x - 4] &
								maskedMatrices[i][y][x - 3] &
								maskedMatrices[i][y][x - 2] &
								maskedMatrices[i][y][x - 1] &
								maskedMatrices[i][y][x]
							) === 1) || ((
								maskedMatrices[i][y][x - 6] |
								maskedMatrices[i][y][x - 5] |
								maskedMatrices[i][y][x - 4] |
								maskedMatrices[i][y][x - 3] |
								maskedMatrices[i][y][x - 2] |
								maskedMatrices[i][y][x - 1] |
								maskedMatrices[i][y][x]
							) === 0)
						)
					) {
						n1++;
					}
					if (
						(y >= 6) && (
							((
								maskedMatrices[i][y - 6][x] &
								maskedMatrices[i][y - 5][x] &
								maskedMatrices[i][y - 4][x] &
								maskedMatrices[i][y - 3][x] &
								maskedMatrices[i][y - 2][x] &
								maskedMatrices[i][y - 1][x] &
								maskedMatrices[i][y][x]
							) === 1) || ((
								maskedMatrices[i][y - 6][x] |
								maskedMatrices[i][y - 5][x] |
								maskedMatrices[i][y - 4][x] |
								maskedMatrices[i][y - 3][x] |
								maskedMatrices[i][y - 2][x] |
								maskedMatrices[i][y - 1][x] |
								maskedMatrices[i][y][x]
							) === 0)
						)
					) {
						n1++;
					}

					// Evaluate: Block of modules in same color
					if (
						(x > 0 && y > 0) && (
							((
								maskedMatrices[i][y][x] &
								maskedMatrices[i][y][x - 1] &
								maskedMatrices[i][y - 1][x] &
								maskedMatrices[i][y - 1][x - 1]
							) === 1) || ((
								maskedMatrices[i][y][x] |
								maskedMatrices[i][y][x - 1] |
								maskedMatrices[i][y - 1][x] |
								maskedMatrices[i][y - 1][x - 1]
							) === 0)
						)
					) {
						n2++;
					}

					// Evaluate: 1,0,1,1,1,0,1 pattern in row/column
					if (
						(x >= 6) && (
							(maskedMatrices[i][y][x - 6]=== 1) &&
							(maskedMatrices[i][y][x - 5] === 0) &&
							(maskedMatrices[i][y][x - 4] === 1) &&
							(maskedMatrices[i][y][x - 3] === 1) &&
							(maskedMatrices[i][y][x - 2] === 1) &&
							(maskedMatrices[i][y][x - 1] === 0) &&
							(maskedMatrices[i][y][x] === 1)
						)
					) {
						n3++;
					}
					if (
						(y >= 6) && (
							(maskedMatrices[i][y - 6][x] === 1) &&
							(maskedMatrices[i][y - 5][x] === 0) &&
							(maskedMatrices[i][y - 4][x] === 1) &&
							(maskedMatrices[i][y - 3][x] === 1) &&
							(maskedMatrices[i][y - 2][x] === 1) &&
							(maskedMatrices[i][y - 1][x] === 0) &&
							(maskedMatrices[i][y][x] === 1)
						)
					) {
						n3++;
					}

					// Evaluate: Proportion of dark modules in entire symbol
					n4 += maskedMatrices[i][y][x];
				}
			}

			n4 = Math.abs(((100 * n4) / (noOfModules * noOfModules)) - 50) / 5;
			score = (n1 * 3) + (n2 * 3) + (n3 * 40) + (n4 * 10);
			if (score < selectedMaskScore) {
				selectedMaskScore = score;
				selectedMask = i;
			}
		}

		// ---- Apply masking pattern ---------------------------------------------

		for (y = 0; y < noOfModules; y++) {
			for (x = 0; x < noOfModules; x++) {
				if (matrix[y][x] & (BIT_TYPE.DATA | BIT_TYPE.FORMAT)) {
					matrix[y][x] = maskedMatrices[selectedMask][y][x];
				} else {
					matrix[y][x] = matrix[y][x] & 0x1;
				}
			}
		}

		return matrix;
	}

	// ************************************************************************
	// **** Global Private Functions ******************************************
	// ************************************************************************

	function processInput (input, code) {
		var data, dataArr, i, c, len;

		switch (typeof input) {
			case 'string':
				data = input;
				break;
			case 'number':
				data = input.toString();
				break;
			case 'object':
				if (input.constructor === window[___JSQR___].prototype.Input) {
					data = input.toString();
				} else if ((Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]'; })(input)) {
					return input;
				} else {
					data = (new window[___JSQR___].prototype.Input(input.dataType, input.data)).toString();
				}
				break;
			default:
				throw new TypeError('Unsupported input parameter');
		}

		dataArr = (code.encodeMode === code.ENCODE_MODE.UTF8_SIGNATURE ? [0xef, 0xbb , 0xbf] : []);

		if (code.encodeMode === code.ENCODE_MODE.UTF8_SIGNATURE || code.encodeMode === code.ENCODE_MODE.UTF8) {
			// UTF-8 Encode
			for (i = 0, len = data.length; i < len; i++) {
				c = data.charCodeAt(i);
				if (c < 128) {
					dataArr.push(c);
				} else if((c > 127) && (c < 2048)) {
					dataArr.push((c >> 6) | 192, (c & 63) | 128);
				} else {
					dataArr.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
				}
			}
		} else {
			for (i = 0, len = data.length; i < len; i++) {
				dataArr.push(data.charCodeAt(i));
			}
		}

		return dataArr;
	}

	// Returns the smallest possible version to a given number of bits and errorCorrection level.
	function getMinVersionByBits (noOfBits, ecLevel) {
		for (var i = 1; i < versionInfo.length; i++) {
			if (noOfBits <= ((versionInfo[i][VI.TOTAL_BYTES] - versionInfo[i][VI.ECC_BYTES][ecLevel]) << 3)) {
				return i;
			}
		}
		return 0;
	}

	// Converts a number (data) into an array of bits of the given length.
	function toBits (data, length) {
		var dataArr = new Array(length);
		if ((typeof data === 'number') && (length > 0) && (length <= 32)) {
			for (var i = length - 1; i >= 0; i--) {
				dataArr[i] = data & 0x1;
				data >>= 1;
			}
			return dataArr;
		} else {
			throw new Error("Invalid parameters in toBits().");
		}
	}

	// Converts a part of an Array of Bits into an 8-bit number (0-255).
	function toByte (data, pos) {
		pos = pos || 0;
		return	((data[pos    ] || 0) << 7) +
				((data[pos + 1] || 0) << 6) +
				((data[pos + 2] || 0) << 5) +
				((data[pos + 3] || 0) << 4) +
				((data[pos + 4] || 0) << 3) +
				((data[pos + 5] || 0) << 2) +
				((data[pos + 6] || 0) << 1) +
				((data[pos + 7] || 0));
	}

	// Generates an Array of a given size, prefilled with the given value.
	function typedArray (size, value) {
		var arr = new Array(size);
		for (var i = 0; i < size; i++) {
			arr[i] = value;
		}
		return arr;
	}

	function arrayCopy (dstArr, dstPos, srcArr) {
		for (var i = 0; i < srcArr.length; i++) {
			dstArr[dstPos + i] = srcArr[i];
		}
		return dstPos + srcArr.length;
	}

	// Copies an 2D-Array into another array
	function matrixCopy (dstArr, dstX, dstY, srcArr, xor) {
		var x, xLen, y, yLen;
		for (y = 0, yLen = srcArr.length; y < yLen; y++) {
			for (x = 0, xLen = srcArr[y].length; x < xLen; x++) {
				dstArr[dstY + y][dstX + x] = srcArr[y][x] ^ xor;
			}
		}
	}

	// Returns the position of an charCode in an array
	function indexInArray (value, arr) {
		if (typeof arr.indexOf === 'function') {
			return arr.indexOf(value);
		} else {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === value) {
					return i;
				}
			}
		}
		return -1;
	}

	// Check if a value exist in an Enumeration
	function isEnumValue (enumObj, value) {
		for (var v in enumObj) {
			if (enumObj.hasOwnProperty(v) && enumObj[v] === value) {
				return true;
			}
		}
		return false;
	}

	// Creates a copy of an object
	function copyObject (obj) {
		if (typeof obj != 'object') { return obj; }

		var cpy = {};
		for (var param in obj) {
			if (obj.hasOwnProperty(param)) {
				if (typeof obj[param] === 'object') {
					cpy[param] = copyObject(obj[param]);
				} else {
					cpy[param] = obj[param];
				}
			}
		}

		return cpy;
	}

	var ___JSQR___ = 'JSQR';

	// ************************************************************************
	// **** JSQR Interface ****************************************************
	// ************************************************************************

	window[___JSQR___] = function () { };

	window[___JSQR___].prototype.encode = function (input, code) {
		return new window[___JSQR___].prototype.Matrix(input, code);
	};

	// ************************************************************************
	// **** Input Sub Class ***************************************************
	// ************************************************************************

	window[___JSQR___].prototype.Input = Input;
	window[___JSQR___].prototype.DATA_TYPE = window[___JSQR___].prototype.Input.prototype.DATA_TYPE;

	// ************************************************************************
	// **** Code Sub Class ****************************************************
	// ************************************************************************

	window[___JSQR___].prototype.Code = Code;
	window[___JSQR___].prototype.ENCODE_MODE = window[___JSQR___].prototype.Code.prototype.ENCODE_MODE;
	window[___JSQR___].prototype.ERROR_CORRECTION = window[___JSQR___].prototype.Code.prototype.ERROR_CORRECTION;
	window[___JSQR___].prototype.DEFAULT = window[___JSQR___].prototype.Code.prototype.DEFAULT;

	// ************************************************************************
	// **** Matrix Sub Class **************************************************
	// ************************************************************************

	window[___JSQR___].prototype.Matrix = Matrix;

})(window);
