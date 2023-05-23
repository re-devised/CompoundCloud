import https from 'https';
// const ip = require('ip')

export default function ({ $axios }) {
    // if(process.server) $axios.setBaseURL(process.env.BASE_URL || 'http://' + ip.address() + ":" + (process.env.PORT ? process.env.PORT : '5000'))
    // if(process.server) $axios.setBaseURL(process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || '5000'))
    $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
}