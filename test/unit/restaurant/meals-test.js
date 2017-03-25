const Meals = require("../../../src/restaurant/meals");

describe(__filename, function() {
  describe("Create a meal with a specific restriction type", function() {
    beforeEach(function() {
      this.sut = new Meals(1, "somethingTasty");
    });

    it("should have correct meal type and quantity", function() {
      this.sut.quantity.should.equal(1);
      this.sut.type.should.equal("somethingTasty");
    });

    it("should not be unrestricted", function() {
      this.sut.isUnrestricted().should.be.false;
    });
  });

  describe("Create a meal with no restriction", function() {
    beforeEach(function() {
      this.sut = new Meals(1);
    });

    it("should have correct meal type and quantity", function() {
      this.sut.quantity.should.equal(1);
      expect(this.sut.type).to.be.undefined;
    });

    it("should be unrestricted", function() {
      this.sut.isUnrestricted().should.be.true;
    });
  });

});
