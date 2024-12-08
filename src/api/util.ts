export async function getJSON<T>(url: string, params: Record<string, string>, headers: Record<string, string>): Promise<T> {
	const queryParams = new URLSearchParams(params).toString();
	const response = await fetch(`${url}?${queryParams}`, {
		method: 'GET',
		headers: headers,
	});
	return await response.json();
}
