var express = require('express');
var router = express.Router();
var pay = require('./models/pay');
var order = require('./models/order');
var discord = require('../discord.js');

router.get('/', function(req, res, next) {
	res.send('Welcome to payment path!');
});

router.post('/success', function(req, res, next) {
	const orderNo = req.body.orderNo;

	order.findOneAndUpdate({orderId: orderNo}, {discordSuccess: true}).then(() => {
		res.send({
			'status': 'success'
		});
	})
})

router.post('/check', function(req, res, next) {
	const orderNo = req.body.orderNo;

	order.findOneAndUpdate({orderId: orderNo}, {orderCheck: true}).then(() => {
		
	})

	order.find({orderId: orderNo}).then((data) => {
		
		let temp = [
			{
				name: 'Note',
				value: data[0].detail[0].note || 'Empty'
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: false,
			},
		]
		data[0].detail[0][0].comboNames.map((combo, index) => {
			temp = [
				...temp,
				{
					name: combo.name,
					value: combo.option,
					inline: true
				}
			]
		})
		temp= [
			...temp,
			{
				name: '\u200b',
				value: '\u200b',
				inline: false,
			}
		]
		data[0].detail[0][1].switchs.map((sw, index) => {
			temp = [
				...temp,
				{
					name: 'Extra Option ' + (index + 1),
					value: sw,
					inline: true
				}
			]
		})
		
		const exampleEmbed = {
			color: 0x0099ff,
			author: {
				name: 'Order No: ' + orderNo,
			},
			fields: [
				...temp
			],
			image: {
				url: 'https://eloboostfire.com/images/logo.webp',
			},
			footer: {
				text: data[0].totalPrice + ' €',
			},
			timestamp: new Date(),
		};
		discord.bot(exampleEmbed);
		res.send({
			'status': 'success'
		});
	}).catch((err) => {
		console.log(err);
		res.send({
			'status': 'error'
		})
	})
})


module.exports = router;