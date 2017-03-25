/**
 * A restaurant with a name, rating and collection of available meals.
 */
class Restaurant {

  /**
   * @param name - the Restaurant's name!
   * @param rating - the Restaurant's rating; arbitrary, higher is better.
   * @param totalAvailableMeals - total meals the Restaurant can serve today.
   * @param availableRestrictedMeals - array of Meals that describe the availability of restricted meals.
   */
  constructor(name, rating, totalAvailableMeals, availableRestrictedMeals = []) {
    this.name = name;
    this.rating = rating;
    this.totalAvailableMeals = totalAvailableMeals;

    // map for quick access
    this.availableRestrictedMeals = {};
    availableRestrictedMeals.forEach((meal) => this.availableRestrictedMeals[meal.type] = meal);
  }

  /**
   * @param meals - MealsRequest instance with desired restriction if any and quantity.
   * @returns quantity of requested meals this restaurant is able to satisfy.
   */
  orderMeals(mealsRequest) {
    const totalAvailableOfType = this.getAvailableQuantity(mealsRequest);
    const desiredQuantity = mealsRequest.getRemainingToBeSatisfied();

    if (desiredQuantity > totalAvailableOfType) {
      this.decrementAvailableQuantity(mealsRequest, totalAvailableOfType);
      return totalAvailableOfType;
    }

    this.decrementAvailableQuantity(mealsRequest, desiredQuantity);

    return desiredQuantity;
  }

  /**
   * @param meals - Meals instance whose type we want to know the quantity available.
   * @returns quantity of available meals of given type.
   */
  getAvailableQuantity(meals) {
    if (meals.isUnrestricted()) return this.totalAvailableMeals;

    const availableRestricted = this.availableRestrictedMeals[meals.type];
    if (!availableRestricted) return 0;

    return availableRestricted.quantity < this.totalAvailableMeals
      ? availableRestricted.quantity
      : this.totalAvailableMeals;
  }

  /**
   * Decrements total available meals as well as restricted meals if applicable.
   * @param meals - Meals instance whose type we want to decrement the restaurant's available quantity.
   * @param quantity by which to decrement available meals of given type.
   */
  decrementAvailableQuantity(meals, quantity) {
    this.totalAvailableMeals -= quantity;
    if (!meals.isUnrestricted()) {
      const availableRestricted = this.availableRestrictedMeals[meals.type];
      if (!availableRestricted) return;
      availableRestricted.quantity -= quantity;
    }
  }
}

module.exports = Restaurant;
