const request = require('supertest');
const appFactory = require('./appFactory.js');

describe('koa-validate', function() {
	it('nobody to check', function(done) {
		var app = appFactory.create(1);
		app.router.post('/nobody', ctx => {
			ctx.checkBody('body').notEmpty();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/nobody').send().expect(500, done);
	});
});
