const Meals = require("../restaurant/meals");

/**
 * An extension of Meals which provides tracking for how much of the desired quantity has been satisfied.
 */
class MealsRequest extends Meals {

  /**
   * @param quantity - desired quantity of this meal type.
   * @param type - specific type of meal or undefined if any meal will do.
   */
  constructor(quantity, type) {
    super(quantity, type);
    this.satisfied = 0;
  }

  /**
   * @returns number of meals of this type still to be ordered.
   */
  getRemainingToBeSatisfied() {
    return this.quantity - this.satisfied;
  }

  /**
   * @param quantity - increase the number of meals of this type ordered by this value.
   * @throws error if satisfied count exceeded desired quantity.
   */
  incrementSatisfied(quantity) {
    this.satisfied += quantity;
    if (this.satisfied > this.quantity) throw new Error(`Ordered too many ${this.type || "unrestricted-meal"} ${this.satisfied}/${this.quantity}`);
  }

  /**
   * @returns true if this MealsRequest is satisfied.
   */
  isSatisfied() {
    return this.satisfied === this.quantity;
  }
}

module.exports = MealsRequest;
