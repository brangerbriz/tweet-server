'use strict'
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const tw = require('./twitter.js')

app.use(express.static(__dirname +'/www'))

io.on('connection', (socket)=>{
    console.log(`socket connected: ${socket.id}`)
    socket.on('get-user-tweets', async (opts) => {
        try {
            const tweets = await tw.getUserTweets(opts.user)
            io.emit('got-user-tweets', null, tweets)
        } catch (err) {
            console.error(err)
            io.emit('got-user-tweets', err, null)
        }
    })
})

http.listen(3000, ()=>{ console.log('listening on *:3000') })
