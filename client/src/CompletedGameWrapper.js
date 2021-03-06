import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Blockies from "react-blockies";

const GAS = "1000000";

const styles = theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  }
});

class CompletedGameWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      amount: '0 WEI'
    };
    this.withdraw = this.withdraw.bind(this);
  }

  componentDidMount = async () => {
    let status, amount;
    if(this.props.bet > 0 && (this.props.result == 'Won' || this.props.result == 'Draw')){
      if(this.props.result == 'Won'){
        amount = this.props.bet * 2;
      } else {
        amount = this.props.bet;
      }
      if(this.props.status == 2){
        status = "Funds available";
      } else {
        status = "No funds to withdraw";
      }
    } else {
      status = "No funds to withdraw";
      amount = 0;
    }
    amount = await this.processWEI(amount.toString());
    this.setState({
      status: status,
      amount: amount
    });
  };

  /*
  Callback for withdrawing from a game.
  */
  async withdraw() {
    this.setState({ status: "Withdrawing funds..." });
    this.render();
    await this.props.rps.withdraw(
      this.props.gameID,
      { from: this.props.playerAddress, gas: GAS }
    );
    this.setState({ status: "Funds withdrawn" });
    this.props.onWithdrawn();
    this.render();
  }

  async processWEI(wei){
		let string;
		if(wei.length > 14){
			string = await this.props.enigmaSetup.web3.utils.fromWei(wei, 'ether');
			string = string + ' ETH';
		} else {
			string = wei + ' WEI';
		}
		return string;
	}

  render() {
    if(this.state.status == "Funds available"){
      return (
        <div className="game openGame">
          <span className="gameInfo">
            <Blockies
               seed={this.props.player1Address}
               scale={5}
               className="identicon"
            />
            <Blockies
               seed={this.props.player2Address}
               scale={5}
               className="identicon"
            />
            <h3>#{this.props.gameID} - {this.props.result}</h3><span>Total: {this.state.amount}</span>
          </span>
          <div className="gameAction">
            <span className="status">{this.state.status}</span>
            <Button
              onClick={this.withdraw}
              variant="outlined"
              color="primary"
            >
              Withdraw
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="game openGame">
          <span className="gameInfo">
            <Blockies
               seed={this.props.player1Address}
               scale={5}
               className="identicon"
            />
            <Blockies
               seed={this.props.player2Address}
               scale={5}
               className="identicon"
            />
            <h3>#{this.props.gameID} - {this.props.result}</h3><span>Total: {this.state.amount}</span>
          </span>
          <div className="gameAction">
            <span className="status">{this.state.status}</span>
            <Button
              variant="outlined"
              color="primary"
              disabled
            >
              Withdraw
            </Button>
          </div>
        </div>
      );
    }

  }
}

CompletedGameWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CompletedGameWrapper);
