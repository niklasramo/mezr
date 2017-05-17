function TestSuite(filter) {

  var inst = this;

  // Create elements.
  this.fixture = document.createElement('div');
  this.element = document.createElement('div');
  this.elementInner = document.createElement('div');
  this.anchor = document.createElement('div');
  this.container = document.createElement('div');

  // Set up elements.
  this.element.appendChild(this.elementInner);
  this.fixture.appendChild(this.element);
  this.fixture.appendChild(this.anchor);
  this.fixture.appendChild(this.container);
  document.body.appendChild(this.fixture);

  // Set up QUnit.
  QUnit.config.reorder = false;
  QUnit.testStart(function () {
    inst.resetElements();
    window.scrollTo(0, 0);
  });
  QUnit.testDone(function () {
    inst.resetElements();
    window.scrollTo(0, 0);
  });

  // Filter tests if needed.
  if (filter) {
    QUnit.config.filter = filter;
  }

  // Run tests.
  for (var i = 0; i < TestSuite.modules.length; i++) {
    TestSuite.modules[i].call(this);
  }

}

TestSuite.modules = [];

TestSuite.prototype.test = function (description, assertions, cb) {

  QUnit.test(description, function (assert) {
    var done = assert.async();
    assert.expect(assertions);
    cb(function (method, config) {
      window.setTimeout(function () {
        assert[method](config.r || config.result, config.e || config.expected, config.d || config.description || undefined);
      }, 0);
    }, done);
  });

  return this;

};

TestSuite.prototype.setStyles = function (elem, styles) {

  for (style in styles) {
    elem.style[style] = styles[style];
  }

  this.repaint(elem);

  return this;

};

TestSuite.prototype.repaint = function (element) {

  var display = element.style.display;
  element.style.display = 'none';
  element.offsetHeight;
  element.style.display = display;

  // Needed for iOS emulator.
  document.documentElement.clientWidth;
  window.innerWidth;

  return this;

};

TestSuite.prototype.resetElements = function () {

  // Reset element styles.
  document.documentElement.removeAttribute('style');
  document.body.removeAttribute('style');
  this.fixture.removeAttribute('style');
  this.element.removeAttribute('style');
  this.elementInner.removeAttribute('style');
  this.anchor.removeAttribute('style');
  this.container.removeAttribute('style');

  // Reset body margins.
  document.body.style.margin = '0px';

  return this;

};

TestSuite.prototype.forIn = function (obj, callback) {

  if (typeof callback === 'function') {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        callback(obj[prop], prop);
      }
    }
  }

  return this;

};