
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
    instance = new AlfrescoGovernanceServicesRestApi.UnfiledRecordFoldersApi();
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

  describe('UnfiledRecordFoldersApi', function() {
    describe('createUnfiledRecordFolderChildren', function() {
      it('should call createUnfiledRecordFolderChildren successfully', function(done) {
        //uncomment below and update the code to test createUnfiledRecordFolderChildren
        //instance.createUnfiledRecordFolderChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteUnfiledRecordFolder', function() {
      it('should call deleteUnfiledRecordFolder successfully', function(done) {
        //uncomment below and update the code to test deleteUnfiledRecordFolder
        //instance.deleteUnfiledRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('getUnfiledRecordFolder', function() {
      it('should call getUnfiledRecordFolder successfully', function(done) {
        //uncomment below and update the code to test getUnfiledRecordFolder
        //instance.getUnfiledRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listUnfiledRecordFolderChildren', function() {
      it('should call listUnfiledRecordFolderChildren successfully', function(done) {
        //uncomment below and update the code to test listUnfiledRecordFolderChildren
        //instance.listUnfiledRecordFolderChildren(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateUnfiledRecordFolder', function() {
      it('should call updateUnfiledRecordFolder successfully', function(done) {
        //uncomment below and update the code to test updateUnfiledRecordFolder
        //instance.updateUnfiledRecordFolder(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
