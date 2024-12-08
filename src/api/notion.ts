import { NotionRow } from '../types';

const NOTION_BASE_URL = 'https://api.notion.com/v1';

async function getDatabase<T>(databaseId: string, accessToken: string) {
	const response = await fetch(`${NOTION_BASE_URL}/databases/${databaseId}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			'Notion-Version': '2021-05-13',
		},
	});
	const data: {
		results: NotionRow<T>[];
	} = await response.json();
	return data.results;
}

async function updatePage<T>(pageId: string, accessToken: string, data: T) {
	// console.log(pageId, data);
	while (true) {
		const response = await fetch(`${NOTION_BASE_URL}/pages/${pageId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
				'Notion-Version': '2021-05-13',
			},
			body: JSON.stringify({
				properties: data,
			}),
		});
		console.log(response.status, response.statusText);
		if (response.status === 200) {
			break;
		}
	}
}

export default { getDatabase, updatePage };
