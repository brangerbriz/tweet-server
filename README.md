# Tweet Server

HTTP + Socket.io server for downloading several thousand Tweets for a specific twitter user.

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

## HTTP API

`server.js` offers an api to download a user's tweets on port 3000. Here is an example of it's usage:

```javascript
const response = await fetch(`http://localhost:3000/api/barackobama`)
if (response.ok) {
    const json = await response.json()
    if (json.tweets) {
        // join an array of text into a single string using newline characters
        const text = json.tweets.join('\n')
    }
} else {
    // maybe username doesn't exist
}

```

## Socket.io API

`server.js` uses a socket.io websocket API running on port 3000. There are two events of interest:

```javascript
// example client.js

// request tweets from a twitter account 
socket.emit('get-user-tweets', 'barackobama')

socket.on('got-user-tweets', (err, user, tweets) => {
    
    // there was an error downloading tweets
    if (err) throw err

    // user will always be set, even if there is an error

    // an array of UTF-8 tweets or null if there was an error
    console.log(tweets)
})
```

## License

Copyright (C) 2018 Branger_Briz

Licensed under the [GPL v3](LICENSE) or any later version. 
