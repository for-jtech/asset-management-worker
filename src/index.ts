import kisService from './service/kis';
import notionService from './service/notion';

export default {
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		const start = Date.now();
		switch (controller.cron) {
			case '*/5 * * * *':
				await updatePSA(env);
				break;
			case '1,6,11,16,21,26,31,36,41,46,51,56 0-6 * * 2-6':
				await updateKOR(env);
				break;
			case '1,6,11,16,21,26,31,36,41,46,51,56 13-20 * * 2-6':
				await updateUSD(env);
				break;
		}
		console.log('소요시간:', Date.now() - start, 'ms');
	},
};

async function updatePSA(env: Env) {
	console.log('KIS Authorization 불러오기');
	const auth = await kisService.getAuthorization(env);
	// console.log(auth1, auth2);
	console.log('KIS 연금저축계좌 평가금액 및 대출금액 조회');
	const psa = await kisService.getPSAInfo(env, auth);
	console.log('Notion Total DB 조회');
	const db = await notionService.getTotalDB(env);
	console.log('Notion Total PSA 업데이트');
	await notionService.updateValueAndLoan(env, db, psa);
}

async function updateKOR(env: Env) {
	console.log('KIS Authorization 불러오기');
	const auth = await kisService.getAuthorization(env);
	console.log('Notion Total DB 조회');
	const db = await notionService.getTotalDB(env);
	console.log('KIS 리츠 가격 조회');
	const reitsPrice = await kisService.getAssetPrice(env, auth, env.REITS_CODE);
	console.log('Notion 리츠 평가금액 업데이트');
	const currentReitsValue = Number.parseInt(env.REITS_QUANTITY) * reitsPrice;
	await notionService.updateValue(env, db.get('리츠')!, currentReitsValue);
	console.log('Notion ISA DB 조회');
	const isaDB = await notionService.getAssetDB(env, env.NOTION_ISA_PAGE_ID);
	console.log('KIS ISA 가격 조회 및 Notion ISA 업데이트');
	const [isaValues, isaSum] = await kisService.getAssetValues(env, auth, isaDB);
	for (const row of isaValues) {
		await notionService.updateAsset(env, row, isaSum);
	}
	console.log('Notion ISA Total 업데이트');
	await notionService.updateValue(env, db.get('ISA')!, isaSum);
	console.log('Notion IRP DB 조회');
	const irpDB = await notionService.getAssetDB(env, env.NOTION_IRP_PAGE_ID);
	console.log('KIS IRP 가격 조회 및 Notion IRP 업데이트');
	const [irpValues, irpSum] = await kisService.getAssetValues(env, auth, irpDB);
	for (const row of irpValues) {
		await notionService.updateAsset(env, row, irpSum);
	}
	console.log('Notion IRP Total 업데이트');
	await notionService.updateValue(env, db.get('IRP')!, irpSum);
}

async function updateUSD(env: Env) {
	console.log('KIS Authorization 불러오기');
	const auth = await kisService.getAuthorization(env);
	console.log('Notion Total DB 조회');
	const db = await notionService.getTotalDB(env);
	console.log('Notion USD DB 조회');
	const usdDB = await notionService.getAssetDB(env, env.NOTION_USD_PAGE_ID);
	console.log('KIS USD 가격 조회 및 Notion USD 업데이트');
	const [usdValues, usdSum] = await kisService.getAssetValues(env, auth, usdDB, true);
	for (const row of usdValues) {
		console.log(row);
		await notionService.updateAsset(env, row, usdSum);
	}
	console.log('Notion USD Total 업데이트');
	await notionService.updateValue(env, db.get('해외')!, usdSum * (usdValues[0].currency ?? usdValues[1].currency!));
}
