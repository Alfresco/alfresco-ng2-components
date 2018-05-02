

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
    instance = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
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

  describe('ClassificationGuideBody', function() {
    it('should create an instance of ClassificationGuideBody', function() {
      // uncomment below and update the code to test ClassificationGuideBody
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody);
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
      //expect(instance).to.be();
    });

    it('should have the property originatingOrganization (base name: "originatingOrganization")', function() {
      // uncomment below and update the code to test the property originatingOrganization
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
      //expect(instance).to.be();
    });

    it('should have the property publishedOn (base name: "publishedOn")', function() {
      // uncomment below and update the code to test the property publishedOn
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
      //expect(instance).to.be();
    });

    it('should have the property enabled (base name: "enabled")', function() {
      // uncomment below and update the code to test the property enabled
      //var instane = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuideBody();
      //expect(instance).to.be();
    });

  });

}));
