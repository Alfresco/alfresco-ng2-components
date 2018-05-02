

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
    instance = new AlfrescoGovernanceServicesSecurityControls.SecurityMarkBody();
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

  describe('SecurityMarkBody', function() {
    it('should create an instance of SecurityMarkBody', function() {
      // uncomment below and update the code to test SecurityMarkBody
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMarkBody();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.SecurityMarkBody);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMarkBody();
      //expect(instance).to.be();
    });

    it('should have the property groupId (base name: "groupId")', function() {
      // uncomment below and update the code to test the property groupId
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMarkBody();
      //expect(instance).to.be();
    });

  });

}));
