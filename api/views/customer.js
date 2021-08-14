var express = require('express');
var router = express.Router();
var order = require('./models/order');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client('xxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx');

router.get('/', function(req, res, next) {
	res.send('Welcome to public path!');
});

router.get('/order/:userId', function(req, res, next) {
	order.find({customerId: req.params.userId}).sort({createdAt: "descending"}).then((data) => {
		res.send(data);
	}).catch((err) => {
		console.log(err);
		res.send(400);
	})
})

router.get('/order/get/:orderId', function(req, res, next) {
	order.find({orderId: req.params.orderId}).then((data) => {
		res.send(data);
	}).catch((err) => {
		res.send(400);
	})
})

router.get('/message/notify', function(req, res, next) {
	const notification = {
	  contents: {
	    'tr': '1 yeni mesajınız var',
    	'en': 'You have 1 new message',
	  },
	  included_segments: ['Subscribed Users']
	};

	client.createNotification(notification).then(response => {
		res.send({
			'status': 'success'
		})
	}).catch(e => {
		res.send({
			'status': 'error'
		});
		console.log(e)
	});
})

module.exports = router;