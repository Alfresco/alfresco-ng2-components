

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
    instance = new AlfrescoGovernanceServicesSecurityControls.SecurityControlSetting();
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

  describe('SecurityControlSetting', function() {
    it('should create an instance of SecurityControlSetting', function() {
      // uncomment below and update the code to test SecurityControlSetting
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityControlSetting();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.SecurityControlSetting);
    });

    it('should have the property key (base name: "key")', function() {
      // uncomment below and update the code to test the property key
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityControlSetting();
      //expect(instance).to.be();
    });

    it('should have the property value (base name: "value")', function() {
      // uncomment below and update the code to test the property value
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityControlSetting();
      //expect(instance).to.be();
    });

  });

}));
