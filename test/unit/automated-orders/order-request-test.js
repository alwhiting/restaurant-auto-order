const OrderRequest = require("../../../src/automated-orders/order-request");
const MealsRequest = require("../../../src/automated-orders/meals-request");

describe(__filename, function () {
  describe("Order request with no restricted meals", function () {
    beforeEach(function () {
      this.sut = new OrderRequest(15);
    });
    it("should contain a single instance in mealsRequest for unrestricted meals", function () {
      this.sut.mealsRequests.length.should.equal(1);
      expect(this.sut.mealsRequests[0].type).to.be.undefined;
      this.sut.mealsRequests[0].quantity.should.equal(15);
    });
    describe("order satisfied", function () {
      beforeEach(function () {
        this.satisfiedUnrestricted = sinon.createStubInstance(MealsRequest);
        this.satisfiedUnrestricted.isSatisfied.returns(true);
        this.sut.mealsRequests = [this.satisfiedUnrestricted];
      });
      it("should return true for isSatisfied", function () {
        this.sut.isSatisfied().should.equal(true);
      });
    });
  });

  describe("Order request with only single restricted meal", function () {
    beforeEach(function () {
      this.mealsRequestBananas = sinon.createStubInstance(MealsRequest);
      this.mealsRequestBananas.quantity = 5;
      this.mealsRequestBananas.type = "bananas";
      this.sut = new OrderRequest(5, [this.mealsRequestBananas]);
    });
    it("should contain two instances of mealsRequest", function () {
      this.sut.mealsRequests.length.should.equal(2);
      expect(this.sut.mealsRequests[0].type).to.equal("bananas");
      expect(this.sut.mealsRequests[0].quantity).to.equal(5);
      expect(this.sut.mealsRequests[1].type).to.be.undefined;
      expect(this.sut.mealsRequests[1].quantity).to.equal(0);
    });
    describe("order satisfied", function () {
      beforeEach(function () {
        this.mealsRequestBananas.isSatisfied.returns(true);
      });
      it("should return true for isSatisfied", function () {
        this.sut.isSatisfied().should.equal(true);
      });
    });
  });

  describe("Order request with multiple restricted meals and unrestricted meals", function () {
    beforeEach(function () {
      this.mealsRequestBananas = sinon.createStubInstance(MealsRequest);
      this.mealsRequestBananas.quantity = 3;
      this.mealsRequestBananas.type = "bananas";
      this.mealsRequestOranges = sinon.createStubInstance(MealsRequest);
      this.mealsRequestOranges.quantity = 12;
      this.mealsRequestOranges.type = "oranges";

      this.sut = new OrderRequest(25, [this.mealsRequestBananas, this.mealsRequestOranges]);
    });
    it("should contain correct amount of MealsRequests", function () {
      this.sut.mealsRequests.length.should.equal(3);
    });
    it("should contain bananas as the first MealsRequest", function () {
      this.sut.mealsRequests[0].type.should.equal("bananas");
      this.sut.mealsRequests[0].quantity.should.equal(3);
    });
    it("should contain oranges as the second MealsRequest", function () {
      this.sut.mealsRequests[1].type.should.equal("oranges");
      this.sut.mealsRequests[1].quantity.should.equal(12);
    });
    it("should contain unrestricted as the final MealsRequest with the remaining quantity", function () {
      expect(this.sut.mealsRequests[2].type).to.be.undefined;
      expect(this.sut.mealsRequests[2].quantity).to.equal(10);
    });
    describe("bananas satisfied", function () {
      beforeEach(function () {
        this.mealsRequestBananas.isSatisfied.returns(true);
      });
      it("should return true for isSatisfied", function () {
        this.sut.isSatisfied().should.equal(false);
      });
    });
    describe("bananas and oranges satisfied", function () {
      beforeEach(function () {
        this.mealsRequestBananas.isSatisfied.returns(true);
        this.mealsRequestOranges.isSatisfied.returns(true);
      });
      it("should return true for isSatisfied", function () {
        this.sut.isSatisfied().should.equal(false);
      });
    });
    describe("order satisfied", function () {
      beforeEach(function () {
        this.mealsRequestBananas.isSatisfied.returns(true);
        this.mealsRequestOranges.isSatisfied.returns(true);
        this.satisfiedUnrestricted = sinon.createStubInstance(MealsRequest);
        this.satisfiedUnrestricted.isSatisfied.returns(true);
        this.sut.mealsRequests[2] = this.satisfiedUnrestricted;
      });
      it("should return true for isSatisfied", function () {
        this.sut.isSatisfied().should.equal(true);
      });
    });
  });

});
