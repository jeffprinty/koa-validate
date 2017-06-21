const koa = require('koa');
const request = require('supertest');
const appFactory = require('./appFactory.js');

describe('koa-validate', function() {
	it('file check ok', function(done) {
		const app = appFactory.create(1);
		app.router.post('/upload', async ctx => {
			ctx.checkFile('empty').empty();
			ctx.checkFile('file').empty().contentTypeMatch(/^application\//);
			await ctx
				.checkFile('file1')
				.empty()
				.move(__dirname + '/temp', function(file, context) {});
			ctx.checkFile('file').notEmpty();
			await ctx
				.checkFile('file')
				.notEmpty()
				.copy(__dirname + '/tempdir/', function(file, context) {});
			await ctx.checkFile('file').notEmpty().copy(__dirname);
			await ctx.checkFile('file').notEmpty().copy(function() {
				return __dirname + '/temp';
			});
			// await (await ctx
			// 	.checkFile('file')
			// 	.notEmpty()
			// 	.fileNameMatch(/^.*.js$/)
			// 	.size(0, 10 * 1024)
			// 	.suffixIn(['js'])
			// 	.copy(function*(obj) {
			// 		return __dirname + '/temp';
			// 	})).delete();
			// require('fs').unlinkSync(__dirname + '/temp');
			// require('fs').unlinkSync(
			// 	__dirname +
			// 		'/' +
			// 		require('path').basename(ctx.request.body.files.file.path)
			// );
			// require('fs').unlinkSync(
			// 	__dirname +
			// 		'/tempdir/' +
			// 		require('path').basename(ctx.request.body.files.file.path)
			// );
			if (ctx.errors) {
				ctx.body = this.errors;
				return;
			}
			ctx.body = 'ok';
		});

		request(app.listen())
			.post('/upload')
			.attach('file', __dirname + '/test_checkFile.js')
			.attach('file1', __dirname + '/test_checkFile.js')
			.expect(200)
			.expect('ok', done);
	});

	it('file check not ok', function(done) {
		var app = appFactory.create(1);
		app.router.post('/upload', async ctx => {
			ctx.checkFile('empty').notEmpty();
			ctx.checkFile('file0').size(10, 10);
			ctx.checkFile('file').size(1024 * 100, 1024 * 1024 * 10);
			ctx.checkFile('file1').size(1024 * 100, 1024 * 1024 * 1024 * 10);
			ctx.checkFile('file2').suffixIn(['png']);
			ctx.checkFile('file3').contentTypeMatch(/^image\/.*$/);
			ctx.checkFile('file4').contentTypeMatch(/^image\/.*$/);
			ctx.checkFile('file5').fileNameMatch(/\.png$/);
			ctx.checkFile('file6').isImageContentType('not image content type.');

			if (9 === ctx.errors.length) {
				ctx.body = 'ok';
				return;
			} else {
				ctx.body = 'not ok';
				return;
			}
		});

		request(app.listen())
			.post('/upload')
			.attach('file', __dirname + '/test_checkFile.js')
			.attach('file0', __dirname + '/test_checkFile.js')
			.attach('file1', __dirname + '/test_checkFile.js')
			.attach('file2', __dirname + '/test_checkFile.js')
			.attach('file3', __dirname + '/test_checkFile.js')
			.attach('file4', __dirname + '/test_checkFile.js')
			.attach('file5', __dirname + '/test_checkFile.js')
			.attach('file5', __dirname + '/test_checkFile.js')
			.attach('file6', __dirname + '/test_checkFile.js')
			.expect(200)
			.expect('ok', done);
	});
});
