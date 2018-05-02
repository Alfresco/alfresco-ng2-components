
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
    instance = new AlfrescoGovernanceServicesRestApi.RecordCategoriesApi();
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

  describe('RecordCategoriesApi', function() {
    describe('createRecordCategoryChild', function() {
      it('should call createRecordCategoryChild successfully', function(done) {
        //uncomment below and update the code to test createRecordCategoryChild
        //instance.createRecordCategoryChild(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteRecordCategory', function() {
      it('should call deleteRecordCategory successfully', function(done) {
        //uncomment below and update the code to test deleteRecordCategory
        //instance.deleteRecordCategory(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getRecordCategory', function() {
      it('should call getRecordCategory successfully', function(done) {
        //uncomment below and update the code to test getRecordCategory
        //instance.getRecordCategory(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listRecordCategoryChildren', function() {
      it('should call listRecordCategoryChildren successfully', function(done) {
        //uncomment below and update the code to test listRecordCategoryChildren
        //instance.listRecordCategoryChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateRecordCategory', function() {
      it('should call updateRecordCategory successfully', function(done) {
        //uncomment below and update the code to test updateRecordCategory
        //instance.updateRecordCategory(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
