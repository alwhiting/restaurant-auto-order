const RestaurantOrder = require("../../../src/automated-orders/restaurant-order");
const Restaurant = require("../../../src/restaurant");
const MealsRequest = require("../../../src/automated-orders/meals-request");

describe(__filename, function () {
  beforeEach(function () {
    this.restaurant = sinon.createStubInstance(Restaurant);
    this.restaurant.name = "bob's burgers";
    this.restaurant.rating = 5;
    this.sut = new RestaurantOrder(this.restaurant);
  });

  describe("Add unrestricted meals", function () {
    beforeEach(function () {
      this.mealsRequest = sinon.createStubInstance(MealsRequest);
      this.mealsRequest.isUnrestricted.returns(true);
      this.sut.addToOrder(101, this.mealsRequest);
      this.sut.addToOrder(4, this.mealsRequest);
    });
    it("should record the given amount of unrestricted meals", function () {
      this.sut.orderAny.should.equal(105);
      this.sut.orderRestricted.should.be.empty;
    });
  });

  describe("Add restricted meals", function () {
    beforeEach(function () {
      this.mealsRequest = sinon.createStubInstance(MealsRequest);
      this.mealsRequest.isUnrestricted.returns(false);
      this.mealsRequest.type = "popcorn";
      this.sut.addToOrder(3, this.mealsRequest);
      this.sut.addToOrder(4, this.mealsRequest);
    });
    it("should record the given amount of restricted meals", function () {
      this.sut.orderAny.should.equal(0);
      this.sut.getRestrictedByType(this.mealsRequest).ordered.should.equal(7);
    });
  });

  describe("Add unrestricted and multiple restricted meals", function () {
    beforeEach(function () {
      this.mealsRequestHamburgers = sinon.createStubInstance(MealsRequest);
      this.mealsRequestHamburgers.isUnrestricted.returns(false);
      this.mealsRequestHamburgers.type = "hamburgers";
      this.mealsRequestHotdogs = sinon.createStubInstance(MealsRequest);
      this.mealsRequestHotdogs.isUnrestricted.returns(false);
      this.mealsRequestHotdogs.type = "hotdogs";
      this.mealsRequestAny = sinon.createStubInstance(MealsRequest);
      this.mealsRequestAny.isUnrestricted.returns(true);
      this.sut.addToOrder(5, this.mealsRequestHamburgers);
      this.sut.addToOrder(1, this.mealsRequestHotdogs);
      this.sut.addToOrder(30, this.mealsRequestAny);
    });
    it("should record the given amount of restricted meals", function () {
      this.sut.orderAny.should.equal(30);
      this.sut.getRestrictedByType(this.mealsRequestHamburgers).ordered.should.equal(5);
      this.sut.getRestrictedByType(this.mealsRequestHotdogs).ordered.should.equal(1);
    });
  });

});
