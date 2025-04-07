// src/lib/utils/conversion.ts
import {
	isValidUri,
	decodeBase64,
	decodeVmessUri,
	parseUriParams,
	isValidShadowsocksUrl4XRAY,
	buildSettings,
	buildStreamSettings,
	generateInbounds
} from './helpers';

// Conversion functions (convert, convertUriJson, etc.) go here
export async function convert(data: string, limit?: string[]) {
	const baseConfig = JSON.parse(JSON.stringify(configTemplate));
	const processedProxies = [];
	let proxyCount = 0;

	for (const config of data.split('\n')) {
		if (isValidUri(config, true)) {
			const result = convertUriJson(config, limit);
			if (!result) continue;

			let convertedConfig;
			try {
				convertedConfig = JSON.parse(result);
			} catch (e) {
				//console.error('JSON parse error:', e.message);
				continue;
			}

			const proxyOutbound = convertedConfig.outbounds.find(
				(out: { tag: string }) => out.tag === 'proxy'
			);
			if (!proxyOutbound) continue;

			proxyCount++;
			const newTag = `proxy-${proxyCount}`;
			proxyOutbound.tag = newTag;

			processedProxies.push(proxyOutbound);
			baseConfig.burstObservatory.subjectSelector.push(newTag);
			baseConfig.routing.balancers[0].selector.push(newTag);
		}
	}

	if (processedProxies.length === 0) return { error: 'No valid proxies found' };
	baseConfig.outbounds = processedProxies.concat(baseConfig.outbounds);
	return baseConfig;
}

// Main conversion function
function convertUriJson(
	uri: string,
	limit: string | string[] | undefined,
	host = '127.0.0.1',
	httpPort = 10809,
	socksPort = 10808
) {
	if (!uri) return false;
	uri = uri.replace('%2F', '/');

	const isVless = isValidUri(uri, true, 'vless');
	const isVmess = isValidUri(uri, true, 'vmess');
	const isTrojan = isValidUri(uri, true, 'trojan');
	const isShadowsocks = isValidUri(uri, true, 'ss');
	const isWireguard = isValidUri(uri, true, 'wireguard');

	if (!isVless && !isVmess && !isTrojan && !isShadowsocks && !isWireguard) return false;

	let params, network;
	if (isVmess) {
		const decoded = decodeVmessUri(uri);
		if (!decoded) return false;
		const url = new URL(`vmess://${decoded.id}@${decoded.add}:${decoded.port}`);
		params = { ...parseUriParams(url.href), ...decoded, type: decoded.net };
		params.port = parseInt(params.port, 10);
		network = decoded.net;
	} else if (isShadowsocks) {
		if (!isValidShadowsocksUrl4XRAY(uri)) return false;
		const shadowUri = `shadowsocks://${decodeBase64(uri.split('://')[1].split('@')[0])}@${uri.split('@')[1]}`;
		//if (!isValidUri(url)) return false;
		params = parseUriParams(shadowUri, isShadowsocks);
		network = params.type == '' ? 'tcp' : params.type;
	} else if (isWireguard) {
		params = parseUriParams(uri);
		network = params.type;
	} else {
		params = parseUriParams(uri);
		network = params.type;
	}

	const { protocol, port } = params;

	// Validate and ensure port is an integer
	if (isNaN(port) || port < 1 || port > 65535) {
		console.error(`Invalid port value: ${port}`);
		return false;
	}

	const isReality = params.security.startsWith('reality');
	const isWs = network === 'ws' || network === 'httpupgrade';
	const isTcpOrGrpc = network === 'tcp' || network === 'grpc';

	if (
		!(
			(isReality && (isVmess || isVless || isTrojan)) ||
			isWs ||
			isTcpOrGrpc ||
			isShadowsocks ||
			isWireguard
		)
	)
		return false;

	/* set limits */
	if (limit) {
		if (isVless && !limit.includes('vless')) return false;
		if (isVmess && !limit.includes('vmess')) return false;
		if (isShadowsocks && !limit.includes('shadowsocks')) return false;
		if (isTrojan && !limit.includes('trojan')) return false;
		if (isWireguard && !limit.includes('wireguard')) return false;
		if (isReality && !limit.includes('reality')) return false;
	}

	let config = {};

	if (protocol === 'wireguard') {
		config = {
			log: { access: '', error: '', loglevel: 'warning' },
			outbounds: [
				{
					tag: 'proxy',
					protocol,
					noKernelTun: false,
					settings: buildSettings(params)

					// The Wireguard protocol is not currently supported in the outbound protocol. streamSettings:
					// https://xtls.github.io/en/config/outbounds/wireguard.html#outboundconfigurationobject
					// But it can be used for chaining:
					// https://xtls.github.io/en/document/level-2/warp.html#using-warp-chain-proxy-on-the-client-side
					// streamSettings: buildStreamSettings(params)
				},
				...BASE_OUTBOUNDS
			]
		};
	} else {
		config = {
			log: { access: '', error: '', loglevel: 'warning' },
			outbounds: [
				{
					tag: 'proxy',
					protocol,
					settings: buildSettings(params),
					streamSettings: buildStreamSettings(params),
					mux: { enabled: false, concurrency: -1 }
				},
				...BASE_OUTBOUNDS
			]
		};
	}

	Object.assign(config, generateInbounds(host, httpPort, socksPort));
	return JSON.stringify(config, null, 2);
}

// Base configuration templates
const BASE_OUTBOUNDS = [
	{ tag: 'direct', protocol: 'freedom', settings: {} },
	{ tag: 'block', protocol: 'blackhole', settings: { response: { type: 'http' } } }
];

const configTemplate = {
	remarks: 'v2ray-sub2json-worker',
	log: {
		access: '',
		error: '',
		loglevel: 'none',
		dnsLog: false
	},
	dns: {
		tag: 'dns',
		hosts: {
			'cloudflare-dns.com': [
				'172.67.73.38',
				'104.19.155.92',
				'172.67.73.163',
				'104.18.155.42',
				'104.16.124.175',
				'104.16.248.249',
				'104.16.249.249',
				'104.26.13.8'
			],
			'domain:youtube.com': ['google.com']
		},
		servers: ['https://cloudflare-dns.com/dns-query']
	},
	inbounds: [
		{
			domainOverride: ['http', 'tls'],
			protocol: 'socks',
			tag: 'socks-in',
			listen: '127.0.0.1',
			port: 10808,
			settings: {
				auth: 'noauth',
				udp: true,
				userLevel: 8
			},
			sniffing: {
				enabled: true,
				destOverride: ['http', 'tls']
			}
		},
		{
			protocol: 'http',
			tag: 'http-in',
			listen: '127.0.0.1',
			port: 10809,
			settings: {
				userLevel: 8
			},
			sniffing: {
				enabled: true,
				destOverride: ['http', 'tls']
			}
		}
	],
	outbounds: [
		{ tag: 'direct', protocol: 'freedom' },
		{ tag: 'block', protocol: 'blackhole' },
		{
			tag: 'fragment-out',
			protocol: 'freedom',
			domainStrategy: 'UseIP',
			sniffing: {
				enabled: true,
				destOverride: ['http', 'tls']
			},
			settings: {
				fragment: {
					packets: 'tlshello',
					length: '10-20',
					interval: '10-20'
				}
			},
			streamSettings: {
				sockopt: {
					tcpNoDelay: true,
					tcpKeepAliveIdle: 100,
					mark: 255,
					domainStrategy: 'UseIP'
				}
			}
		},
		{ protocol: 'dns', tag: 'dns-out' },
		{
			protocol: 'vless',
			tag: 'fakeproxy-out',
			domainStrategy: '',
			settings: {
				vnext: [
					{
						address: 'google.com',
						port: 443,
						users: [
							{
								encryption: 'none',
								flow: '',
								id: 'UUID',
								level: 8,
								security: 'auto'
							}
						]
					}
				]
			},
			streamSettings: {
				network: 'ws',
				security: 'tls',
				tlsSettings: {
					allowInsecure: false,
					alpn: ['h2', 'http/1.1'],
					fingerprint: 'randomized',
					publicKey: '',
					serverName: 'google.com',
					shortId: '',
					show: false,
					spiderX: ''
				},
				wsSettings: {
					headers: { Host: 'google.com' },
					path: '/'
				}
			},
			mux: { concurrency: 8, enabled: false }
		}
	],
	policy: {
		levels: {
			'8': { connIdle: 300, downlinkOnly: 1, handshake: 4, uplinkOnly: 1 }
		},
		system: {
			statsOutboundUplink: true,
			statsOutboundDownlink: true
		}
	},
	burstObservatory: {
		pingConfig: {
			connectivity: 'http://connectivitycheck.platform.hicloud.com/generate_204',
			destination: 'http://www.google.com/gen_204',
			interval: '15m',
			sampling: 10,
			timeout: '3s'
		},
		subjectSelector: []
	},
	routing: {
		balancers: [
			{
				selector: [],
				strategy: { type: 'leastLoad' },
				tag: 'xray-load-balancer'
			}
		],
		domainMatcher: 'hybrid',
		domainStrategy: 'IPIfNonMatch',
		rules: [
			{
				inboundTag: ['socks-in', 'http-in'],
				type: 'field',
				port: '53',
				outboundTag: 'dns-out',
				enabled: true
			},
			{ type: 'field', outboundTag: 'direct', domain: ['regexp:.+\\.ir$'] },
			{ type: 'field', port: '443', network: 'udp', outboundTag: 'block' },
			{ type: 'field', outboundTag: 'direct', protocol: ['bittorrent'] },
			{ type: 'field', outboundTag: 'direct', ip: ['geoip:private'] },
			{ type: 'field', outboundTag: 'direct', domain: ['geosite:private'] },
			{ type: 'field', outboundTag: 'direct', domain: ['geosite:category-ir'] },
			{ type: 'field', outboundTag: 'direct', ip: ['geoip:ir'] },
			{
				type: 'field',
				outboundTag: 'fragment-out',
				domain: ['geosite:google', 'geosite:facebook', 'regexp:.+instagram\\.com$']
			},
			{
				balancerTag: 'xray-load-balancer',
				inboundTag: ['socks-in', 'http-in'],
				type: 'field'
			}
		]
	}
};
