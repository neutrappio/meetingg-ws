// Server
const jwt = require('jsonwebtoken');
const config = require('../config');
const { Pool } = require('pg')

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

/**
 * Memory 
 */
let users = {};


/**
 * Database
 */
const pool = new Pool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    port: config.db.port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


/**
 * Events & Listeners
 */
io.use(function (socket, next) {
    const token = socket.handshake.query.jwt;

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) next(new Error('Somthing is wrong !'))
        let userId = decoded.uid;

        pool.query('SELECT * FROM mgg.user WHERE id = $1', [userId], (err, res) => {
            if (err || !res || res.length <= 0) next(new Error('Authentication failed'))
            else {
                users[socket.id] = res.rows[0];
                console.info('SOCKET [%s] AUTHENTIFIED', socket.id);
                next();
            }
        })
    });
});


io.on('connection', function (socket) {

    /**
     * Join Meeting Room
     */
    socket.on('join-room', (roomId) => {
        console.log('Try to join-room', roomId);
        user = users[socket.id];

        pool.query(
            "SELECT * FROM mgg.meeting AS m INNER JOIN mgg.meetingusers AS mu ON (mu.meeting_id = m.id) WHERE id = $1  AND mu.user_id = $2  LIMIT 1",
            [roomId, user.id], (err, res) => {
                if (!res || res.rows.length <= 0) return socket.emit('join-room', 'Meeting does not exist!');

                socket.join(roomId)
                io.in(roomId).emit('user-connected', {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar,
                })

                socket.on('disconnect', () => {
                    socket.to(roomId).emit('user-disconnected', { id: user.id })
                })

            });
    })

    // Disconnect listener
    socket.on('disconnect', function () {
        console.info('SOCKET [%s] DISCONNECTED', socket.id);
    });

    console.info('SOCKET [%s] CONNECTED', socket.id);
});

io.on('error', function (err) {
    console.log('error', err);
});


server.listen(config.port, 'localhost', () => {
    console.log("Connected to http://192.168.1.87:" + config.port);
});
