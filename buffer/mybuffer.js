/*
 * Buffer类方法
 */
Buffer.from(buffer); //拷贝buffer
Buffer.from(string, [encoding]); //创建string的buffer
Buffer.from(array); //拷贝八位字节array的buffer

Buffer.alloc(size, [fill, encoding]);
Buffer.allocUnsafe(size);
Buffer.concat(arrList, [length]);
Buffer.isBuffer(obj);
Buffer.isEncoding(encoding);

/*
 * Buffer实例方法
 */
buff.fill(value, [offset, end, encoding]); // buffer数据填充
buff.slice([start, [end]]);
buff.equals(otherBuffer);
buff.buffer;
buff.length;