/**
 * Created by Alexander on 19.12.2016.
 */
import request from 'request';
import express from 'express';
var router = express.Router();

//нужны урлы типа http://localhost:8123/proxy/b1.vestifinance.ru/c/245008.310x248.jpg
//т.е. без http:// а просто вместо http://b1.vestifinance.ru/c/245008.310x248.jpg
//делаем /proxy/b1.vestifinance.ru/c/245008.310x248.jpg
router.get('/proxy/*', (req, res) => {
    var url = req.url;

    // console.log('req.url', req.url);

    url = url.replace('/proxy/', 'http://');
    request(url).pipe(res);
});

module.exports = router;