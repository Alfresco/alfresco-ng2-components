
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.AlfrescoGovernanceServicesRestApi);
  }
}(this, function(expect, AlfrescoGovernanceServicesRestApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new AlfrescoGovernanceServicesRestApi.FilePlansApi();
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

  describe('FilePlansApi', function() {
    describe('createFilePlanCategories', function() {
      it('should call createFilePlanCategories successfully', function(done) {
        //uncomment below and update the code to test createFilePlanCategories
        //instance.createFilePlanCategories(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getFilePlan', function() {
      it('should call getFilePlan successfully', function(done) {
        //uncomment below and update the code to test getFilePlan
        //instance.getFilePlan(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getFilePlanCategories', function() {
      it('should call getFilePlanCategories successfully', function(done) {
        //uncomment below and update the code to test getFilePlanCategories
        //instance.getFilePlanCategories(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateFilePlan', function() {
      it('should call updateFilePlan successfully', function(done) {
        //uncomment below and update the code to test updateFilePlan
        //instance.updateFilePlan(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
