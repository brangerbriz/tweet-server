'use strict'
const path = require('path')
const cors = require('cors')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const tw = require('./src/twitter.js')

app.use('/api', cors())
app.use(express.static(path.join(__dirname, 'www')))

app.get('/api/:user', async (req, res) => {
    const user = req.params.user
    try {

        const tweets = await tw.getUserTweets(user)
        console.log(`[server] /api/:user got tweets for user ${user}`)
        res.json({ error: null, tweets: tweets })
    } catch (err) {

        console.log(`[server] /api/:user got tweets for user ${user} with error:`)
        console.error(err)

        let message = `Error fetching tweets for user ${user}`
        if (err.statusCode) {
            res.status(err.statusCode)
            res.status(500)
        } else {
        }

        if (err.message) {
            message = err.message
        }

        res.json({ error: message, tweets: null })
    }
})

io.set('origins', '*:*')
io.on('connection', (socket) => {
    console.log(`[server] Socket connected: ${socket.id}`)
    socket.on('get-user-tweets', async (user) => {
        console.log(`[server] received "get-user-tweets" socket.io event for twitter user "${user}"`)

        if (typeof user !== 'string') {
            const err = TypeError('user must be a string type')
            io.emit('got-user-tweets', err, user, null)
            return
        }

        try {
            const tweets = await tw.getUserTweets(user)
            io.emit('got-user-tweets', null, user, tweets)
            console.log(`[server] emit socket.io event "got-user-tweets"`)
        } catch (err) {
            io.emit('got-user-tweets', err, user, null)
            console.log(`[server] emit socket.io event "got-user-tweets" with error:`)
            console.error(err)
        }
    })
})

http.listen(3000, () => { console.log('[server] Listening on http://0.0.0.0:3000') })
