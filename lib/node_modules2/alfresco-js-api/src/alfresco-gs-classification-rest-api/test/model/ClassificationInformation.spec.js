

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
    instance = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
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

  describe('ClassificationInformation', function() {
    it('should create an instance of ClassificationInformation', function() {
      // uncomment below and update the code to test ClassificationInformation
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.ClassificationInformation);
    });

    it('should have the property level (base name: "level")', function() {
      // uncomment below and update the code to test the property level
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property classificationAgency (base name: "classificationAgency")', function() {
      // uncomment below and update the code to test the property classificationAgency
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property reasonIds (base name: "reasonIds")', function() {
      // uncomment below and update the code to test the property reasonIds
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property downgradeOn (base name: "downgradeOn")', function() {
      // uncomment below and update the code to test the property downgradeOn
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property downgradeEvent (base name: "downgradeEvent")', function() {
      // uncomment below and update the code to test the property downgradeEvent
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property downgradeInstructions (base name: "downgradeInstructions")', function() {
      // uncomment below and update the code to test the property downgradeInstructions
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property declassifyOn (base name: "declassifyOn")', function() {
      // uncomment below and update the code to test the property declassifyOn
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property declassificationEvent (base name: "declassificationEvent")', function() {
      // uncomment below and update the code to test the property declassificationEvent
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

    it('should have the property exemptionIds (base name: "exemptionIds")', function() {
      // uncomment below and update the code to test the property exemptionIds
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationInformation();
      //expect(instance).to.be();
    });

  });

}));
