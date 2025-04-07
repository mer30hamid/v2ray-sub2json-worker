// src/lib/utils/helpers.ts
export function isValidUri(uri: string, isProxy = false, protocol = 'none'): boolean {
	try {
		new URL(uri);
		let protocolMatch = true;
		if (protocol !== 'none') protocolMatch = uri.startsWith(protocol + '://');
		if (isProxy) {
			const isVless = uri.startsWith('vless://');
			const isVmess = uri.startsWith('vmess://');
			const isTrojan = uri.startsWith('trojan://');
			const isShadowsocks = uri.startsWith('ss://');
			const isWireguard = uri.startsWith('wireguard://');
			return (isVless || isVmess || isTrojan || isShadowsocks || isWireguard) && protocolMatch;
		}
		return protocolMatch;
	} catch (e) {
		return false;
	}
}

export function decodeBase64(str: string): string {
	const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	let result = '';

	// Clean the string: remove anything not in the base64 alphabet or padding
	const cleanStr = str.replace(/[^A-Za-z0-9+/=]/g, '');

	// Pad to a multiple of 4 if needed
	const paddingNeeded = (4 - (cleanStr.length % 4)) % 4;
	const paddedStr = cleanStr + '='.repeat(paddingNeeded);

	// Manual decoding
	let buffer = 0,
		bits = 0;
	for (let i = 0; i < paddedStr.length; i++) {
		if (paddedStr[i] === '=') break; // Stop at padding
		const value = base64Chars.indexOf(paddedStr[i]);
		if (value === -1) continue; // Skip any remaining invalid chars

		buffer = (buffer << 6) + value;
		bits += 6;

		if (bits >= 8) {
			bits -= 8;
			const byte = (buffer >> bits) & 0xff;
			result += String.fromCharCode(byte);
		}
	}

	return result;
}

// Helper to build settings
export function buildSettings(params: {
	protocol: any;
	uid: any;
	password: any;
	address: any;
	port: any;
	flow: any;
	method: any;
	publicKey: any;
	endpoint: any;
}) {
	//const { address, protocol, password, method, security, sni, fp, host, path, headertype, serviceName, alpn, pbk, sid, spx } = params;
	const { protocol, uid, password, address, port, flow, method, publicKey, endpoint } = params;
	let settings = {};

	if (protocol === 'trojan') {
		settings = {
			servers: [
				{
					address,
					port,
					password,
					level: 1
				}
			]
		};
	} else if (protocol === 'shadowsocks') {
		settings = {
			servers: [
				{
					address,
					port,
					method,
					password,
					uot: true,
					UoTVersion: 2,
					level: 1
				}
			]
		};
	} else if (protocol === 'wireguard') {
		settings = {
			secretKey: password,
			address,
			peers: [
				{
					publicKey,
					allowedIPs: ['0.0.0.0/0', '::/0'],
					endpoint
				}
			],
			mtu: 1280
		};
	} else {
		settings = {
			vnext: [
				{
					address,
					port,
					users: [
						{
							id: uid,
							alterId: 0,
							email: 't@t.tt',
							security: 'auto',
							encryption: protocol === 'vless' ? 'none' : undefined,
							flow: flow.startsWith('xtls') ? flow : ''
						}
					]
				}
			]
		};
	}
	return settings;
}

// Helper to build stream settings
export function buildStreamSettings(params: {
	protocol: any;
	type: any;
	security: any;
	sni: any;
	fp: any;
	host: any;
	path: any;
	headertype: any;
	serviceName: any;
	alpn: any;
	pbk: any;
	sid: any;
	spx: any;
}) {
	const {
		protocol,
		type,
		security,
		sni,
		fp,
		host,
		path,
		headertype,
		serviceName,
		alpn,
		pbk,
		sid,
		spx
	} = params;
	const streamSettings: any = { network: type == '' ? 'tcp' : type };

	if (host && (type === 'tcp' || type === 'http')) {
		streamSettings.tcpSettings = {
			header: {
				type: headertype,
				request: {
					version: '1.1',
					method: 'GET',
					path: [path],
					headers: {
						Host: [host],
						'User-Agent': [''],
						'Accept-Encoding': ['gzip, deflate'],
						Connection: ['keep-alive'],
						Pragma: 'no-cache'
					}
				}
			}
		};
	}

	if (type === 'ws') {
		streamSettings.wsSettings = {
			path,
			headers: host ? { Host: host } : {}
		};
	}

	if (type === 'grpc') {
		streamSettings.grpcSettings = {
			serviceName: serviceName || '',
			multiMode: false,
			idle_timeout: 60,
			health_check_timeout: 20,
			permit_without_stream: false,
			initial_windows_size: 0
		};
	}

	if (security.startsWith('tls')) {
		streamSettings.security = 'tls';
		streamSettings.tlsSettings = {
			allowInsecure: true,
			serverName: sni,
			alpn: alpn.length ? alpn : [],
			show: false
		};
		if (fp && fp !== 'none') streamSettings.tlsSettings.fingerprint = fp;
	} else if (security.startsWith('reality')) {
		streamSettings.security = 'reality';
		streamSettings.realitySettings = {
			serverName: sni,
			fingerprint: fp,
			show: false,
			publicKey: pbk,
			shortId: sid || '',
			spiderX: spx || ''
		};
	} else {
		streamSettings.security = 'none';
	}
	return streamSettings;
}

// Helper to decode VMess URI
export function decodeVmessUri(uri: string) {
	const encoded = uri.split('://')[1];
	return JSON.parse(decodeBase64(encoded));
}

// Helper to parse URI parameters efficiently
export function parseUriParams(uri: string | URL, isShadowsocks = false) {
	const url = new URL(uri);
	const params = new URLSearchParams(url.search);
	const getParam = (key: string, defaultValue = '') => params.get(key) || defaultValue;
	const protocol = url.protocol.slice(0, -1);
	const port = parseInt(url.port, 10);
	const password =
		protocol === 'shadowsocks'
			? decodeURIComponent(url.password)
			: decodeURIComponent(url.username);

	return {
		protocol,
		uid: url.username || url.pathname.split('@')[0],
		password,
		method: protocol === 'shadowsocks' ? url.username : 'chacha20',
		address: protocol === 'wireguard' ? [getParam('address')] : url.hostname,
		endpoint: url.hostname + ':' + port,
		port,
		type: getParam('type'),
		security: getParam('security'),
		sni: getParam('sni'),
		fp: getParam('fp'),
		pbk: getParam('pbk'),
		sid: getParam('sid'),
		spx: getParam('spx'),
		flow: getParam('flow'),
		host: getParam('host'),
		path: getParam('path', '/'),
		headertype: getParam('headertype', 'http'),
		serviceName: getParam('serviceName'),
		alpn: getParam('alpn', '').split(',').filter(Boolean),
		publicKey: getParam('publickey')
	};
}

// Helper to generate inbound configuration
export function generateInbounds(host = '127.0.0.1', port = 10809, socksport = 10808) {
	const sniffing = { enabled: true, destOverride: ['http', 'tls'], routeOnly: false };
	const settings = { auth: 'noauth', udp: true, allowTransparent: false };
	return {
		inbounds: [
			{ tag: 'socks', port: socksport, listen: host, protocol: 'socks', sniffing, settings },
			{ tag: 'http', port, listen: host, protocol: 'http', sniffing, settings }
		]
	};
}

export function isValidShadowsocksUrl4XRAY(uri: string) {
	try {
		if (typeof uri !== 'string') return false;
		uri = uri.trim();
		if (!uri) return false;
		if (!uri.startsWith('ss://')) return false;
		const protocolCount = (uri.match(/:\/\//g) || []).length;
		if (protocolCount > 1) return false;
		const [_, rest] = uri.split('ss://');
		if (!rest) return false;
		const [authHost, tag] = rest.split('#');
		if (!authHost.includes('@')) return false;
		const [auth, hostPort] = authHost.split('@');
		if (!auth || !hostPort) return false;
		let method, password;
		if (isBase64(auth)) {
			const decoded = decodeBase64(auth);
			if (!decoded.includes(':')) return false;
			[method, password] = decoded.split(':');
		} else {
			if (!auth.includes(':')) return false;
			[method, password] = auth.split(':');
		}
		if (!method || !password) return false;

		/*
      const validMethods = [
        "aes-128-gcm", "aes-192-gcm", "aes-256-gcm",
        "aes-128-cfb", "aes-192-cfb", "aes-256-cfb",
        "chacha20", "chacha20-ietf", "chacha20-ietf-poly1305",
        "rc4", "rc4-md5"
      ];
      */

		// Supported Shadowsocks methods in Xray
		const supportedMethodsByXRAY = [
			'aes-128-gcm',
			'aes-256-gcm',
			'chacha20-ietf-poly1305',
			'xchacha20-ietf-poly1305',
			'none',
			'2022-blake3-aes-128-gcm',
			'2022-blake3-aes-256-gcm',
			'2022-blake3-chacha20-poly1305'
		];

		if (!supportedMethodsByXRAY.includes(method)) {
			//if (!validMethods.includes(method)) {
			//console.warn(`Unknown Shadowsocks method: ${method}`); // Optional warning
			return false;
		}
		const [host, port] = hostPort.split(':');
		if (!host || !port) return false;

		const portNum = parseInt(port, 10);
		if (isNaN(portNum) || portNum < 1 || portNum > 65535) return false;
		return true;
	} catch (e) {
		//console.error(`Error validating Shadowsocks URL: ${e.message}`);
		return false;
	}
}

export function isBase64(str: string) {
	if (typeof str !== 'string') return false;
	str = str.trim();
	if (!str) return false;

	// Pad the string if needed
	const paddingNeeded = (4 - (str.length % 4)) % 4;
	const paddedStr = str + '='.repeat(paddingNeeded);

	// Check length (should now be multiple of 4)
	if (paddedStr.length % 4 !== 0) return false;

	// Validate characters
	const base64Regex = /^[A-Za-z0-9+/=]+$/;
	if (!base64Regex.test(paddedStr)) return false;

	// Try decoding
	try {
		atob(paddedStr);
		return true;
	} catch (e) {
		//console.error(`Base64 decode error for "${str}": ${e.message}`);
		return false;
	}
}
