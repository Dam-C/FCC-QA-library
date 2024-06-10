/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const randomBook = {title: 'Random title'};
const randomComment = 'Good book!'
let bookid;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // }).timeout(10000);
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
        .post('/api/books')  
        .send(randomBook)
        .end((req, res)=> {
          assert.equal(res.status, 200);
          bookid = res.body._id;
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.equal(res.body.title, 'Random title');
          done();
        })
      }).timeout(10000);;

      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
        .post('/api/books')  
        .send({})
        .end((req, res)=> {
          assert.equal(res.status, 200);
          done();      
        })
      }).timeout(10000)
    });
      
    suite('GET /api/books => array of books', () => {
      test('test GET api/books', (done) => {
        chai.request(server)
        .get('/api/books')  
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        })
      }).timeout(10000)
    });
    
    
    
    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/129387398778743819')
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      }).timeout(10000);
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${bookid}`)  
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          done();
        });
      }).timeout(10000);
    });
    
    
    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${bookid}`)
        .send({comment: 'Great book'})
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body._id, bookid);
          assert.property(res.body, 'title');
          assert.equal(res.body.title, randomBook.title);
          assert.property(res.body, 'comments');
          done();
        });
      }).timeout(10000);
      
      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${bookid}`)
        .send({comment: ''})
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      }).timeout(10000);
      
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post(`/api/books/0983745908739408`)
        .send({comment: 'Good book'})
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      }).timeout(10000);
      
    });
    
    suite('DELETE /api/books/[id] => delete book object id', function() {
      
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${bookid}`)
        .end((req, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      }).timeout(10000);
    
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
          chai.request(server)
          .delete(`/api/books/0983745908739408`)
          .end((req, res)=> {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
        }).timeout(10000);
    })
  })
});