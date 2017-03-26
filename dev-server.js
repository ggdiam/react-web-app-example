/**
 * Created by Alexander Sveshnikov on 25.11.16.
 */

require('babel-register')({
    'plugins': [
        [
            'babel-plugin-transform-require-ignore',
            {
                extensions: ['.scss']
            }
        ]
    ]
});

require('./src/server');