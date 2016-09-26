import http from 'http';

export default function (options) {
	// return new pending promise
	return new Promise((resolve, reject) => {
		// select http or https module, depending on reqested url
		const request = http.get(options, (response) => {
			// handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			// temporary data holder
			const body = [];
			// on every content chunk, push it to the data array
			response.on('data', (chunk) => body.push(chunk));
			// we are done, resolve promise with those joined chunks
			response.on('end', () => {
				const json = body.join('');

				try {
					resolve(JSON.parse(json));
				}
				catch (err) {
					reject(err);
				}
			});
		});
		// handle connection errors of the request
		request.on('error', (err) => reject(err))
	})
};
