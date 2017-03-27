/**
 * A meal type with quantity.
 */
class Meals {

  /**
   * @param quantity of meals.
   * @param type of meals.
   */
  constructor(quantity, type) {
    this.quantity = quantity;
    this.type = type;
  }

  /**
   * @returns true if this Meals is not of a restricted type.
   */
  isUnrestricted() {
    return !this.type;
  }
}

module.exports = Meals;
