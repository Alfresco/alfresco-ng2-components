
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
    instance = new AlfrescoGovernanceServicesRestApi.UnfiledContainersApi();
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

  describe('UnfiledContainersApi', function() {
    describe('createUnfiledContainerChildren', function() {
      it('should call createUnfiledContainerChildren successfully', function(done) {
        //uncomment below and update the code to test createUnfiledContainerChildren
        //instance.createUnfiledContainerChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getUnfiledContainer', function() {
      it('should call getUnfiledContainer successfully', function(done) {
        //uncomment below and update the code to test getUnfiledContainer
        //instance.getUnfiledContainer(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listUnfiledContainerChildren', function() {
      it('should call listUnfiledContainerChildren successfully', function(done) {
        //uncomment below and update the code to test listUnfiledContainerChildren
        //instance.listUnfiledContainerChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateUnfiledContainer', function() {
      it('should call updateUnfiledContainer successfully', function(done) {
        //uncomment below and update the code to test updateUnfiledContainer
        //instance.updateUnfiledContainer(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
