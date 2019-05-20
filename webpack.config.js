const path = require('path');
module.exports = [
    {
        entry :'./src/chat.js',
        mode: "development",
        output:{
            filename:'./js/chat-bundle.js',
            path: path.resolve(__dirname, 'Client')
        },
        node: {
            fs: "empty"
         }
    },
    {
        entry :'./src/login.js',
        mode: "development",
        output:{
            filename:'./js/login-bundle.js',
            path: path.resolve(__dirname, 'Client')
        },
        node: {
            fs: "empty"
        },
        externals: {
            uws: "uws"
        }
    }
]