import kis from '../api/kis';
import { Asset } from '../types';

async function getAuthorization(env: Env) {
	const { kv } = env;
	const auth1 = await kv.get('PSA1_AUTHORIZATION');
	const auth2 = await kv.get('PSA2_AUTHORIZATION');
	let token1: string = '',
		token2: string = '';
	if (!auth1) {
		console.log('PSA1_AUTHORIZATION 만료로 인한 재발급');
		token1 = await kis.getAccessToken(env.PSA1_APP_KEY, env.PSA1_APP_SECRET);
		await kv.put('PSA1_AUTHORIZATION', token1, {
			expirationTtl: 12 * 60 * 60,
		});
	}
	if (!auth2) {
		console.log('PSA2_AUTHORIZATION 만료로 인한 재발급');
		token2 = await kis.getAccessToken(env.PSA2_APP_KEY, env.PSA2_APP_SECRET);
		await kv.put('PSA2_AUTHORIZATION', token2, {
			expirationTtl: 12 * 60 * 60,
		});
	}
	return [auth1 || token1, auth2 || token2];
}

async function getPSAInfo(env: Env, auth: string[]) {
	const [auth1, auth2] = auth;
	const data1 = await kis.getPSAInfo(env.PSA1_APP_KEY, env.PSA1_APP_SECRET, env.PSA1_CANO, auth1);
	// console.log(data1);
	const data2 = await kis.getPSAInfo(env.PSA2_APP_KEY, env.PSA2_APP_SECRET, env.PSA2_CANO, auth2);
	// console.log(data2);
	return [data1, data2];
}

async function getAssetPrice(env: Env, auth: string[], code: string) {
	return await kis.getETFPrice(env.PSA1_APP_KEY, env.PSA1_APP_SECRET, auth[0], code);
}

async function getUSPrice(env: Env, auth: string[], code: string) {
	const nys = await kis.getUSPrice(env.PSA1_APP_KEY, env.PSA1_APP_SECRET, auth[0], code, 'NYS');
	const nas = await kis.getUSPrice(env.PSA1_APP_KEY, env.PSA1_APP_SECRET, auth[0], code, 'NAS');
	const ams = await kis.getUSPrice(env.PSA1_APP_KEY, env.PSA1_APP_SECRET, auth[0], code, 'AMS');
	if (nys.price) return nys;
	if (nas.price) return nas;
	if (ams.price) return ams;
}

async function getAssetValues(env: Env, auth: string[], db: Asset[], us: boolean = false): Promise<[Asset[], number]> {
	const values: Asset[] = [];
	let sum = 0;
	for (const row of db) {
		const { id, quantity, code, purchase, target } = row;
		if (!code) {
			values.push({
				id,
				target,
				value: purchase,
			});
			continue;
		}
		if (us) {
			const { price, currency } = (await getUSPrice(env, auth, code))!;
			const value = quantity! * price!;
			values.push({
				id,
				price,
				value,
				target,
				currency,
			});
			sum += value;
			continue;
		}
		const price = await getAssetPrice(env, auth, code);
		const value = quantity! * price!;
		values.push({
			id,
			price,
			value,
			target,
		});
		sum += value!;
	}
	for (const row of values) {
		row.ratio = row.value! / sum;
	}
	return [values, sum];
}

export default {
	getAuthorization,
	getPSAInfo,
	getAssetPrice,
	getAssetValues,
	getUSPrice,
};
