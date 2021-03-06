import React from 'react'

const PairButtons = (props) => {
  const pairs = ['btc','eth','xrp','bch','ada', 'link','dash','eos',
                'ltc','dot','xtz','trx','usdc','algo','atom','etc',
                'fil','rep','omg','xlm','xmr','usdt','zec', 'doge']
  return (
  <div className='buttons pair-button'>
    {pairs.map((pair, idx) => {
      return <button className='button is-dark'
                      onClick={() => props.onClick(pair)}
                      key={idx}>
        {pair.toUpperCase()}
      </button>}
    )}
  </div>
)
}

export default PairButtons
