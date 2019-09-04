const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return request(app)
          .get('/apps')
          .expect(200)
          .expect('Content-Type', /json/)
         .then(res => {
         expect(res.body).to.be.an('array');
         expect(res.body).to.have.lengthOf.at.least(1);
         const apps = res.body[0];
         expect(apps).to.include.all.keys('Android Ver', 'App', 'Category', 'Content Rating', 'Current Ver', 'Genres', 'Installs', 'Last Updated', 'Price', 'Rating', 'Reviews', 'Size', 'Type');
       })
    })
    it('should be 400 if sort is incorrect', () => {
        return request(app)
          .get('/apps')
          .query({sort: 'MISTAKE'})
          .expect(400, 'Sort must be by rating or app');
      })
    it('should return an array of apps based on genre', () => {
        return request(app)
          .get('/apps')
          .expect(200)
          .expect('Content-Type', /json/)
         .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            // console.log(res.body[0].Genres);
            const genres = res.body[1].Genres;
            const genArray = ['Arcade', 'Action', 'Card', 'Puzzle', 'Strategy', 'Casual', 'Adventure'];
            expect(genres).to.be.oneOf(genArray);
       })
    })
    it('should sort by Rating', () => {
        return request(app)
          .get('/apps')
          .query({sort: 'Rating'})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            const rateTest = res.body[0].Rating;
            // console.log(rateTest);
            expect(rateTest).to.be.an('number');
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
              sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
              i++;
            }
            expect(sorted).to.be.true;
          })
      })
    it('should sort by App', () => {
        return request(app)
          .get('/apps')
          .query({sort: 'App'})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            const appTest = res.body[0].App;
            // console.log(appTest);
            expect(appTest).to.be.an('string');
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
              sorted = sorted && res.body[i].App < res.body[i + 1].App;
              i++;
            }
            expect(sorted).to.be.true;
          })
      })
});