import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = { 
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    // don't send any accounts in call() methods;
    // because it browser react take first account from metamask
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers();
    const balance = await web3.eth.getBalance(lottery.options.address);
    console.log(players);

    this.setState({manager, players: players._method.outputs, balance})
  }

  onSubmit = async (event) =>{
    event.preventDefault();
    
    const account = await web3.eth.getAccounts();

    this.setState({message: "Waiting on transaction success..."})

    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: "You have been entered!"})
  }

  pickWinner = async () =>{
    const account = await web3.eth.getAccounts();

    this.setState({message: "Waiting on transaction success..."})
   
    await lottery.methods.pickWinner().send({
      from: account[0],
    });

    this.setState({ message: "A winner has been picked!"})
      
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.</p>
         <p>There are currently {this.state.players.length} people entered,</p>
         <p> competing to win {web3.utils.fromWei(this.state.balance, 'ether') } ether!</p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
          <label>Amount of ether to enter</label>
          <input  value={this.state.value}
          onChange={event => this.setState({value: event.target.value})}/>
          </div>
          <button>Enter</button>
        </form>
        <hr />
       
       <h4>Ready to pick a winner?</h4>
       <button onClick={this.pickWinner}>Pick a winner!</button>
 
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
