require('dotenv').config()
const fs = require("fs")
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname +'/www'))

const Twit = require('twit')
const T = new Twit({
    // goto: https://apps.twitter.com/ for keys
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout: 60 * 1000// optional HTTP request timeout to apply to all requests.
})

io.on('connection', (socket)=>{
    console.log(`socket connected: ${socket.id}`)

    socket.on('get-user-tweets',(opts)=>{
        // https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
        T.get('statuses/user_timeline',{
            screen_name: opts.user,
            count: 200, // max (but can be called again with max_id)
            // max_id:opts.id, // NOTE was playing with this for recursive calls (for "next page")
        },(err,data,res)=>{
            if(err) return console.log(err)
            else socket.emit('got-tweets',data)
        })
    })
})

http.listen(3000, ()=>{ console.log('listening on *:3000') })
