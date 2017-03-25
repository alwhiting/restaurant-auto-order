const Meals = require("../restaurant/meals");

/**
 * An extension of Meals which provides tracking for how much of the desired quantity has been satisfied.
 */
class MealsRequest extends Meals {

  constructor(quantity, type) {
    super(quantity, type);
    this.satisfied = 0;
  }

  getRemainingToBeSatisfied() {
    return this.quantity - this.satisfied;
  }

  incrementSatisfied(quantity) {
    this.satisfied += quantity;
    if (this.satisfied > this.quantity) throw new Error(`Ordered too many ${this.type || "unrestricted-meal"} ${this.satisfied}/${this.quantity}`);
  }

  isSatisfied() {
    return this.satisfied === this.quantity;
  }
}

module.exports = MealsRequest;
