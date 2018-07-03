/**
 * Created by ltx on 2017/9/10.
 */
const crypto=require('crypto');

module.exports={
    MD5_SUFFIX: '我家狗狗是女神',
    md5: function (str){
        var obj=crypto.createHash('md5');

        obj.update(str);

        return obj.digest('hex');
    }
};