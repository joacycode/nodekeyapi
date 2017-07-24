const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
/**
 * crypto模块
 * @method getCiphers() node中能使用的所有加密算法
 * @method getHashes() node中能使用的所有散列算法
 * 
 * openssl genrsa -out key.pem 1024 创建PEM私钥
 * openssl req -key key.pem -new -x509 -out cert.pem 为一个私钥创建一个PEM格式公钥
 * 
 * 
 * 创建HASH对象 
 * @method createHash(algorithm) 创建一个hash对象 
 * * * * * @param algorithm nodejs中可以使用的算法
 * * * * * @return [HASH] 返回一个HASH对象
 * 
 * 创建HMAC对象
 * @method createHmac(algorithm,key)
 * * * * * @param algorithm nodejs中可以使用的算法
 * * * * * @param key [string,buffer,TypeArray,DataView] 用于指定PEM格式的密钥
 * * * * * @return [HMAC] 返回一个HMAC对象
 * 
 * 创建Cipher对象
 * @method createCipher(algorithm,password) 使用指定的算法和密码创建cipher对象
 * * * * * @param algorithm 加密数据算法
 * * * * * @param password [string,buffer,TypeArray,DataView] 加密使用的密码
 * * * * * @return 返回cipher对象
 * * * * * 
 * @method createCipheriv(algorithm,password,iv) 使用指定的算法和密码和初始向量IV 创建cipher对象
 * * * * * @param algorithm 加密数据算法
 * * * * * @param password [string,buffer,TypeArray,DataView] 加密使用的密码 
 * * * * * @param iv 初始向量 必须为二进制字符串或buffer
 * * * * * @return 返回cipher对象
 * 
 * 创建Decipher对象
 * @method createDecipher(algorithm,password) 使用指定的算法和密码 创建decipher对象
 * * * * * @param algorithm 解密数据算法，必须与加密密码保持一致
 * * * * * @param password [string,buffer,TypeArray,DataView]解密使用的密码，必须与加密密码保持一致
 * * * * * @return 返回decipher对象
 * * * * * 
 * @method createDecipheriv(algorithm,password,iv) 使用指定的算法和密码和初始向量IV 创建decipher对象
 * * * * * @param algorithm 解密数据算法
 * * * * * @param password [string,buffer,TypeArray,DataView] 解密使用的密码，必须与加密密码保持一致
 * * * * * @param iv 初始向量 必须为二进制字符串或buffer
 * * * * * @return 返回decipher对象
 * 
 * 创建sign对象
 * @method createSign(algorithm) 创建sign对象
 * * * * * @param algorithm 加密该数据时所用的算法
 * 
 * 创建verify对象
 * @method createVerify(algorithm) 创建verify对象
 * * * * * @param algorithm 验证签名数据时所用的算法 与加密一致
 */


/**
 * HASH对象
 * 
 * @method update(data,[encoding]) 创建一个hash摘要(往hash对象里增加数据),输出之前可以多次创建摘要
 * * * * * @param data [buffer,string] 指定摘要内容
 * * * * * @param encoding ['utf8','ascii','binary'] 摘要内容的编码格式，data buffer可以不指定，string必须指定
 * @method digest([encoding]) 输出摘要内容 输出之后不能再向hash对象追加摘要
 * * * * * @param encoding ['hex','binary','base64'] 输出摘要内容的编码格式，不指定则输出buffer
 * * * * * @return [buffer,string] 指定encoding输出字符串形式摘要，否则输出buffer
 */
{
    const hashSum = crypto.createHash("sha1");
    const hashRFile = fs.createReadStream("./crypto.txt");
    hashRFile.on("data", data => {
        hashSum.update(data, "utf8");
    });
    hashRFile.on("end", () => {
        const data = hashSum.digest("hex");
        console.log(`HASH算法输出摘要${data}`);
    });
}

/**
 * HMAC对象
 * 将散列算法和密钥结合在一起，以阻止对签名的完整性破坏
 * 
 * @method update(data) 创建一个hmac摘要(往hmac对象里增加数据),输出之前可以多次创建摘要
 * * * * * @param data [buffer,string] 指定摘要内容
 * * * * * @param encoding ['utf8','ascii','binary'] 摘要内容的编码格式，data buffer可以不指定，string必须指定
 * @method digest([encoding]) 输出摘要内容 输出之后不能再向hmac对象追加摘要
 * * * * * @param encoding ['hex','binary','base64'] 输出摘要内容的编码格式，不指定则输出buffer
 * * * * * @return [buffer,string] 指定encoding输出字符串形式摘要，否则输出buffer
 * * * * *
 */
{
    const hmacRFile = fs.createReadStream("./crypto.txt");
    const pem = fs.readFileSync("./key.pem"); //读PEM密钥作为key
    const key = pem.toString("ascii");
    const hmacSum = crypto.createHmac("sha1", key);
    hmacRFile.on("data", data => {
        hmacSum.update(data, "utf8");
    });
    hmacRFile.on("end", () => {
        const data = hmacSum.digest("hex");
        console.log(`HMAC算法输出摘要${data}`);
    });
}


/**
 * 公钥加密
 * 公钥 加密私钥能打开的数据以及验证签名
 * 私钥 解密公钥所加密的数据以及进行签名
 * 
 * Cipher对象
 * 用于加密数据
 * 
 * @method update(data,[input_encoding],[output_encoding]) 指定需要被加密的数据
 * * * * * @param data 指定需要被加密的数据
 * * * * * @param input_encoding ['utf8','ascii','binary'] 指定被加密的数据使用的编码格式
 * * * * * @param output_encoding ['hex','binary','base64'] 指定输出加密数据时使用的编码格式 指定则返回string数据 否则返回buffer
 * * * * * @return 返回被分块加密的数据
 * * * * *
 * @method final([output_encoding]) 返回所有被update的加密数据,字节数不够一个块则使用PKCS填充,执行完此方法后则不能再追加加密数据
 * * * * * @param output_encoding 指定输出加密数据时使用的编码格式
 * * * * * @return 返回所有被update的加密数据
 * 
 * Decipher对象 
 * 用于解密数据
 * @method update(data,[input_encoding],[output_encoding]) 指定需要被解密的数据
 * * * * * @param data 指定需要被解密的数据
 * * * * * @param input_encoding ['hex','binary','base64']指定被解密的数据使用的编码格式
 * * * * * @param output_encoding ['utf8','ascii','binary']指定输出解密数据时使用的编码格式 指定则返回string数据 否则返回buffer
 * * * * * @return 返回被分块解密的数据
 * * * * *
 * @method final([output_encoding]) 返回所有被update的解密数据,字节数不够一个块则使用PKCS填充,执行完此方法后则不能再追加解密数据
 * * * * * @param output_encoding ['utf8','ascii','binary']指定输出解密数据时使用的编码格式
 * * * * * @return 返回所有被update的解密数据
 */
{
    const pem = fs.readFileSync("./key.pem");
    const key = pem.toString("ascii");

    let encrypt = crypto.createCipher("blowfish", key);
    let crypted = encrypt.update("nodejs cipher", "utf8", "hex");
    crypted += encrypt.final("hex");
    console.log(`cipher输出${crypted}`);

    let decrypt = crypto.createDecipher("blowfish", key);
    decrypt.setAutoPadding(false);
    let deCrypted = decrypt.update(crypted, "hex", "utf8");
    deCrypted += decrypt.final("utf8");
    console.log(`decipher输出${deCrypted}`);
}



/** 
 * Sign类 用于生成签名
 * @method update(data,[inputEncoding]) 指定需要被加密的数据
 * * * * * @param data [String,Buffer,TypeArray,DataView] 
 * * * * * @param inputEncoding ['utf8','ascii','latin1'] 
 * @method sign(privateKey,[outputFormat]) 对被加入的数据进行签名,之后不能再次使用update()
 * * * * * @param privateKey [String,Object] 用于指定PEM格式的私钥
 * * * * * @param outputFormat ['base64','binary','hex']
 * * * * * @return 生成字符串格式的签名内容
 * 
 * Verify类 用于验证签名
 * @method update(data,[inputEncoding]) 指定需要被验证的数据
 * * * * * @param data [String,Buffer,TypeArray,DataView] 
 * * * * * @param inputEncoding ['utf8','ascii','latin1'] 
 * @method verify(object,signature,[signatureFormat]) 使用object和signature验证update提供的数据
 * * * * * @param Object [String,Object] 用于指定验证时所使用的对象,[RSA公钥,DSA公钥,X.509证书]
 * * * * * @param signature [String,Buffer,TypeArray,DataView] 指定被验证的签名
 * * * * * @param signatureFormat ['base64','binary','hex']
 * * * * * @return [Boolean] 根据验证的数据签名和公钥返回验证结果（布尔值）
 */
{
    const privatePem = fs.readFileSync("./key.pem"); //私钥
    const publicPem = fs.readFileSync("./cert.pm"); // 公钥
    const key = privatePem.toString();
    const pubKey = publicPem.toString();
    const data = "some data";
    const sign = crypto.createSign("RSA-SHA256");
    const verify = crypto.createVerify("RSA-SHA256");

    sign.update(data);
    let sig = sign.sign(key, "hex"); //生成字符串格式的签名内容
    // console.log(sign.sign(privateKey, "hex")); //使用RSA-SHA256和私钥对数据进行签名后，该签名内容的hex编码格式的字符串
    verify.update(data);
    console.log(verify.verify(pubKey, sig, "hex"));
}


/**
 * zlib 解压缩
 * 压缩 createGzip creataDeflate
 * 解压缩 createGunzip creataInflate createUnzip(既可以对gzip也可以对deflate进行解压)
 * zlib.createGzip([options]) 使用Gzip算法压缩数据 @return Gzip对象
 * zlib.createGunzip([options]) 对使用Gzip算法压缩的数据进行解压缩 @return Gunzip对象
 * @param options [Object]
 * {
 * flush:,
 * finishFlush:,
 * chunkSize:,
 * windowBits:,
 * level:,
 * memLevel:,
 * strategy:,
 * dictionary:,
 * info:
 * }
 */
const gzip = zlib.createGzip();
const inp = fs.createReadStream("./zlibTest.txt");
const out = fs.createWriteStream("./zlibGzip.txt.gz");
inp.pipe(gzip).pipe(out);
setTimeout(() => {
    const gunzip = zlib.createGunzip();
    const gunInp = fs.createReadStream("./zlibGzip.txt.gz");
    const gunOut = fs.createWriteStream("./zlibGunzip.txt");
    gunInp.pipe(gunzip).pipe(gunOut);
}, 100);