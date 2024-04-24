const Community = artifacts.require("Community");

module.exports = function (deployer) {
  deployer.deploy(Community, "Comunidad Edificio SunSet Arena", "EntreLomas 605 Concon", "Richard Poblete", "Carolina Catoni", Date.now());
};
