# Tweet Server

Socket.io server for downloading several thousand tweets for a user.

## Getting Started

```bash
# clone the repo
git clone https://github.com/brangerbriz/tweet-server
cd tweet-server

# install the dependencies
npm install

# rename the example env file
cp .env-example .env

# ... edit .env using your own twitter API credentials

# start the server
npm start
```

Navigate to http://localhost:3000 for an example. Press the "get tweets" button and wait a few seconds. You should see something like this in the `server.js` console output as and several thousand tweets appear in the body of the page.

```
[server] Socket connected: Zt0WT05AGUc2k_ImAAAA
[server] received "get-user-tweets" socket.io event for twitter user "barackobama"
[twitter] Got 200 new tweets. Total 200
[twitter] Got 200 new tweets. Total 400
[twitter] Got 200 new tweets. Total 600
[twitter] Got 200 new tweets. Total 800
[twitter] Got 200 new tweets. Total 1000
[twitter] Got 200 new tweets. Total 1200
[twitter] Got 200 new tweets. Total 1400
[twitter] Got 200 new tweets. Total 1600
[twitter] Got 200 new tweets. Total 1800
[twitter] Got 200 new tweets. Total 2000
[twitter] Got 200 new tweets. Total 2200
[twitter] Got 200 new tweets. Total 2400
[twitter] Got 199 new tweets. Total 2599
[twitter] Got 199 new tweets. Total 2798
[twitter] Got 198 new tweets. Total 2996
[twitter] Got 200 new tweets. Total 3196
[twitter] Got 34 new tweets. Total 3230
[twitter] Got 1 new tweets. Total 3231
[server] emit socket.io event "got-user-tweets"
```

## Socket.io API

`server.js` uses a socket.io websocket API running on port 3000. There are two events of interest:

```javascript
// example client.js

// request tweets from a twitter account 
socket.emit('get-user-tweets', 'barackobama')

socket.on('got-user-tweets', (err, tweets) => {
    
    // there was an error downloading tweets
    if (err) throw err
    // an array of UTF-8 tweets
    console.log(tweets)
})
```

