/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 
// MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const options = { useNewUrlParser: true };

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      // console.log(project);
      // console.log(req.query);
      // US6 - I can GET /api/issues/{projectname} for an array of all issues on that specific project with all 
      // the information for each issue as was returned when posted.
      // US7 - I can filter my get request by also passing along any field and value in the query
      // (ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
      var fields = req.query; // {} - empty by default returns all records
      MongoClient.connect(CONNECTION_STRING, options, function(err, client) {
        if (err) console.log(err);
        // if (db) console.log("Connected to database");
        // console.log(db); 
        var db = client.db('issues');
        db.collection(project).find(fields).toArray((err, docs) => {
          if (err) return res.send(err);
          // console.log(docs);
          // if (docs) { ... } else { ... }
          res.send(docs);
          // error - database is empty
        });
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      // US2 - I can POST /api/issues/{projectname} with form data containing required 
      // issue_title, issue_text, created_by, and optional assigned_to and status_text.
      // US3 - The object saved (and returned) will include all of those fields (blank for optional no input) and 
      // also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
      // console.log(project);
      // console.log(req.body);
      if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by)
        return res.send('required fields missing');
      var date = new Date(); // date string
      // console.log(date);
      // [{"_id":"5871dda29faedc3491ff93bb","issue_title":"Fix error in posting data",
      // "issue_text":"When we post data it has an error.","created_on":"2017-01-08T06:35:14.240Z",
      // "updated_on":"2017-01-08T06:35:14.240Z","created_by":"Joe","assigned_to":"Joe",
      // "open":true,"status_text":"In QA"},...]
      MongoClient.connect(CONNECTION_STRING, options, function(err, client) {
        if (err) console.log(err);
        var db = client.db('issues'); 
        db.collection(project).insertOne({issue_title: req.body.issue_title, issue_text: req.body.issue_text, 
                                          created_on: date, updated_on: date, 
                                          created_by: req.body.created_by, assigned_to: req.body.assigned_to, 
                                          open: true, status_text: req.body.status_text }, (err, data) => {
          if (err) { 
            // console.log(err);
            return res.json({ error: err });
          } // could check for duplicate enteries
          // console.log(data.ops[0]);
          // if (data) { ... } else { ... }
          return res.json(data.ops[0]);
        }); 
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      // console.log(req.body);
      var update = {}; // determine what fields to update
      if (!req.body.hasOwnProperty('_id')) return res.send('no updated field sent');
      // US4 - I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. 
      // Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. 
      // If no fields are sent return 'no updated field sent'.
      MongoClient.connect(CONNECTION_STRING, options, function(err, client) {
        if (err) console.log(err);
        var db = client.db('issues');
        db.collection(project).find({_id: ObjectId(req.body._id)}).toArray((err, docs) => {
          if (err) return res.send(err);
          // console.log(docs[0]);
          // if (docs) { // found ... } else { // error - database is empty }
          var date = new Date(); // date string for updated_on
          if (req.body.issue_title) update['issue_title'] = req.body.issue_title; 
          else update['issue_title'] = docs[0]['issue_title'];
          if (req.body.issue_text)  update['issue_text']  = req.body.issue_text; 
          else update['issue_text'] = docs[0]['issue_text'];
          if (req.body.created_on)  update['created_on']  = req.body.issue_text; 
          else update['created_on'] = docs[0]['created_on'];
          update['updated_on'] = date;
          if (req.body.created_by)  update['created_by']  = req.body.created_by; 
          else update['created_by'] = docs[0]['created_by'];
          if (req.body.assigned_to) update['assigned_to'] = req.body.assigned_to; 
          else update['assigned_to'] = docs[0]['assigned_to'];
          if (req.body.status_text) update['status_text'] = req.body.status_text; 
          else update['status_text'] = docs[0]['status_text'];
          if (req.body.open == 'false') update['open'] = false; 
          else update['open'] = true;
          // console.log(update);
          db.collection(project).replaceOne({ _id: ObjectId(req.body._id)}, update, (err, data) => {
            if (err) return res.send(err);
            if (data) {
              // console.log(data);
              return res.send('successfully updated');
            } 
            else
              return res.send('could not update ' + req.body._id);
          });
        });
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      // US6 - I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. 
      // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
      // console.log(project);
      // console.log(req.body._id);
      if (!req.body._id) return res.send('_id error');
      MongoClient.connect(CONNECTION_STRING, options, function(err, client) {
        if (err) console.log(err);
        var db = client.db('issues'); 
        if (req.body._id.length < 24 || req.body._id.length > 24)
          return res.send('_id error');
        db.collection(project).deleteOne({_id: ObjectId(req.body._id)}, (err, data) => { 
          if (err) return res.send('_id error'); // id not found
          if (data) { 
            // console.log(data);
            if (data.deletedCount > 0) {
              return res.send('success: deleted ' + req.body._id);
            } 
            else
              return res.send('failed: could not delete ' + req.body._id); 
          }
        });
      });
    });
    
};
