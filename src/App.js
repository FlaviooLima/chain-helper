import React, { Component } from "react"
import "./App.css"
import CountDown from "./components/countdown/countdown";

class App extends Component {
  constructor(props) {
    super(props);
    const apiKey = localStorage.getItem("apiKey");

    this.state = {
      apiKey: apiKey ? apiKey : "",
      timeout: null,
      interval: 10
    };

    this.timeout = null;
  }  

  componentDidMount= () => {
    this.getData(true);
  }

  handleChangeApi = (event) => {
    this.setState({apiKey: event.target.value});
  };

  getData = async (forceStart = false) => {
    if(!this.state.apiKey.length){
      return;
    }
    
    this.timeout = setTimeout(()=>{
      fetch(`https://api.torn.com/faction/?selections=chain&key=${this.state.apiKey}`)
      .then(res => res.json())
      .then(response => {
        this.setState({ timeout: null}, ()=>{
          
          if(response.error){
            this.errorHandler(response.error.error)
            return;
          }
          // minus 10 has a safenet since the torn api doesn't give an exact timer
          this.setState({ timeout: response.chain.timeout - 10 }, this.getData);  
        });
      }).catch(err => this.errorHandler(err));
    },( forceStart ? 100 : this.state.interval*1000))
  }

  errorHandler = (errorMessage) => {    
    this.setState({ apiKey: ""});
    localStorage.removeItem("apiKey");
    alert(errorMessage);
  }

  onSaveConfig= () =>{
    clearTimeout(this.timeout);
    this.getData(true);
    localStorage.setItem("apiKey", this.state.apiKey);
  }

  render() {
    return (
      <div className="App">
        <div className="logo-container">
          <img className="image-logo" src="https://i.imgur.com/rX2t7u3.jpg" alt="" width="600" height="108" />
          <img className="image-chains" src="https://i.imgur.com/MnM2Oi3.jpg" alt="" width="600" height="106" />
        </div>
        
        <div className="configs-container">
          <div className="config-wrapper">
            <p>Torn API: </p>
            <input placeholder="torn api" type="password" value={this.state.apiKey} onChange={this.handleChangeApi} />
          </div>
          <div className="config-wrapper">
            <p>Refresh interval per seconds: </p>
            <input type="text" disabled value={this.state.interval}/>
          </div>

          <button onClick={this.onSaveConfig}>
            Save Config
          </button>
        </div>
        
        <div className="main">
          {this.state.timeout ? 
              <CountDown timeout={this.state.timeout} />
          : null}
        </div>
      </div>
    )
  }
}

export default App
