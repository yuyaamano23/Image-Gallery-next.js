const { merge } = require('webpack-merge');

module.exports = {
    reactStrictMode: true,
    // 外部ドメインを使用するために設定
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'lh3.googleusercontent.com',
        ],
    },
    distDir: './.next',
    webpack: (config) => {
        return merge(config, {
            resolve: {
                alias: {
                    firebaseui: 'firebaseui-ja',
                },
            },
        });
    },
};
