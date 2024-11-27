const TournamentScore = artifacts.require("TournamentScore");

module.exports = function (deployer, network, accounts) {
  console.log("Deploying with account:", accounts[0]);
  deployer.deploy(TournamentScore, { gas: 12000000 });
};

