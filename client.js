const io = require("socket.io-client");
const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJhdWQiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJpYXQiOjE2MTYwMzYyMjIuNzA1OTc4LCJqdGkiOiIzNWI0NGMxNmFjN2YwNjNkNDEwYjQzMGE1ZmExMzllZiIsImV4cCI6MTYxNzMyODYyMi43MDU5NzgsInVpZCI6ImZlMTJhY2JlLWE0ODgtNDg4MS1iODEyLWVjMTNiNDZhMmExOCJ9.Pakw0lEJlIZCky41sa7s_-ey3-jtOVcnDDSfTK9PEX0';

setTimeout(() => {

    console.log('Start');

    const socket = io.connect('http://localhost:9000',
        {
            query: { jwt: jwt },
            transports: ['websocket'],
            reconnection: false,
            reconnectionDelay: 10000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 1
        }
    );

    socket.on('error', function (err) {
        throw new Error(err);
    });
    // Connection succeeded
    socket.on('connect', function (data) {
        socket.emit('join-room', '13c1c070-452f-42d1-bc25-5cc9a8943508');
    })

    socket.on('join-room', function (data) {
        console.log('join-room : ', data);
    })
    socket.on('user-connected', function (data) {
        console.log('user-connected : ', data);
    })
    socket.on('user-disconnected', function (data) {
        console.log('user-connected : ', data);
    })

    // Connection succeeded
    // socket.on('disconnect', function (data) {
    //     console.log('disconnect', data);
    // })

    socket.on("connect_error", err => {
        console.log(err.message); // not authorized
    });
}, 1000);


// process.env.JWT_SIGNER_KEY_BASE64BASE
