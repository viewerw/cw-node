var readline = require('readline');
var fs = require('fs');
var os = require('os');

var fReadName = './cet4.txt';
var fWriteName = './pjson.json';
var fRead = fs.createReadStream(fReadName);
var fWrite = fs.createWriteStream(fWriteName);

// var enableWriteIndex = true;
fRead.on('end', () => {
    console.log('end');
    // enableWriteIndex = false;
});

var objReadline = readline.createInterface({
    input: fRead,
    output: fWrite,
});

// var index = 1;
// fWrite.write('line' + index.toString() +':');
fWrite.write('[');
objReadline.on('line', line => {
    // console.log(index, line);
    // if (enableWriteIndex) {
    // 	// 由于readline::output是先写入后调用的on('line')事件，
    // 	// 所以已经读取文件完毕时就不需要再写行号了... sodino.com
    // 	// index ++;
    // 	var tmp = 'line' + index.toString() + ':';
    // 	fWrite.write(tmp);
    // }
    var index = line.indexOf(' ');
    var en = line.substring(0, index);
    var zh = line.substring(index + 1);
    var tmp = '{"en":"' + en + '","zh":"' + zh + '"},';
    fWrite.write(tmp);
});

objReadline.on('close', () => {
    console.log('readline close...');
    fWrite.write(']');
});
