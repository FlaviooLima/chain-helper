import React, { Component } from "react"
import "./countdown.css"
import Timer from 'react-compound-timer';

class CountDown extends Component {
  render() {
    return (
        <Timer initialTime={this.props.timeout*1000} direction="backward" >
            {({getTime})=>{
                let currentTime = getTime();
                const extraClass = (currentTime <= 60000) ? "red-warning" : (currentTime <= 120000 ? "yellow-warning" : null);

                return (
                <React.Fragment>
                    <div className="timer-container">
                    <p className={`timer ${extraClass}`}><Timer.Minutes />m : <Timer.Seconds />s</p>
                    </div>
                </React.Fragment>
            )}}
        </Timer>
    )
  }
}

export default CountDown
