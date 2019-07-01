process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const OpenVidu = require('openvidu-node-client').OpenVidu;
const OpenViduRole = require('openvidu-node-client').OpenViduRole;
const OV = new OpenVidu(`openvidu.daekyocns.co.kr:4443`, `MY_SECRET`);
const OPEN_VIDU_ENV = { OV ,  OpenViduRole}
module.exports =  OPEN_VIDU_ENV