const RestaurantOrder = require("./restaurant-order");

/**
 * Takes an OrderRequest and array of Restaurants and generates the best possible orders combination.
 */
class AutomatedOrders {

  constructor(orderRequest, restaurants) {
    this.orderRequest = orderRequest;
    this.restaurants = restaurants;

    // sort restaurants by rating; highest rating in lowest position
    if (restaurants.length > 1) restaurants.sort((a, b) => {
      if (a.rating === b.rating) return a.name.localeCompare(b.name);
      return a.rating < b.rating ? 1 : -1;
    });
    this.restaurants = restaurants;
  }

  getBestAvailableMeals() {
    const restaurantOrders = {};

    function getRestaurantOrder(restaurant) {
      let restaurantOrder = restaurantOrders[restaurant.name];
      if (!restaurantOrder) {
        restaurantOrder = new RestaurantOrder(restaurant);
        restaurantOrders[restaurant.name] = restaurantOrder;
      }
      return restaurantOrder;
    }

    this.orderRequest.mealsRequests.forEach((mealsRequest) => {
      if (mealsRequest.isSatisfied()) return;

      // not as pretty as forEach but allows better short circuit
      let restaurant;
      for (let i = 0; i < this.restaurants.length; i++) {
        restaurant = this.restaurants[i];
        if (mealsRequest.isSatisfied() || restaurant.totalAvailableMeals === 0) continue;

        const restaurantOrder = getRestaurantOrder(restaurant);
        const satisfied = restaurant.orderMeals(mealsRequest);
        if (satisfied > 0) {
          mealsRequest.incrementSatisfied(satisfied);
          restaurantOrder.addToOrder(satisfied, mealsRequest);
        }
      }
    });

    return restaurantOrders;
  }
}

module.exports = AutomatedOrders;
