import notion from '../api/notion';
import { Asset, NotionNumberProperty, NotionTitleProperty, TotalProperties } from '../types';

async function getTotalDB(env: Env) {
	const db = await notion.getDatabase<{
		자산: NotionTitleProperty;
	}>(env.NOTION_TOTAL_PAGE_ID, env.NOTION_API_KEY);
	return new Map<string, string>(db.map((row) => [row.properties.자산.title[0].text.content, row.id]));
}

async function getAssetDB(env: Env, pageId: string) {
	const db = await notion.getDatabase<{
		종목코드: NotionTitleProperty;
		보유수량: NotionNumberProperty;
		매입단가: NotionNumberProperty;
		목표비중: NotionNumberProperty;
	}>(pageId, env.NOTION_API_KEY);
	return db.map((row) => {
		return {
			id: row.id,
			code: row.properties.종목코드.title[0]?.text.content,
			quantity: row.properties.보유수량?.number,
			purchase: row.properties.매입단가?.number,
			target: row.properties.목표비중?.number,
		};
	});
}

async function updateValueAndLoan(env: Env, db: Map<string, string>, data: { total: number; dept: number }[]) {
	await notion.updatePage<TotalProperties>(db.get('연금저축1')!, env.NOTION_API_KEY, {
		평가: { number: data[0].total },
		대출: { number: data[0].dept },
	});
	await notion.updatePage<TotalProperties>(db.get('연금저축2')!, env.NOTION_API_KEY, {
		평가: { number: data[1].total },
		대출: { number: data[1].dept },
	});
}

async function updateValue(env: Env, pageId: string, value: number | undefined) {
	await notion.updatePage<TotalProperties>(pageId, env.NOTION_API_KEY, {
		평가: { number: value },
	});
}

async function updateAsset(env: Env, row: Asset, sum: number) {
	const targetQuantity = row.target ? Math.floor((row.target * sum) / row.price!) : undefined;
	await notion.updatePage<{
		실제비중: number;
		현재가격: number | undefined;
		목표수량: number | undefined;
	}>(row.id, env.NOTION_API_KEY, {
		현재가격: row.price,
		실제비중: row.ratio!,
		목표수량: targetQuantity,
	});
}

export default {
	getTotalDB,
	updateValueAndLoan,
	updateValue,
	getAssetDB,
	updateAsset,
};
