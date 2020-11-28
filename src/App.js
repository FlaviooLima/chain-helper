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

          this.setState({ timeout: response.chain.timeout }, this.getData);  
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
