const url = require('url');
const { URL } = require('url');
/**
 * new URL(str) 新建URL对象 也可通过url.parse()
 *
 * url
 * @method parse(str,[parseQueryString])解析一个URL字符串返回URL对象 @param parseQueryString <Boolean> true则内部使用querystring把string转换为对象
 * @method format(urlObj) 将URL对象转换回原url字符串
 * @method resolve(from起点路径,to参考路径) 解析合并地址 
 * * * * * resolve规则：
 * * * * * 1.'/a/b/c'+'d' => '/a/b/d'
 * * * * * 1.'/a/b/c'+'./d' => '/a/b/d'
 * * * * * 1.'/a/b/c'+'../d' => '/a/d'
 * * * * * 1.'/a/b/c'+'/d' => '/d'
 * 
 * * * * * 2.'http://www.youku.com/a/b/c'+'d' => 'http://www.youku.com/a/b/d'
 * * * * * 2.'http://www.youku.com/a/b/c'+'./d' => 'http://www.youku.com/a/b/d'
 * * * * * 2.'http://www.youku.com/a/b/c'+'../d' => 'http://www.youku.com/a/d'
 * * * * * 2.'http://www.youku.com/a/b/c'+'/d' => 'http://www.youku.com/d'
 * 
 * * * * * 3.'http://www.youku.com/a/b/c/'+'d' => 'http://www.youku.com/a/b/c/d'
 * * * * * 3.'http://www.youku.com/a/b/c/'+'./d' => 'http://www.youku.com/a/b/c/d'
 * * * * * 3.'http://www.youku.com/a/b/c/'+'../d' => 'http://www.youku.com/a/b/d'
 * * * * * 3.'http://www.youku.com/a/b/c/'+'/d' => 'http://www.youku.com/d'
 * 
 * URL对象
 * @property href 被转换的原url
 * @property protocol 协议
 * @property slashes 是否包含路径与协议中间的'//'
 * @property port 端口号
 * @property host url完整地址、IP、主机名 包含端口号
 * @property hostname url完整地址、IP、主机名 不包含端口号
 * @property pathname 路径 不包含查询字符串
 * @property path 路径 包含查询字符串
 * @property search 查询字符串 包含‘？’
 * @property query 查询字符串 不包含‘？’
 * @property hash 散列字符串 包含‘#’
 */