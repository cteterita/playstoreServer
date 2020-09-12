const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /apps', () => {
  it('returns all apps if no genre is specified', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array').with.lengthOf(20);
      })
  });
  it('requires a valid genre', () => {
    return supertest(app)
      .get('/apps?genre=boring')
      .expect(400, 'Genre must be one of action, puzzle, strategy, casual, arcade, card');
  });
  it('requires a valid sort', () => {
    return supertest(app)
      .get('/apps?sort=boringness')
      .expect(400, 'Sort must be one of rating, app');
  });
  it('filters apps by genre', () => {
    return supertest(app)
      .get('/apps?genre=action')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array').with.lengthOf(5);
      })
  });
  it('sorts by rating', () => {
    return supertest(app)
      .get('/apps?sort=rating')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let lastRating = 4;
        res.body.forEach(app => {
          expect(app.Rating).to.not.be.below(lastRating);
          lastRating = app.Rating;
        });
      });
  });
  it('sorts by name', () => {
    return supertest(app)
      .get('/apps?sort=app')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let lastApp = 'A';
        let sorted = true;
        res.body.forEach(app => {
          if (app.App < lastApp) {
            sorted = false;
          }
          lastApp = app.App;
        });
        expect(sorted).to.be.true;
      });
  });
});
