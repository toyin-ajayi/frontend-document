function downloadImg () {
	let aLink = document.createElement('a')
	aLink.download = 'fileName.png' // 文件名后缀需要和dataurl表示的相同，否则可能乱码
	aLink.href = dataUrl
	aLink.click()
}
