import React, { Component} from 'react'
import Chart from './Chart'

class ChartsRangeButton extends Component {
  constructor(props){
    super(props)
    let isToggled  = props.isToggled || false

    this.state = {
      isToggled: isToggled,
    }

    this.handleClick = this.handleClick.bind(this)

  }

  handleClick(){
    this.setState({isToggled: !this.state.isToggled})
  }

  render(){

    return(
      <div className='chart-range-button'>
        <div className='button is-fullwidth is-dark has-text-white' onClick={this.handleClick}>
          {this.props.title}
        </div>
        {this.state.isToggled &&
          <div className='columns is-multiline'>
              {this.props.range.map( (val,idx) => {
                return (
                  <Chart key={idx} tf={this.props.windows[val]} timeframe={val} activePair={this.props.activePair}/>
                )
              })}
          </div>}
        </div>
    )
  }
}

export default ChartsRangeButton
