const got = require('got');
const utils = require('../utils/utils');
require('dotenv').config()

const Redis = require('ioredis')
const client = new Redis({
  port: process.env.DB_PORT,
  password: process.env.DB_PASS
})

let analyzeMarket = async (asset) => {
  try {
    const response = await got(`https://api.cryptowat.ch/markets/kraken/${asset}usd/ohlc?apikey=${process.env.API_KEY}`);
    // const response = await cwClient.getOHLC('kraken', `${asset}usd`)
    let candles = JSON.parse(response.body),
        results = candles.result
        windows = utils.parseMarketData(results)
        scanTypes = new Set()
    windows = windows.map(dp => {
      return [dp.timeframe, dp]
    })

    // scanning for crossvers and storing results in redis
    var watchlist = utils.populateWatchlist(Object.fromEntries(windows))
    watchlist.forEach(scan => {
        let redisKey = 'wl:' + scan.type
        scan.crossovers.forEach(async crossover => {
            let valueString = asset + ':' + scan.window + ':' + scan.type + ':' + crossover.x + ':' + (crossover.color === utils.longColor ? 'long' : 'short')
            //record scans type
            scanTypes.add(scan.type)
            //run redis sorted set add
            await client.zadd(redisKey, crossover.x, valueString)
      })
    })
    // checks if sets are above certain length and truncates them
    scanTypes.forEach(async type => {
      let scanKey = 'wl:' + type,
          length = await client.zcard(scanKey)
      if(length > 500){
        await client.zremrangebyrank(scanKey, 0, -201)
      }
      console.log(scanKey + ':' + length)


    })
    console.log('ok')
  } catch(err) {
    console.error(`error:  ${err.message}\n${err.stack}`)
    return {}
  }
  return JSON.stringify(watchlist)
}
  const assets = [
    'btc','eth',
    'bch', 'ada','link','dash','eos',
    'ltc','dot','xtz','trx','algo','atom'
              ]

//Begin runtime
//declare an asynchronous arrow function to analyze the market, and run it
;(async () => {
  try {
    Promise.all(assets.map(asset => {
      return analyzeMarket(asset)
    })).then((res) => {client.quit()})
  } catch(err) {
    console.error(`error:  ${err.message}\n${err.stack}`)
  }
})()
process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});

module.exports.analyzeMarket = analyzeMarket
