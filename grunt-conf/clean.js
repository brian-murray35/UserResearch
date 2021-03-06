'use strict';
module.exports = {
    dev: [
        'dev/**/*',
        'dev/**/.*',
        '!dev/**/.git*'
    ],

    dist: [
        'dist/**/*',
        'dist/**/.*',
        '!dist/**/.git*'
    ],

    test: [
        'dev/**/*',
        'dev/**/.*',
        '!dev/**/.git*'
    ],

     svg: [
         'client/assets/norman-user-research-client.svg'
     ]
};
