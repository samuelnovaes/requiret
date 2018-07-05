const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if (isMainThread) {
	const path = require('path')
	module.exports = file => (...args) => new Promise((resolve, reject) => {
		const worker = new Worker(__filename, {
			workerData: {
				file: path.resolve(file),
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
	const func = require(workerData.file)
	func(...workerData.args)
	.then(data => {
		parentPort.postMessage(data)
	})
	.catch(error => {
		throw error
	})
}