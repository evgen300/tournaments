const CryproJS = require("crypto-js");

class Category {
  constructor(category) {
    this.title = category.title || '';
    this.sex = category.sex || '';
    this.ageFrom = category.ageFrom || null;
    this.ageTo = category.ageTo || null;
    this.weightFrom = category.weightFrom || null;
    this.weightTo = category.weightTo || null;
    this.type = category.type || "individual";
    this.seeds = category.seeds || false;
    this.dateStart = category.dateStart || false;
    this.dateEnd = category.dateEnd || false;
    this.players = category.players || [];
    this.draw = category.draw || [];
    this.seedPlayers = category.seedPlayers || [];
    this.hasPlayoff = category.hasPlayoff || false;
    this.hasGroups = category.hasGroups || false;
    const groupsData = category.groupsData || {};
    this.groupsData = {
      groupsCount: groupsData.groupsCount || 0,
      groupSize: groupsData.groupSize || 0,
      groupDrawBasketsCount: groupsData.groupDrawBasketsCount || 0,
      rounds: groupsData.rounds || 1
    };
    this.drawBaskets = category.drawBaskets || [];
    this.groups = category.groups || [];
    this.sport = category.sport || "";
    this.id = category.id || CryproJS.SHA256(this.title + this.sex + this.ageFrom + this.ageTo + this.type + this.seeds + Date.now()).toString();
  }
}

module.exports = Category;