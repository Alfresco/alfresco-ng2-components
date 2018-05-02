

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.AlfrescoGovernanceServicesSecurityControls);
  }
}(this, function(expect, AlfrescoGovernanceServicesSecurityControls) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new AlfrescoGovernanceServicesSecurityControls.ClassificationReasonBody();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('ClassificationReasonBody', function() {
    it('should create an instance of ClassificationReasonBody', function() {
      // uncomment below and update the code to test ClassificationReasonBody
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationReasonBody();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.ClassificationReasonBody);
    });

    it('should have the property code (base name: "code")', function() {
      // uncomment below and update the code to test the property code
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationReasonBody();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationReasonBody();
      //expect(instance).to.be();
    });

  });

}));
