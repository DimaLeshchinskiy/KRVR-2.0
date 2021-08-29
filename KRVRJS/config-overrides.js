const { alias, aliasJest } = require("react-app-rewire-alias");

const aliasMap = {
  "@components": "src/components",
  "@config": "src/config",
  "@context": "src/context",
  "@managers": "src/managers",
  "@modals": "src/modals",
  "@models": "src/models",
  "@data": "src/data",
  "@util": "src/util",
};

module.exports = alias(aliasMap);
module.exports.jest = aliasJest(aliasMap);
