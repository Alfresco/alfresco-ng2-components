

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
    instance = new AlfrescoGovernanceServicesSecurityControls.Pagination();
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

  describe('Pagination', function() {
    it('should create an instance of Pagination', function() {
      // uncomment below and update the code to test Pagination
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be.a(AlfrescoGovernanceServicesSecurityControls.Pagination);
    });

    it('should have the property count (base name: "count")', function() {
      // uncomment below and update the code to test the property count
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be();
    });

    it('should have the property hasMoreItems (base name: "hasMoreItems")', function() {
      // uncomment below and update the code to test the property hasMoreItems
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be();
    });

    it('should have the property totalItems (base name: "totalItems")', function() {
      // uncomment below and update the code to test the property totalItems
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be();
    });

    it('should have the property skipCount (base name: "skipCount")', function() {
      // uncomment below and update the code to test the property skipCount
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be();
    });

    it('should have the property maxItems (base name: "maxItems")', function() {
      // uncomment below and update the code to test the property maxItems
      //var instane = new AlfrescoGovernanceServicesSecurityControls.Pagination();
      //expect(instance).to.be();
    });

  });

}));
