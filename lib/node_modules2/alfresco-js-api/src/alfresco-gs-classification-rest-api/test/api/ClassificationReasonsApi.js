

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
    instance = new AlfrescoGovernanceServicesSecurityControls.ClassificationReasonsApi();
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

  describe('ClassificationReasonsApi', function() {
    describe('createClassificationReason', function() {
      it('should call createClassificationReason successfully', function(done) {
        //uncomment below and update the code to test createClassificationReason
        //instance.createClassificationReason(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteClassificationReason', function() {
      it('should call deleteClassificationReason successfully', function(done) {
        //uncomment below and update the code to test deleteClassificationReason
        //instance.deleteClassificationReason(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listClassificationReasons', function() {
      it('should call listClassificationReasons successfully', function(done) {
        //uncomment below and update the code to test listClassificationReasons
        //instance.listClassificationReasons(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('showClassificationReasonById', function() {
      it('should call showClassificationReasonById successfully', function(done) {
        //uncomment below and update the code to test showClassificationReasonById
        //instance.showClassificationReasonById(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateClassificationReason', function() {
      it('should call updateClassificationReason successfully', function(done) {
        //uncomment below and update the code to test updateClassificationReason
        //instance.updateClassificationReason(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
