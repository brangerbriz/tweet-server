'use strict'
const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const io = require('socket.io')(http)
const tw = require('./src/twitter.js')

app.use(cors())
app.use(express.static(path.join(__dirname, 'www')))

io.on('connection', (socket) => {
    console.log(`[server] Socket connected: ${socket.id}`)
    socket.on('get-user-tweets', async (user) => {
        console.log(`[server] received "get-user-tweets" socket.io event for twitter user "${user}"`)
        try {
            const tweets = await tw.getUserTweets(user)
            io.emit('got-user-tweets', null, tweets)
            console.log(`[server] emit socket.io event "got-user-tweets"`)
        } catch (err) {
            io.emit('got-user-tweets', err, null)
            console.log(`[server] emit socket.io event "got-user-tweets" with error:`)
            console.error(err)
        }
    })
})

http.listen(3000, () => { console.log('[server] Listening on http://0.0.0.0:3000') })
