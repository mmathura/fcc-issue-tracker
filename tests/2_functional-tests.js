/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var temp_id; // for delete
var temp_id2; // for update

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
   suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //fill me in too!
          // console.log(res.body);
          temp_id2 = res.body._id;
          assert.isObject(res.body);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');  
          done();
        });
      });
       
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // console.log(res.body);  
          temp_id = res.body._id;
          assert.isObject(res.body);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: null,
          issue_text: null,
          created_by: null,
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // console.log(res.text);
          assert.equal(res.text, 'required fields missing');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
       test('No body', function(done) {
         chai.request(server)
          .put('/api/issues/apitest')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            // console.log(res.text);
            assert.equal(res.text, 'no updated field sent');
            done();
          });
       });
      
       test('One field to update', function(done) {
          chai.request(server)
            .put('/api/issues/apitest')
            .send({
              _id: temp_id2,
              created_by: 'Functional Test - One field to update',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              // console.log(res.body);
              assert.equal(res.text, 'successfully updated');
              done();
            });
         });
      
        test('Multiple fields to update', function(done) {
            chai.request(server)
              .put('/api/issues/apitest')
              .send({
                _id: temp_id2,
                issue_title: 'Updated Title',
                issue_text: 'updated text',
              })
              .end(function(err, res){
                assert.equal(res.status, 200);
                // console.log(res.body);
                assert.equal(res.text, 'successfully updated');
                done();
              });
          });
      
    }); 
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest') 
        .query({})
        .end(function(err, res){
          // console.log(res.body); 
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      // /api/issues/{project}?open=false
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest?open=true')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      // /api/issues/{project}?open=true&assigned_to=Joe
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/apitest?open=true&assigned_to=Joe')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
  
      // _id error
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/apitest')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            // console.log(res.text);
            assert.equal(res.text, '_id error');
            done();
          });
      });
  
      // 'success: deleted ' + req.body._id
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/apitest')
          .send({_id: temp_id})
          .end(function(err, res){
            assert.equal(res.status, 200);
            // console.log(res.text);
            assert.equal(res.text, 'success: deleted ' + temp_id);
            done();
          });
      });
      
    });

});
