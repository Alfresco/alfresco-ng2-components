

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
    instance = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
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

  describe('SecurityMark', function() {
    it('should create an instance of SecurityMark', function() {
      // uncomment below and update the code to test SecurityMark
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.SecurityMark);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be();
    });

    it('should have the property groupId (base name: "groupId")', function() {
      // uncomment below and update the code to test the property groupId
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be();
    });

    it('should have the property groupName (base name: "groupName")', function() {
      // uncomment below and update the code to test the property groupName
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be();
    });

    it('should have the property groupType (base name: "groupType")', function() {
      // uncomment below and update the code to test the property groupType
      //var instane = new AlfrescoGovernanceServicesSecurityControls.SecurityMark();
      //expect(instance).to.be();
    });

  });

}));
