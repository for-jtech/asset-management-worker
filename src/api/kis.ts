import { PSAInfo } from '../types';
import { getJSON } from './util';

const KIS_BASE_URL = 'https://openapi.koreainvestment.com:9443';

async function getAccessToken(appkey: string, appsecret: string) {
	console.log(appkey, appsecret);
	const response = await fetch(`${KIS_BASE_URL}/oauth2/tokenP`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			grant_type: 'client_credentials',
			appkey: appkey,
			appsecret: appsecret,
		}),
	});
	const data: { access_token: string } = await response.json();
	// console.log(data);
	return data.access_token;
}

function getKISHeaders(appkey: string, appsecret: string, auth: string, tr_id: string) {
	return {
		'content-type': 'application/json',
		authorization: `Bearer ${auth}`,
		appkey,
		appsecret,
		tr_id,
		custtype: 'P',
	};
}

async function getPSAInfo(appkey: string, appsecret: string, CANO: string, auth: string) {
	const URL = `${KIS_BASE_URL}/uapi/domestic-stock/v1/trading/inquire-account-balance`;
	const params = {
		CANO,
		ACNT_PRDT_CD: '22',
		INQR_DVSN_1: '',
		BSPR_BF_DT_APLY_YN: '',
	};
	const headers = getKISHeaders(appkey, appsecret, auth, 'CTRP6548R');
	const data = await getJSON<{
		output2: PSAInfo;
	}>(URL, params, headers);
	const netTotal = Number.parseInt(data.output2.tot_asst_amt);
	const dept = Number.parseInt(data.output2.loan_amt_smtl);
	return {
		total: netTotal + dept,
		dept,
	};
}

async function getETFPrice(appkey: string, appsecret: string, auth: string, code: string) {
	const URL = `${KIS_BASE_URL}/uapi/etfetn/v1/quotations/inquire-price`;
	const params = {
		fid_input_iscd: code,
		fid_cond_mrkt_div_code: 'J',
	};
	const headers = getKISHeaders(appkey, appsecret, auth, 'FHPST02400000');
	const data = await getJSON<{
		output: {
			stck_prpr: string;
		};
	}>(URL, params, headers);
	return Number.parseInt(data.output.stck_prpr);
}

async function getUSPrice(appkey: string, appsecret: string, auth: string, code: string, exchange: string) {
	const URL = `${KIS_BASE_URL}/uapi/overseas-price/v1/quotations/price-detail`;
	const params = {
		AUTH: '',
		EXCD: exchange,
		SYMB: code,
	};
	const headers = getKISHeaders(appkey, appsecret, auth, 'HHDFS76200200');
	const data = await getJSON<{
		output: {
			last: string;
			t_rate: string;
		};
	}>(URL, params, headers);
	return { price: Number.parseFloat(data.output.last), currency: Number.parseFloat(data.output.t_rate) };
}

export default { getAccessToken, getPSAInfo, getETFPrice, getUSPrice };
