

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
    instance = new AlfrescoGovernanceServicesSecurityControls.Topic();
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

  describe('Topic', function() {
    it('should create an instance of Topic', function() {
      // uncomment below and update the code to test Topic
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.Topic);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property name (base name: "name")', function() {
      // uncomment below and update the code to test the property name
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property description (base name: "description")', function() {
      // uncomment below and update the code to test the property description
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property hasInstruction (base name: "hasInstruction")', function() {
      // uncomment below and update the code to test the property hasInstruction
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property instruction (base name: "instruction")', function() {
      // uncomment below and update the code to test the property instruction
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property createdAt (base name: "createdAt")', function() {
      // uncomment below and update the code to test the property createdAt
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property hasSubtopics (base name: "hasSubtopics")', function() {
      // uncomment below and update the code to test the property hasSubtopics
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property path (base name: "path")', function() {
      // uncomment below and update the code to test the property path
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

    it('should have the property classificationGuide (base name: "classificationGuide")', function() {
      // uncomment below and update the code to test the property classificationGuide
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Topic();
      //expect(instance).to.be();
    });

  });

}));
