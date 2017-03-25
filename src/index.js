const fs = require("fs");
const Meals = require("./restaurant/meals");
const Restaurant = require("./restaurant");
const OrderRequest = require("./automated-orders/order-request");
const MealsRequest = require("./automated-orders/meals-request");
const AutomatedOrders = require("./automated-orders");

/**
 * Simple command line interface reads JSON and runs the implementation against it.
 * Provides some basic input validation.
 */

function prettyPrintRestaurantOrder (restaurantOrders) {
  Object.keys(restaurantOrders).forEach((restaurantOrderKey) => {
    const restaurantOrder = restaurantOrders[restaurantOrderKey];
    const specials = [];
    Object.keys(restaurantOrder.orderRestricted).forEach((type) => specials.push(`${restaurantOrder.orderRestricted[type].ordered} ${type}`));
    console.log(`Restaurant ${restaurantOrder.restaurant.name}: ${specials.join(", ")}, ${restaurantOrder.orderAny} others`);
  });
}

function fail (message) {
  console.error(message);
  process.exit(1);
}

if (process.argv.length < 3) {
  console.log("Supply path to JSON file for processing");
  process.exit();
}

const path = process.argv[2];
console.log("Loading JSON file:", path);

fs.readFile(path, (err, data) => {
  if (err) {
    console.error("Error reading file", err);
    process.exit(1);
  }

  const json = JSON.parse(data.toString());

  function getValidInt(value) {
    if (!value) return fail("Can't get int from undefined.");
    const asInt = parseInt(value, 10);
    if (isNaN(asInt) || asInt !== Number(value) || asInt < 0) return fail("Numeric values are required to be positive whole numbers.");
    return asInt;
  }

  if (!json.order || !json.order.total) return fail("Missing order object or order.total.");
  if (!json.restaurants || !Array.isArray(json.restaurants) || json.restaurants.length === 0) return fail("Missing restaurants.");

  const orderTotal = getValidInt(json.order.total);
  const restrictions = [];
  Object.keys(json.order).forEach((key) => {
    if (key === "total") return;
    restrictions.push({type: key, quantity: getValidInt(json.order[key])})
  });

  const restaurants = [];
  json.restaurants.forEach((jsonRestaurant) => {
    if (!jsonRestaurant.name || !jsonRestaurant.rating || !jsonRestaurant.total) return fail("Restaurant must have at least name, rating, total");
    const restaurant = {
      name: jsonRestaurant.name,
      rating: getValidInt(jsonRestaurant.rating),
      total: getValidInt(jsonRestaurant.total),
      restrictions: [],
    };
    restaurants.push(restaurant);
    Object.keys(jsonRestaurant).forEach((key) => {
      if (key === "name" || key === "rating" || key === "total") return;
      restaurant.restrictions.push({type: key, quantity: getValidInt(jsonRestaurant[key])});
    });
  });

  const automatedOrders = new AutomatedOrders(
    new OrderRequest(orderTotal, restrictions.map((res) => new MealsRequest(res.quantity, res.type))),
    restaurants.map((restaurant) => new Restaurant(restaurant.name, restaurant.rating, restaurant.total, restaurant.restrictions.map((res) => new Meals(res.quantity, res.type))))
  );

  const restrauntOrders = automatedOrders.getBestAvailableMeals();
  prettyPrintRestaurantOrder(restrauntOrders);
});

