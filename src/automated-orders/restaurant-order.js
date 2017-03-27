/**
 * Represents an order from a specific Restaurant.
 */
class RestaurantOrder {

  /**
   * @param restaurant - Restaurant instance to be ordered from.
   */
  constructor(restaurant) {
    this.restaurant = restaurant;
    this.orderAny = 0;
    this.orderRestricted = {};
  }

  /**
   * @param quantity - number of meals being ordered.
   * @param mealsRequest - type of meals being ordered.
   */
  addToOrder(quantity, mealsRequest) {
    if (mealsRequest.isUnrestricted()) return this.orderAny += quantity;
    else this.getRestrictedByType(mealsRequest).ordered += quantity;
  }

  /**
   * @param mealsRequest
   * @returns single instance of wrapped MealsRequest with a count of how many are to be provided by this Restaurant.
   */
  getRestrictedByType(mealsRequest) {
    let restricted = this.orderRestricted[mealsRequest.type];
    if (!restricted) {
      restricted = {
        mealsRequest,
        ordered: 0,
      };
      this.orderRestricted[mealsRequest.type] = restricted;
    }
    return restricted;
  }
}

module.exports = RestaurantOrder;
