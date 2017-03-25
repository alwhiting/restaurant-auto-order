const Restaurant = require("../../../src/restaurant");
const MealsRequest = require("../../../src/automated-orders/meals-request");
const Meals = require("../../../src/restaurant/meals");

describe(__filename, function () {
  describe("Restaurant with no restricted meals available.", function () {
    beforeEach(function () {
      this.sut = new Restaurant("testaurant", 1, 10);
    });
    it("should have correct details", function () {
      this.sut.name.should.equal("testaurant");
      this.sut.rating.should.equal(1);
      this.sut.totalAvailableMeals.should.equal(10);
      this.sut.availableRestrictedMeals.should.be.empty;
    });

    describe("order unrestricted meals", function () {
      beforeEach(function () {
        this.mealsRequest = sinon.createStubInstance(MealsRequest);
        this.mealsRequest.isUnrestricted.returns(true);
      });
      describe("less than total available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should allow less than maximum unrestricted meals to be ordered", function () {
          this.satisfied.should.equal(5);
          this.sut.totalAvailableMeals.should.equal(5);
        });
      });
      describe("more than total available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(11);
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should allow less than maximum unrestricted meals to be ordered", function () {
          this.satisfied.should.equal(10);
          this.sut.totalAvailableMeals.should.equal(0);
        });
      });
    });

    describe("order restricted meals", function () {
      beforeEach(function () {
        this.mealsRequest = sinon.createStubInstance(MealsRequest);
        this.mealsRequest.isUnrestricted.returns(false);
        this.mealsRequest.getRemainingToBeSatisfied.returns(5);
        this.mealsRequest.type = "butThisRestaurantHasNoRestrictedMeals!";
        this.satisfied = this.sut.orderMeals(this.mealsRequest);
      });
      it("should not satisfy any order criteria for meals it does not have", function () {
        this.satisfied.should.equal(0);
      });
      it("should not cause a decrease in available meals", function () {
        this.sut.totalAvailableMeals.should.equal(10);
      });
    });
  });

  describe("Restaurant with restricted meals", function () {
    beforeEach(function () {
      this.restrictedMealFish = sinon.createStubInstance(Meals);
      this.restrictedMealFish.quantity = 2;
      this.restrictedMealFish.type = "fish";
      this.restrictedMealFish.isUnrestricted.returns(false);
      this.restrictedMealVeggies = sinon.createStubInstance(Meals);
      this.restrictedMealVeggies.quantity = 1;
      this.restrictedMealVeggies.type = "veggies";
      this.restrictedMealVeggies.isUnrestricted.returns(false);

      this.sut = new Restaurant("better restaurant", 5, 10, [
        this.restrictedMealFish, this.restrictedMealVeggies
      ]);
    });
    it("should have correct details", function () {
      this.sut.name.should.equal("better restaurant");
      this.sut.rating.should.equal(5);
      this.sut.totalAvailableMeals.should.equal(10);
      this.sut.availableRestrictedMeals.fish.should.exist;
      this.sut.availableRestrictedMeals.fish.type.should.equal("fish");
      this.sut.availableRestrictedMeals.fish.quantity.should.equal(2);
      this.sut.availableRestrictedMeals.veggies.should.exist;
      this.sut.availableRestrictedMeals.veggies.type.should.equal("veggies");
      this.sut.availableRestrictedMeals.veggies.quantity.should.equal(1);
    });

    describe("order unrestricted meals", function () {
      beforeEach(function () {
        this.mealsRequest = sinon.createStubInstance(MealsRequest);
        this.mealsRequest.isUnrestricted.returns(true);
      });
      describe("less than total available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should allow less than maximum unrestricted meals to be ordered", function () {
          this.satisfied.should.equal(5);
          this.sut.totalAvailableMeals.should.equal(5);
        });
      });
      describe("more than total available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(11);
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should satisfy as much of the order as possible", function () {
          this.satisfied.should.equal(10);
          this.sut.totalAvailableMeals.should.equal(0);
        });
      });
    });

    describe("order restricted meals", function () {
      beforeEach(function () {
        this.mealsRequest = sinon.createStubInstance(MealsRequest);
        this.mealsRequest.isUnrestricted.returns(false);
      });
      describe("less than total available when total meals still available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(1);
          this.mealsRequest.type = "fish";
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should allow less than maximum of restricted type to be ordered", function () {
          this.satisfied.should.equal(1);
          this.sut.totalAvailableMeals.should.equal(9);
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(1);
        });
        it("should not affect other restricted types availability", function () {
          this.mealsRequest = sinon.createStubInstance(MealsRequest);
          this.mealsRequest.isUnrestricted.returns(false);
          this.mealsRequest.type = "veggies";
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(1);
        });
      });
      describe("more than total available of type when total meals still available", function () {
        beforeEach(function () {
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.mealsRequest.type = "fish";
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should satisfy as much of the order as possible", function () {
          this.satisfied.should.equal(2);
          this.sut.totalAvailableMeals.should.equal(8);
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(0);
        });
        it("should not affect other restricted types availability", function () {
          this.mealsRequest = sinon.createStubInstance(MealsRequest);
          this.mealsRequest.isUnrestricted.returns(false);
          this.mealsRequest.type = "veggies";
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(1);
        });
      });
      describe("restricted meals available but limited by overall total", function () {
        beforeEach(function () {
          this.sut.totalAvailableMeals = 1;
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.mealsRequest.type = "fish";
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should satisfy as much of the order as possible", function () {
          this.satisfied.should.equal(1);
          this.sut.totalAvailableMeals.should.equal(0);
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(0);
        });
        it("should not allow otherwise available type due to total restriction", function () {
          this.mealsRequest = sinon.createStubInstance(MealsRequest);
          this.mealsRequest.isUnrestricted.returns(false);
          this.mealsRequest.type = "veggies";
          this.sut.getAvailableQuantity(this.mealsRequest).should.equal(0);
        });
      });
      describe("restricted meal uses up all available meals", function () {
        beforeEach(function () {
          this.sut.totalAvailableMeals = 2;
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.mealsRequest.type = "fish";
          this.satisfied = this.sut.orderMeals(this.mealsRequest);
        });
        it("should satisfy as much of the order as possible", function () {
          this.satisfied.should.equal(2);
        })
        it("should have no means left", function () {
          this.sut.totalAvailableMeals.should.equal(0);
        });
        it("should fail to satisfy any further orders", function () {
          this.mealsRequestUnrestricted = sinon.createStubInstance(MealsRequest);
          this.mealsRequestUnrestricted.isUnrestricted.returns(true);
          this.mealsRequestUnrestricted.getRemainingToBeSatisfied.returns(1);
          this.satsifyUnrestricted = this.sut.orderMeals(this.mealsRequestUnrestricted);
          this.satsifyUnrestricted.should.equal(0);
        });
      });
      describe("order a non-existent meal type", function () {
        beforeEach(function () {
          this.sut.totalAvailableMeals = 100;
          this.mealsRequest.getRemainingToBeSatisfied.returns(5);
          this.mealsRequest.type = "candy";
          this.satisfied = this.sut.orderMeals(this.mealsRequest)
        });
        it("should not satisfy any order for meals it does not have", function () {
          this.satisfied.should.equal(0);
        });
        it("should not cause a decrease in available meals", function() {
          this.sut.totalAvailableMeals.should.equal(100);
          this.sut.availableRestrictedMeals.fish.quantity.should.equal(2);
          this.sut.availableRestrictedMeals.veggies.quantity.should.equal(1);
        });
      });
    });

    describe("order unrestricted and restricted meals", function () {
      beforeEach(function () {
        this.mealsRequestUnrestricted = sinon.createStubInstance(MealsRequest);
        this.mealsRequestUnrestricted.isUnrestricted.returns(true);
        this.mealsRequestFish = sinon.createStubInstance(MealsRequest);
        this.mealsRequestFish.isUnrestricted.returns(false);
        this.mealsRequestFish.type = "fish";
        this.mealsRequestVeggies = sinon.createStubInstance(MealsRequest);
        this.mealsRequestVeggies.isUnrestricted.returns(false);
        this.mealsRequestVeggies.type = "veggies";
      });

      describe("order all the food", function () {
        beforeEach(function () {
          this.mealsRequestUnrestricted.getRemainingToBeSatisfied.returns(100);
          this.mealsRequestFish.getRemainingToBeSatisfied.returns(2);
          this.mealsRequestVeggies.getRemainingToBeSatisfied.returns(1);
        });
        describe("in a sane order", function () {
          beforeEach(function () {
            this.satisfiedFish = this.sut.orderMeals(this.mealsRequestFish);
            this.satisfiedVeggies = this.sut.orderMeals(this.mealsRequestVeggies);
            this.satisfiedUnrestricted = this.sut.orderMeals(this.mealsRequestUnrestricted);
          });
          it("should satisfy as much of the order as it's able", function () {
            this.satisfiedFish.should.equal(2);
            this.satisfiedVeggies.should.equal(1);
            this.satisfiedUnrestricted.should.equal(7);
          });
          it("should not have any meals left", function () {
            this.sut.getAvailableQuantity(this.mealsRequestFish).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestVeggies).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestUnrestricted).should.equal(0);
          });
        });
        describe("all the unrestricted food first", function () {
          beforeEach(function () {
            this.satisfiedUnrestricted = this.sut.orderMeals(this.mealsRequestUnrestricted);
            this.satisfiedFish = this.sut.orderMeals(this.mealsRequestFish);
            this.satisfiedVeggies = this.sut.orderMeals(this.mealsRequestVeggies);
          });
          it("should satisfy as much of the order as it's able", function () {
            this.satisfiedFish.should.equal(0);
            this.satisfiedVeggies.should.equal(0);
            this.satisfiedUnrestricted.should.equal(10);
          });
          it("should not have any meals left", function () {
            this.sut.getAvailableQuantity(this.mealsRequestFish).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestVeggies).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestUnrestricted).should.equal(0);
          });
        });
      });

      describe("order some fish and some anything", function () {
        beforeEach(function () {
          this.mealsRequestUnrestricted.getRemainingToBeSatisfied.returns(5);
          this.mealsRequestFish.getRemainingToBeSatisfied.returns(5);
        });
        describe("fish first", function () {
          beforeEach(function () {
            this.satisfiedFish = this.sut.orderMeals(this.mealsRequestFish);
            this.satisfiedUnrestricted = this.sut.orderMeals(this.mealsRequestUnrestricted);
          });
          it("should satisfy as much of the order as it's able", function () {
            this.satisfiedFish.should.equal(2);
            this.satisfiedUnrestricted.should.equal(5);
          });
          it("should have the following meals left", function () {
            this.sut.getAvailableQuantity(this.mealsRequestFish).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestVeggies).should.equal(1);
            this.sut.getAvailableQuantity(this.mealsRequestUnrestricted).should.equal(3);
          });
        });
        describe("unrestricted first", function () {
          beforeEach(function () {
            this.satisfiedUnrestricted = this.sut.orderMeals(this.mealsRequestUnrestricted);
            this.satisfiedFish = this.sut.orderMeals(this.mealsRequestFish);
          });
          it("should satisfy as much of the order as it's able", function () {
            this.satisfiedFish.should.equal(2);
            this.satisfiedUnrestricted.should.equal(5);
          });
          it("should have the following meals left", function () {
            this.sut.getAvailableQuantity(this.mealsRequestFish).should.equal(0);
            this.sut.getAvailableQuantity(this.mealsRequestVeggies).should.equal(1);
            this.sut.getAvailableQuantity(this.mealsRequestUnrestricted).should.equal(3);
          });
        });
      });

      describe("order some fish and some veggies", function () {
        beforeEach(function () {
          this.mealsRequestFish.getRemainingToBeSatisfied.returns(5);
          this.mealsRequestVeggies.getRemainingToBeSatisfied.returns(5);
          this.satisfiedFish = this.sut.orderMeals(this.mealsRequestFish);
          this.satisfiedVeggies = this.sut.orderMeals(this.mealsRequestVeggies);
        });
        it("should satisfy as much of the order as it's able", function () {
          this.satisfiedFish.should.equal(2);
          this.satisfiedVeggies.should.equal(1);
        });
        it("should have the following meals left", function () {
          this.sut.getAvailableQuantity(this.mealsRequestFish).should.equal(0);
          this.sut.getAvailableQuantity(this.mealsRequestVeggies).should.equal(0);
          this.sut.getAvailableQuantity(this.mealsRequestUnrestricted).should.equal(7);
        });
      });
    });
  });

});
