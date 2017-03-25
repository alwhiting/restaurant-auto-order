const AutomatedOrders = require("../../../src/automated-orders");
const Restaurant = require("../../../src/restaurant");
const OrderRequest = require("../../../src/automated-orders/order-request");
const MealsRequest = require("../../../src/automated-orders/meals-request");

/*
 * Note;
 * as this is a class that ties everything together it's unit tests are of limited value as we're
 * basically just calling a bunch of stubs. We can at least ensure everything is called in the
 * correct order with the right arguments the expected number of times.
 * The other unit tests exercise the various components that AutomatedOrders uses in more depth.
 * The features tests (tests/features) exercise this in a useful way from an integration standpoint.
 */

function stubInsatiableMealsRequest(quantity, type) {
  const mealsRequestStub = sinon.createStubInstance(MealsRequest);
  mealsRequestStub.quantity = quantity;
  mealsRequestStub.type = type;
  mealsRequestStub.satisfied = 0;
  mealsRequestStub.isSatisfied.returns(false);
  mealsRequestStub.getRemainingToBeSatisfied.returns(mealsRequestStub.quantity);
  mealsRequestStub.isUnrestricted.returns(!type);
  return mealsRequestStub;
}

function stubSingleMealRestaurant(name, rating) {
  const restaurantStub = sinon.createStubInstance(Restaurant);
  restaurantStub.name = name;
  restaurantStub.rating = rating;
  restaurantStub.totalAvailableMeals = 1;
  restaurantStub.orderMeals.returns(1);
  return restaurantStub;
}

describe(__filename, function () {
  beforeEach(function() {
    this.restaurantBad = stubSingleMealRestaurant("terrible restaurant", 1);
    this.restaurantOk = stubSingleMealRestaurant("decent restaurant", 3);
    this.restaurantGood = stubSingleMealRestaurant("great restaurant", 5);
    this.restaurantAlsoGood = stubSingleMealRestaurant("best restaurant", 5);
  });

  describe("Sort restaurants based on rank", function () {
    describe("single restaurant", function () {
      it("should have a single restaurant in it's list of restaurants", function () {
        this.sut = new AutomatedOrders(null, [this.restaurantOk]);
        this.sut.restaurants.length.should.equal(1);
        this.sut.restaurants[0].name.should.equal("decent restaurant");
      });
    });
    describe("multiple restaurants", function () {
      it("should sort the restaurants by quality, then name if quality equal", function () {
        this.sut = new AutomatedOrders(null, [
          this.restaurantOk,
          this.restaurantAlsoGood,
          this.restaurantBad,
          this.restaurantGood,
        ]);
        this.sut.restaurants.length.should.equal(4);
        this.sut.restaurants[0].name.should.equal("best restaurant");
        this.sut.restaurants[1].name.should.equal("great restaurant");
        this.sut.restaurants[2].name.should.equal("decent restaurant");
        this.sut.restaurants[3].name.should.equal("terrible restaurant");
      });
    });
  });

  describe("Attempt to be fill order against the best restaurant possible", function () {
    beforeEach(function () {
      this.mealsRequestFish = stubInsatiableMealsRequest(5, "fish");
      this.mealsRequestBeef = stubInsatiableMealsRequest(10, "beef");
      this.mealsRequestAlreadyFilled = stubInsatiableMealsRequest(20, "eggs");
      this.mealsRequestAlreadyFilled.isSatisfied.returns(true);
      this.mealsRequestUnrestricted = stubInsatiableMealsRequest(35);

      this.orderRequest = sinon.createStubInstance(OrderRequest);
      this.orderRequest.mealsRequests = [
        this.mealsRequestFish,
        this.mealsRequestBeef,
        this.mealsRequestAlreadyFilled,
        this.mealsRequestUnrestricted,
      ];

      this.sut = new AutomatedOrders(this.orderRequest, [
        this.restaurantOk,
        this.restaurantBad,
        this.restaurantGood,
      ]);

      this.restaurantOrders = this.sut.getBestAvailableMeals();
    });
    it("should have checked if the order was satisfied before attempting to order from restaurant", function () {
      this.mealsRequestFish.isSatisfied.callCount.should.equal(4);
      this.mealsRequestBeef.isSatisfied.callCount.should.equal(4)
      this.mealsRequestAlreadyFilled.isSatisfied.callCount.should.equal(1);
      this.mealsRequestUnrestricted.isSatisfied.callCount.should.equal(4);
    });
    it("should have attempted to fill each unsatisfied order from each restaurant", function () {
      this.restaurantGood.orderMeals.should.have.been.calledWith(this.mealsRequestFish);
      this.restaurantOk.orderMeals.should.have.been.calledWith(this.mealsRequestBeef);
      this.restaurantBad.orderMeals.should.have.been.calledWith(this.mealsRequestUnrestricted);
    });
    it("should not have attempted to fill the satisfied order", function () {
      this.restaurantGood.orderMeals.should.not.have.been.calledWith(this.mealsRequestAlreadyFilled);
      this.restaurantOk.orderMeals.should.not.have.been.calledWith(this.mealsRequestAlreadyFilled);
      this.restaurantBad.orderMeals.should.not.have.been.calledWith(this.mealsRequestAlreadyFilled);
    });
    it("should have incremented each order as restaurants were able ot satisfy it", function () {
      this.mealsRequestFish.incrementSatisfied.should.have.been.calledThrice;
      this.mealsRequestBeef.incrementSatisfied.should.have.been.calledThrice;
      this.mealsRequestUnrestricted.incrementSatisfied.should.have.been.calledThrice;
      this.mealsRequestAlreadyFilled.incrementSatisfied.should.not.have.been.called;
    });
    it("should have attempted to fill each unsatisfied order from each restaurant once", function () {
      this.restaurantGood.orderMeals.should.have.been.calledThrice;
      this.restaurantOk.orderMeals.should.have.been.calledThrice;
      this.restaurantBad.orderMeals.should.have.been.calledThrice;
    });
    it("should try to fill with the restaurants in order from best to worst", function () {
      // kind of an ugly test
      this.restaurantGood.orderMeals.firstCall.callId.should.be.lessThan(this.restaurantOk.orderMeals.firstCall.callId);
      this.restaurantOk.orderMeals.firstCall.callId.should.be.lessThan(this.restaurantBad.orderMeals.firstCall.callId);
    });
    it("should return an array of RestaurantOrder objects that describe best possible orders", function () {
      // in this case thanks to our contrived test each type of meal should have been ordered
      // once from each restaurant; except mealsRequestAlreadyFilled
      expect(Object.keys(this.restaurantOrders).length).to.equal(3);
      Object.keys(this.restaurantOrders).forEach((key) => {
        const restaurantOrder = this.restaurantOrders[key];
        expect(restaurantOrder.orderAny).to.equal(1);
        expect(restaurantOrder.getRestrictedByType(this.mealsRequestFish).ordered).to.equal(1);
        expect(restaurantOrder.getRestrictedByType(this.mealsRequestBeef).ordered).to.equal(1);
        expect(restaurantOrder.getRestrictedByType(this.mealsRequestAlreadyFilled).ordered).to.equal(0);
      });
    });
  });

});
