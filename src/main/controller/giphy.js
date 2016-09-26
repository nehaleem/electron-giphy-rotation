import url from 'url';

import request from '../lib/request';

function _generateApiRequest (methodName, queryObject = {}) {
	const requestUrl = url.format({
		protocol: 'http',
		host: 'api.giphy.com',
		pathname: `v1/gifs/${methodName}`,
	});

	const requestOptions = {
		method: 'GET',
		uri: requestUrl,
		qs: Object.assign(
			queryObject,
			{
				api_key: 'dc6zaTOxFJmzC' // Beta KEY
			}
		),
		json: true
	};

	return request(requestOptions);
}

export function search (query, { limit = 1, offset = 0 } = {}) {
	if (typeof query !== 'string' || !query.length) {
		return Promise.reject(new TypeError('First argument "query" must be typeof String'));
	}

	return _generateApiRequest('search', { q: query, limit, offset })
		.then((result) => {
			const images = result.data
				.map((image) => {
					const { url, width, height } = image.images.original;

					return {
						url,
						width: Number.parseInt(width, 10),
						height: Number.parseInt(height, 10),
					};
				});

			return {
				images,
				pagination: result.data.pagination,
			};
		});
}
