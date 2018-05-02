

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
    instance = new AlfrescoGovernanceServicesSecurityControls.DeclassificationExemptionsApi();
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

  describe('DeclassificationExemptionsApi', function() {
    describe('createDeclassificationExemption', function() {
      it('should call createDeclassificationExemption successfully', function(done) {
        //uncomment below and update the code to test createDeclassificationExemption
        //instance.createDeclassificationExemption(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteDeclassificationExemption', function() {
      it('should call deleteDeclassificationExemption successfully', function(done) {
        //uncomment below and update the code to test deleteDeclassificationExemption
        //instance.deleteDeclassificationExemption(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listDeclassificationExemptions', function() {
      it('should call listDeclassificationExemptions successfully', function(done) {
        //uncomment below and update the code to test listDeclassificationExemptions
        //instance.listDeclassificationExemptions(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('showDeclassificationExemptionById', function() {
      it('should call showDeclassificationExemptionById successfully', function(done) {
        //uncomment below and update the code to test showDeclassificationExemptionById
        //instance.showDeclassificationExemptionById(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateDeclassificationExemption', function() {
      it('should call updateDeclassificationExemption successfully', function(done) {
        //uncomment below and update the code to test updateDeclassificationExemption
        //instance.updateDeclassificationExemption(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
