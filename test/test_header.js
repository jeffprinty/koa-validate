const koa = require('koa');
const request = require('supertest');
const appFactory = require('./appFactory.js');

describe('koa-validate', function() {
	it('check header', function(done) {
		var app = appFactory.create(1);
		app.router.get('/header', ctx => {
			ctx.checkHeader('int').notEmpty().isInt();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		request(app.listen())
			.get('/header')
			.set('int', '1')
			.query()
			.expect(200, done);
	});
});
