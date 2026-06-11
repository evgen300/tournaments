const CryproJS = require("crypto-js");

class Category {
  constructor(category) {
    this.title = category.title || '';
    this.sex = category.sex || '';
    this.ageFrom = category.ageFrom || null;
    this.ageTo = category.ageTo || null;
    this.type = category.type || "individual";
    this.seeds = category.seeds || false;
    this.dateStart = category.dateStart || false;
    this.dateEnd = category.dateEnd || false;
    this.players = category.players || [];
    this.draw = category.draw || [];
    this.seedPlayers = category.seedPlayers || [];
    this.id = category.id || CryproJS.SHA256(this.title + this.sex + this.ageFrom + this.ageTo + this.type + this.seeds + Date.now()).toString();
  }
}

module.exports = Category;