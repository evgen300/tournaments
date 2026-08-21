class CategoryGroup {
  constructor(data = {}) {
    this.players = data.players || [];
    this.index = data.hasOwnProperty('index') ? data.index : null;
    this.results = data.results || [];
    this.positions = data.positions || {};
  }
}

module.exports = CategoryGroup;