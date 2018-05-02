
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
    instance = new AlfrescoGovernanceServicesRestApi.TransferContainersApi();
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

  describe('TransferContainersApi', function() {
    describe('getTransferContainer', function() {
      it('should call getTransferContainer successfully', function(done) {
        //uncomment below and update the code to test getTransferContainer
        //instance.getTransferContainer(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listTransfers', function() {
      it('should call listTransfers successfully', function(done) {
        //uncomment below and update the code to test listTransfers
        //instance.listTransfers(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateTransferContainer', function() {
      it('should call updateTransferContainer successfully', function(done) {
        //uncomment below and update the code to test updateTransferContainer
        //instance.updateTransferContainer(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
