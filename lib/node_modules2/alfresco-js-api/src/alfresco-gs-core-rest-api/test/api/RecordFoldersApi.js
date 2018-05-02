
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
    instance = new AlfrescoGovernanceServicesRestApi.RecordFoldersApi();
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

  describe('RecordFoldersApi', function() {
    describe('createRecordFolderChild', function() {
      it('should call createRecordFolderChild successfully', function(done) {
        //uncomment below and update the code to test createRecordFolderChild
        //instance.createRecordFolderChild(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteRecordFolder', function() {
      it('should call deleteRecordFolder successfully', function(done) {
        //uncomment below and update the code to test deleteRecordFolder
        //instance.deleteRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getRecordFolder', function() {
      it('should call getRecordFolder successfully', function(done) {
        //uncomment below and update the code to test getRecordFolder
        //instance.getRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listRecordFolderChildren', function() {
      it('should call listRecordFolderChildren successfully', function(done) {
        //uncomment below and update the code to test listRecordFolderChildren
        //instance.listRecordFolderChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateRecordFolder', function() {
      it('should call updateRecordFolder successfully', function(done) {
        //uncomment below and update the code to test updateRecordFolder
        //instance.updateRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
