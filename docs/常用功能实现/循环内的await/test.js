

async function test1() {
    let arr = [4, 2, 1]
    for(let i=0;i<arr.length;i++){
        const res = await handle(arr[i])
		console.log(res)
    }
	console.log('结束')
}

async function test2() {
    let arr = [4, 2, 1]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('结束')
}


function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}


/* console.log('test1');
test1() */

console.log('test2');
test2()

