const wt = require('worker_threads')

if (wt.isMainThread) {
	const path = require('path')
	module.exports = file => (...args) => new Promise((resolve, reject) => {
		const worker = new wt.Worker(__filename, {
			workerData: {
				file: /^\.{0,2}\//.test(file) ? path.resolve(file) : file,
				args
			}
		})
		worker.on('message', resolve)
		worker.on('error', reject)
		worker.on('exit', code => {
			if(code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
		})
	})
}
else {
	require(wt.workerData.file)(...wt.workerData.args)
	.then(data => {
		wt.parentPort.postMessage(data)
	})
	.catch(error => {
		throw error
	})
}