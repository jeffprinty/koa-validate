const Koa = require('koa');
const body = require('koa-body');
const Router = require('koa-router');

exports.create = type => {
	const app = new Koa();
	const router = new Router();
	require('../')(app);
	if (1 == type) {
		app.use(
			body({
				multipart: true,
				formidable: { keepExtensions: true }
			})
		);
	} else {
		app.use(body());
	}
	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (err) {
			console.log(err.stack);
			ctx.app.emit('error', err, ctx);
		}
	});
	app.use(router.routes()).use(router.allowedMethods());
	app.router = router;
	return app;
};
