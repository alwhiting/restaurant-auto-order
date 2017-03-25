const expect = require("chai").expect;
const Meals = require("../../../src/restaurant/meals");
const Restaurant = require("../../../src/restaurant");
const MealsRequest = require("../../../src/automated-orders/meals-request");
const OrderRequest = require("../../../src/automated-orders/order-request");
const AutomatedOrders = require("../../../src/automated-orders");

function getRestrictedMealsFromTable(table) {
  const restricted = [];
  table.raw().forEach((row) => restricted.push({type: row[0], quantity: parseInt(row[1], 10)}));
  return restricted;
}

  function feature() {

  this.Given(/^we wish to order (\d+) meals including restricted meals:$/, function (totalMeals, table, callback) {
    const restricted = getRestrictedMealsFromTable(table);
    this.orderRequest = new OrderRequest(parseInt(totalMeals, 10), restricted.map((res) => new MealsRequest(res.quantity, res.type)));

    callback();
  });

  this.Given(/^we wish to order (\d+) meals$/, function (totalMeals, callback) {
    this.orderRequest = new OrderRequest(parseInt(totalMeals, 10));

    callback();
  });

  this.Given(/^restaurant "([^"]*)" has a rating of (\d+) and can serve a total of (\d+) meals$/,
  function (restaurantName, restaurantRating, restaurantTotalMeals, callback) {
    if (!this.restaurants) this.restaurants = [];

    this.restaurants.push(new Restaurant(
      restaurantName,
      parseInt(restaurantRating, 10),
      parseInt(restaurantTotalMeals, 10)));

    callback();
  });

  this.Given(/^restaurant "([^"]*)" has a rating of (\d+) and can serve a total of (\d+) meals including restricted meals:$/,
  function (restaurantName, restaurantRating, restaurantTotalMeals, table, callback) {
    if (!this.restaurants) this.restaurants = [];

    const restaurantRestricted = getRestrictedMealsFromTable(table);
    this.restaurants.push(new Restaurant(
      restaurantName,
      parseInt(restaurantRating, 10),
      parseInt(restaurantTotalMeals, 10),
      restaurantRestricted.map((res) => new Meals(res.quantity, res.type))));

    callback();
  });

  this.When(/^we use the automated\-orders app to determine the best possible orders$/, function (callback) {
    this.automatedOrders = new AutomatedOrders(this.orderRequest, this.restaurants);
    this.restaurantOrders = this.automatedOrders.getBestAvailableMeals();

    callback();
  });

  this.Then(/^we expect to order from restaurant "([^"]*)" (\d+) unrestricted meals and the following restricted meals:$/,
  function (restaurantName, orderedUnrestricted, table, callback) {

    const restaurantOrder = this.restaurantOrders[restaurantName];
    expect(restaurantOrder).to.exist;
    expect(restaurantOrder.orderAny).to.equal(parseInt(orderedUnrestricted, 10));

    const restricted = getRestrictedMealsFromTable(table);
    restricted.forEach((res) => {
      expect(restaurantOrder.orderRestricted[res.type]).to.exist;
      expect(restaurantOrder.orderRestricted[res.type].ordered).to.equal(res.quantity);
    });

    callback();
  });

  this.Then(/^we expect to order from restaurant "([^"]*)" (\d+) unrestricted meals$/,
  function (restaurantName, orderedUnrestricted, callback) {
    const restaurantOrder = this.restaurantOrders[restaurantName];
    const orderedUnrestrictedInt = parseInt(orderedUnrestricted, 10);
    if (orderedUnrestrictedInt === 0) {
      expect(restaurantOrder).to.not.exist;
      return callback();
    } else {
      expect(restaurantOrder).to.exist;
    }
    expect(restaurantOrder.orderAny).to.equal(orderedUnrestrictedInt);

    callback();
  });

  this.Then(/^we expect no orders to be unsatisfied$/, function (callback) {
    expect(this.orderRequest.isSatisfied()).to.be.true;

    callback();
  });

  this.Then(/^restaurant "([^"]*)" has no meals left$/, function (restaurantName, callback) {
    const restaurant = this.restaurants.find((restaurant) => restaurant.name === restaurantName);
    expect(restaurant).to.exist;
    expect(restaurant.totalAvailableMeals).to.equal(0);

    callback();
  });

  this.Then(/^restaurant "([^"]*)" has (\d+) meals left$/,
  function (restaurantName, totalLeft, callback) {
    const restaurant = this.restaurants.find((restaurant) => restaurant.name === restaurantName);
    expect(restaurant).to.exist;
    expect(restaurant.totalAvailableMeals).to.equal(parseInt(totalLeft, 10));

    callback();
  });

  this.Then(/^restaurant "([^"]*)" has (\d+) meals left with the following restricted meals:$/,
  function (restaurantName, totalLeft, table, callback) {
    const restaurant = this.restaurants.find((restaurant) => restaurant.name === restaurantName);
    expect(restaurant).to.exist;
    expect(restaurant.totalAvailableMeals).to.equal(parseInt(totalLeft, 10));

    const restricted = getRestrictedMealsFromTable(table);
    restricted.forEach((res) => {
      const restrictedMeals = new Meals(0, res.type);
      const available = restaurant.getAvailableQuantity(restrictedMeals);
      expect(available).to.exist;
      expect(available).to.equal(res.quantity);
    });

    callback();
  });

  this.Then(/^we expect (\d+) unrestricted meals are unsatisfied$/, function (unrestrictedUnsatisfied, callback) {
    const mealsRequest = this.orderRequest.mealsRequests[this.orderRequest.mealsRequests.length - 1];
    expect(mealsRequest).to.exist;
    expect(mealsRequest.type).to.be.undefined;
    expect(mealsRequest.isSatisfied()).to.be.false;
    expect(mealsRequest.quantity - mealsRequest.satisfied).to.equal(parseInt(unrestrictedUnsatisfied, 10));

    callback();
  });

  this.Then(/^we expect (\d+) unrestricted meals are unsatisfied and the following restricted meals are unsatisfied:$/,
  function (unrestrictedUnsatisfied, table, callback) {
    const unrestrictedUnsatisfiedInt = parseInt(unrestrictedUnsatisfied, 10);
    const unrestrictedOrder = this.orderRequest.mealsRequests[this.orderRequest.mealsRequests.length - 1];
    expect(unrestrictedOrder).to.exist;
    expect(unrestrictedOrder.type).to.be.undefined;
    expect(unrestrictedOrder.isSatisfied()).to.equal(unrestrictedUnsatisfiedInt === 0);
    expect(unrestrictedOrder.quantity - unrestrictedOrder.satisfied).to.equal(unrestrictedUnsatisfiedInt);

    const restricted = getRestrictedMealsFromTable(table);
    restricted.forEach((res) => {
      const mealsRequest = this.orderRequest.mealsRequests.find((mo) => mo.type === res.type);
      expect(mealsRequest).to.exist;
      expect(mealsRequest.quantity - mealsRequest.satisfied).to.equal(res.quantity);
    });

    callback();
  });

  this.Then(/^we expect the results to be empty$/, function (callback) {
    expect(this.restaurantOrders).to.eql({});

    callback();
  });







};

module.exports = feature;

