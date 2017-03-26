/**
 * Created by Alexander Sveshnikov on 21.12.16.
 */
import express from 'express';
var router = express.Router();

router.get('/redirect/*', (req, res) => {
    var url = req.url;

    // console.log('req.url', req.url);

    url = url.replace('/redirect/', 'http://');

    res.writeHead(301, {
        'Location': url
    });
    res.end();
});

module.exports = router;