const MealsRequest = require("../../../src/automated-orders/meals-request");

describe(__filename, function () {
  describe("Meals order", function () {
    beforeEach(function () {
      this.sut = new MealsRequest(50);
    });

    describe("newly created", function () {
      it("should return full amount to be satisfied", function () {
        this.sut.getRemainingToBeSatisfied().should.equal(50);
        this.sut.isSatisfied().should.equal(false);
      });
    });

    describe("partially satisfied", function () {
      beforeEach(function () {
        this.sut.incrementSatisfied(25);
        this.sut.incrementSatisfied(5);
      });
      it("should return remaining to be satisfied", function () {
        this.sut.getRemainingToBeSatisfied().should.equal(20);
        this.sut.isSatisfied().should.equal(false);
      });
    });

    describe("satisfied", function () {
      beforeEach(function () {
        this.sut.incrementSatisfied(50);
      });
      it("should return remaining to be satisfied", function () {
        this.sut.getRemainingToBeSatisfied().should.equal(0);
        this.sut.isSatisfied().should.equal(true);
      });
    });

    describe("ordered too many", function () {
      beforeEach(function () {
        this.addTooMany = () => this.sut.incrementSatisfied(51);
      });
      describe("unrestricted", function () {
        it("should throw an error", function () {
          this.addTooMany.should.throw("Ordered too many unrestricted-meal 51/50");
        });
      });
      describe("restricted", function () {
        it("should throw an error", function () {
          this.sut.type = "peaches";
          this.addTooMany.should.throw("Ordered too many peaches 51/50");
        });
      });
    });
  });

});
