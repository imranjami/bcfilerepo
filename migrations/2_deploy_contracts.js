const BCFileRepo = artifacts.require("BCFileRepo");

module.exports = function(deployer) {
	deployer.deploy(BCFileRepo);
};
