const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env')})
const Twit = require('twit')
const T = new Twit({
    // goto: https://apps.twitter.com/ for keys
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout: 60 * 1000// optional HTTP request timeout to apply to all requests.
})

async function getUserTweets(user) {
    // https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
    
    const tweets = []
    let batch = await getUserTweetBatch(user)

    tweets.push(...batch)
    console.log(`[twitter] Got ${batch.length} new tweets. Total ${tweets.length}`)
    while (batch.length > 1) {
        let id = batch[batch.length - 1].id
        batch = await getUserTweetBatch(user, id)
        tweets.push(...batch)
        console.log(`[twitter] Got ${batch.length} new tweets. Total ${tweets.length}`)
    }
    return tweets.map(tweet => tweet.text)
}

function getUserTweetBatch(user, maxId) {
    return new Promise((resolve, reject) => {
        T.get('statuses/user_timeline', {
            screen_name: user,
            count: 200, // max (but can be called again with max_id)
            max_id: maxId
        }, (err, data, res) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

module.exports = {
    getUserTweets
}