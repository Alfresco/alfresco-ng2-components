

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
    instance = new AlfrescoGovernanceServicesSecurityControls.ClassificationGuidesApi();
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

  describe('ClassificationGuidesApi', function() {
    describe('combinedInstructions', function() {
      it('should call combinedInstructions successfully', function(done) {
        //uncomment below and update the code to test combinedInstructions
        //instance.combinedInstructions(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('createClassificationGuide', function() {
      it('should call createClassificationGuide successfully', function(done) {
        //uncomment below and update the code to test createClassificationGuide
        //instance.createClassificationGuide(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('createSubtopic', function() {
      it('should call createSubtopic successfully', function(done) {
        //uncomment below and update the code to test createSubtopic
        //instance.createSubtopic(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('createTopic', function() {
      it('should call createTopic successfully', function(done) {
        //uncomment below and update the code to test createTopic
        //instance.createTopic(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteClassificationGuide', function() {
      it('should call deleteClassificationGuide successfully', function(done) {
        //uncomment below and update the code to test deleteClassificationGuide
        //instance.deleteClassificationGuide(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('deleteTopic', function() {
      it('should call deleteTopic successfully', function(done) {
        //uncomment below and update the code to test deleteTopic
        //instance.deleteTopic(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listClassificationGuides', function() {
      it('should call listClassificationGuides successfully', function(done) {
        //uncomment below and update the code to test listClassificationGuides
        //instance.listClassificationGuides(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listSubtopics', function() {
      it('should call listSubtopics successfully', function(done) {
        //uncomment below and update the code to test listSubtopics
        //instance.listSubtopics(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('listTopics', function() {
      it('should call listTopics successfully', function(done) {
        //uncomment below and update the code to test listTopics
        //instance.listTopics(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('showClassificationGuideById', function() {
      it('should call showClassificationGuideById successfully', function(done) {
        //uncomment below and update the code to test showClassificationGuideById
        //instance.showClassificationGuideById(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('showTopicById', function() {
      it('should call showTopicById successfully', function(done) {
        //uncomment below and update the code to test showTopicById
        //instance.showTopicById(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateClassificationGuide', function() {
      it('should call updateClassificationGuide successfully', function(done) {
        //uncomment below and update the code to test updateClassificationGuide
        //instance.updateClassificationGuide(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('updateTopic', function() {
      it('should call updateTopic successfully', function(done) {
        //uncomment below and update the code to test updateTopic
        //instance.updateTopic(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
