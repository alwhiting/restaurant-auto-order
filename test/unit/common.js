// while setting stuff on global is not usually a great idea it's useful for reducing boilerplate in tests
global.chai = require("chai");
global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.chai.should();
global.chai.use(global.sinonChai);

global.expect = global.chai.expect;
