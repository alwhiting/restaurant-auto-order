/**
 * A meal type with quantity.
 */
class Meals {

  constructor(quantity, type) {
    this.quantity = quantity;
    this.type = type;
  }

  isUnrestricted() {
    return !this.type;
  }
}

module.exports = Meals;
