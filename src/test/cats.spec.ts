import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../app';
import Cat from '../models/cat';

chai.use(chaiHttp).should();
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmNjFmNWIxODM1YjAyMzQ5OGI4NjljZiIsImVtYWlsIjoiYUBhLmNvbSIsIl9fdiI6MH0sImlhdCI6MTYwMDI2NTc3NiwiZXhwIjoxNjMxODAxNzc2fQ.ekvNipYUgQlV3YK4nS_YYNSxVvQ7W1Aepd2MQAANvCc";

describe('Cats', () => {

  beforeEach(done => {
    Cat.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for cats', () => {

    // it('should get token', done => {
    //     chai.request(app)
    //     .post('/api/login')
    //     .send({email:'a@a.com',password:'123'})
    //     .end(function(err, res) {
    //         res.redirects.length.should.equal(0);
    //         res.status.should.equal(200);
    //         token = res.body.token;
    //         res.type.should.equal('application/json');
    //         done();
    //     });
    //   });

    it('should get all the cats', done => {
      chai.request(app)
        .get('/api/cats')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get cats count', done => {
      chai.request(app)
        .get('/api/cats/count')
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new cat', done => {
      const cat = new Cat({ name: 'Fluffy', weight: 4, age: 2 });
      chai.request(app)
        .post('/api/cat')
        .set("Authorization", "Bearer " + token)
        .send(cat)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.a.property('name');
          res.body.should.have.a.property('weight');
          res.body.should.have.a.property('age');
          done();
        });
    });

    it('should get a cat by its id', done => {
      const cat = new Cat({ name: 'Cat', weight: 2, age: 4 });
      cat.save((error, newCat) => {
        chai.request(app)
          .get(`/api/cat/${newCat.id}`)
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('weight');
            res.body.should.have.property('age');
            res.body.should.have.property('_id').eql(newCat.id);
            done();
          });
      });
    });

    it('should update a cat by its id', done => {
      const cat = new Cat({ name: 'Cat', weight: 2, age: 4 });
      cat.save((error, newCat) => {
        chai.request(app)
          .put(`/api/cat/${newCat.id}`)
          .set("Authorization", "Bearer " + token)
          .send({ weight: 5 })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a cat by its id', done => {
      const cat = new Cat({ name: 'Cat', weight: 2, age: 4 });
      cat.save((error, newCat) => {
        chai.request(app)
          .del(`/api/cat/${newCat.id}`)
          .set("Authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


