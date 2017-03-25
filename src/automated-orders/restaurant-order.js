/**
 * Represents an order from a specific Restaurant.
 */
class RestaurantOrder {

  constructor(restaurant) {
    this.restaurant = restaurant;
    this.orderAny = 0;
    this.orderRestricted = {};
  }

  addToOrder(quantity, mealsRequest) {
    if (mealsRequest.isUnrestricted()) return this.orderAny += quantity;
    else this.getRestrictedByType(mealsRequest).ordered += quantity;
  }

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
