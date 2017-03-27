const MealsRequest = require("./meals-request");

/**
 * Represents a requested order to be filled by one or more Restaurants.
 */
class OrderRequest {

  /**
   * @param totalMeals - total number of desired meals.
   * @param restrictedMeals - array of MealsRequest instances describing restricted meal orders.
   */
  constructor(totalMeals, restrictedMeals = []) {
    let restrictedMealsTotal = restrictedMeals.reduce((acc, mealsRequest) => acc + mealsRequest.quantity, 0);
    this.mealsRequests = restrictedMeals;
    this.mealsRequests.push(new MealsRequest(totalMeals - restrictedMealsTotal));
  }

  /**
   * @returns true if all MealsRequest instances that make up this OrderRequest are satisfied.
   */
  isSatisfied() {
    for (let i = 0; i < this.mealsRequests.length; i++) {
      if (!this.mealsRequests[i].isSatisfied()) return false;
    }
    return true;
  }
}

module.exports = OrderRequest;
