const express = require('express');
const router = express.Router();
const {OV, OpenViduRole} = require('../utils/OpenViduConnection');

// session 방에 대한 정보 .
const mapSessions = {};

// session 토큰과 관련됨.
const mapSessionNamesTokens = {};

const users = [{
        user: "publisher1",
        pass: "pass",
        role: OpenViduRole.PUBLISHER },
    {
        user: "publisher2",
        pass: "pass",
        role: OpenViduRole.PUBLISHER
    },
    {
        user: "publisher3",
        pass: "pass",
        role: OpenViduRole.PUBLISHER
    },
    {
        user: "subscriber",
        pass: "pass",
        role: OpenViduRole.SUBSCRIBER
    }];

function authLogin(user, pass) {
    return (user != null &&
        pass != null &&
        users.find(u => (u.user === user) && (u.pass === pass)));
}

// login user data
router.get('/users', (req, res, next) => {
    res.json(users)
});

router.post('/leaveSession', (req, res, next) => {
    let {sessionName, token} = req.body.params;
    let data = {status: 200};
    if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
        let tokens = mapSessionNamesTokens[sessionName];
        let index = tokens.indexOf(token);

        // If the token exists
        if (index !== -1) {
            // Token removed
            tokens.splice(index, 1);
            console.log(sessionName + ': ' + tokens.toString());
        } else {
            let msg = 'Problems in the app server: the TOKEN wasn\'t valid';
            console.log(msg);
            data.status = 500;

        }
        if (tokens.length == 0) {
            // Last user left: session must be removed
            console.log(sessionName + ' empty!');
            delete mapSessions[sessionName];
        }
    }

    res.json(data)
});

/* GET home page. */
router.post('/connect', function (req, res, next) {

    let {id, password, sessionId} = req.body.params;
    let user = authLogin(id, password);
    if (user) {
        req.session.loggedUser = id;
        let clientData = id;
        let sessionName = sessionId;
        let role = users.find(u => (u.user === clientData)).role;
        let serverData = JSON.stringify({serverData: req.session.loggedUser});

        let tokenOptions = {
            data: serverData,
            role: role
        };

        if (mapSessions[sessionName]) {
            let mySession = mapSessions[sessionName];

            mySession.generateToken(tokenOptions)
                .then(token => {
                    mapSessionNamesTokens[sessionName].push(token);
                    res.json({
                        sessionName: sessionName,
                        token: token,
                        nickName: clientData,
                        userName: req.session.loggedUser,
                    })
                }).catch(error => {
                console.error(error)
            })

        } else {
            console.log(`create New Session ${sessionName}`);

            OV.createSession()
                .then(session => {
                    console.log(`promise then session : ${session}`)
                    mapSessions[sessionName] = session;
                    mapSessionNamesTokens[sessionName] = [];

                    session.generateToken(tokenOptions)
                        .then(token => {
                            mapSessionNamesTokens[sessionName].push(token);
                            res.json({
                                sessionName: sessionName,
                                token: token,
                                nickName: clientData,
                                userName: req.session.loggedUser,
                            })
                        })

                        .catch(error => {
                            console.error(error)
                        })
                })

                .catch(error => {
                    console.error(error)
                })
        }
    } else {
        console.log("로그인 실패 ")
    }
});

module.exports = router;

