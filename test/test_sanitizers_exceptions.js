const request = require('supertest');
const appFactory = require('./appFactory.js');

describe('koa-validate', function() {
	it('bad uri decodeURIComponent should not to be ok', function(done) {
		const app = appFactory.create(1);
		app.router.post('/decodeURIComponent', ctx => {
			ctx.checkBody('uri').decodeURIComponent();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/decodeURIComponent').send({ uri: '%' }).expect(500, done);
	});
	it('bad uri decodeURI should not to be ok', function(done) {
		var app = appFactory.create(1);
		app.router.post('/decodeURI', ctx => {
			ctx.checkBody('uri').decodeURI();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/decodeURI').send({ uri: '%' }).expect(500, done);
	});
	it('bad base64 string should not to be ok', function(done) {
		const app = appFactory.create(1);
		app.router.post('/decodeBase64', ctx => {
			ctx.checkBody('base64').decodeURIComponent();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/decodeBase64').send({ base64: '%%' }).expect(500, done);
	});
	it('bad int string should not to be ok', function(done) {
		const app = appFactory.create(1);
		app.router.post('/toInt', ctx => {
			ctx.checkBody('v').toInt();
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/toInt').send({ v: 'gg' }).expect(500, done);
	});

	it('0 len should be ok', function(done) {
		const app = appFactory.create(1);
		app.router.post('/len', ctx => {
			ctx.checkBody('v').len(0, 1);
			if (ctx.errors) {
				ctx.status = 500;
			} else {
				ctx.status = 200;
			}
		});
		const req = request(app.listen());
		req.post('/len').send({ v: '' }).expect(200, done);
	});
});
