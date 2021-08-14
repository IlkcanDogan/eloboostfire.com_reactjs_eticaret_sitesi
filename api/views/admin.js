var express = require('express')
var router = express.Router()

var admin = require('firebase-admin');
var serviceAccount = require('./eloboostfire-admin.json');
var tab = require('./models/tab');
var combobox = require('./models/combobox');
var combination = require('./models/combination');
var order = require('./models/order');
var switchs = require('./models/switch');
var uniqid = require('uniqid');
const orderid = require('order-id')('mysecret');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xxxxxxxxxxxxxxxxxx.firebaseio.com"
});

router.get('/', function(req, res, next) {
  res.send('Locked page');
});

router.get('/customers', function(req, res, next) {
    admin.auth().listUsers(1000).then((listUsersResult) => {
      let tempCustomers = [];
      listUsersResult.users.forEach((userRecord) => {
        let _phone  = ''
        try{
          _phone = JSON.parse(userRecord.photoURL).phoneNumber
        }catch(err) {

        }
        if(userRecord.uid !== 'xxxxxxxxxxxxxxxxxx'){
          tempCustomers.push({
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            phone: _phone,
            dateOfRegistration: userRecord.tokensValidAfterTime,
            ban: userRecord.disabled
          })
        }
        
      })
      res.send({
        status: 'success',
        customers: tempCustomers
      })
    }).catch((error) => {
      console.log('Error listing users:', error)
      res.send([])
    })
})
router.get('/customers/get/:userId', function(req, res, next){
  var userId = req.params.userId;
  admin.auth().getUser(userId)
  .then((userRecord) => {
      res.send(userRecord)    
  })
  .catch((error) => {
      res.send(400);
  });
})

router.post('/customers/ban', function(req, res, next){
  var uid = req.body.uid;
  admin.auth().updateUser(uid, {
    disabled: true
  }).then((userRecord) => {
    res.send({
      status: 'success'
    });
  }).catch((error) => {
    res.send({
      status: 'error'
    })
  })
})

router.post('/customers/ban/remove', function(req, res, next) {
  var uid = req.body.uid;
  admin.auth().updateUser(uid, {
    disabled: false
  }).then((userRecord) => {
    res.send({
      status: 'success',
    });
  }).catch((error) => {
    res.send({
      status: 'error'
    })
  })
})

router.post('/customers/delete', function(req, res, next) {
  var uid = req.body.uid;
  admin.auth().deleteUser(uid).then(() => {
    res.send({
      status: 'success'
    });
  }).catch((error) => {
    res.send({
      status: 'error'
    });
  })
})

router.get('/website/tab', function(req, res, next) {
  tab.find({}).then((data) => {
      res.send(data);
  })
})

router.post('/website/tab/add', function(req, res, next) {
  if(req.body.title){
     new tab({
        imageUrl: req.body.imageUrl,
        title: req.body.title
    }).save().then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
        console.log(err);
    })
  }
  else {
    res.json({'status': 'error'});
  }
})

router.get('/website/tab/delete/:id', function(req,res,next){
  var id = req.params.id;

  tab.findByIdAndRemove(id).then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
    });
})

router.get('/website/combobox', function(req, res, next) {
  combobox.find({}).then((data) => {
    res.send(data);
  })
})

router.get('/website/combobox/tab/:tabId', function(req, res, next) {
  combobox.find({tabId: req.params.tabId}).then((data) => {
    res.send(data);
  })
})

router.post('/website/combobox/add', function(req, res, next) {
  if(req.body.tabId){
    new combobox({
      tabId: req.body.tabId,
      float: req.body.float,
      name: req.body.name,
      options: req.body.options
    }).save().then(() => {
      res.json({'status': 'success'})
    }).catch((err) => {
      res.json({'status': 'error'});
      console.log(err);
    })
  }
})

router.get('/website/combobox/delete/:comboboxId', function(req,res,next){
  var comboboxId = req.params.comboboxId;

  combobox.findByIdAndRemove(comboboxId).then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
    });
})

router.post('/website/switch/add', function(req, res, next) {
  if(req.body.tabId) {
    new switchs({
      tabId: req.body.tabId,
      name: req.body.name,
      price: req.body.price,
    }).save().then(() => {
      res.json({'status': 'success'});
    }).catch((err) => {
      res.json({'status': 'error'});
      console.log(err);
    })
  }
  else{
    res.json({'status': 'error'})
  }
})

router.get('/website/switch', function(req, res, next) {
  switchs.find({}).then((data) => {
    res.send(data);
  })
})
router.get('/website/switch/tab/:tabId', function(req, res, next) {
  switchs.find({tabId: req.params.tabId}).then((data) => {
    res.send(data);
  })
})

router.get('/website/switch/delete/:switchId', function(req,res,next){
  var switchId = req.params.switchId;

  switchs.findByIdAndRemove(switchId).then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
    });
})

router.get('/website/combination/delete/:combinationId', function(req,res,next){
  var combinationId = req.params.combinationId;

  combination.findByIdAndRemove(combinationId).then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
    });
})

router.get('/website/combination/tab/:tabId', function(req, res, next) {
  combination.find({tabId: req.params.tabId}).then((data) => {
    res.send(data);
  })
})

router.get('/website/combination', function(req, res, next) {
  combination.find({}).then((data) => {
    res.send(data);
  })
})

router.post('/website/combination/add', function(req, res, next) {
  if(req.body.tabId){
    combination.find({tabId: req.body.tabId, combinations: req.body.combinations }).then((combResult) => {
      if(combResult.length){
          let id = combResult[0]._id;
          console.log(combResult)
         combination.findByIdAndRemove(id).then(() => {
            new combination({
              tabId: req.body.tabId,
              totalPrice: req.body.totalPrice,
              complateTime: req.body.complateTime,
              combinations: req.body.combinations
            }).save().then(() => {
               res.json({'status': 'success'});
            }).catch((err) => {
                res.json({'status': 'error'});
                console.log(err);
            })
          }).catch((err) => {
              res.json({'status': 'error'});
          });


      }
      else {
        new combination({
          tabId: req.body.tabId,
          totalPrice: req.body.totalPrice,
          complateTime: req.body.complateTime,
          combinations: req.body.combinations
        }).save().then(() => {
           res.json({'status': 'success'});
        }).catch((err) => {
            res.json({'status': 'error'});
            console.log(err);
        })
      }
    })
  }
  else {
    res.json({'status': 'error'});
  }
})

router.post('/website/combination/change/', function(req, res, next) {
  combination.find({tabId: req.body.tabId, combinations: req.body.combinations}).then((data) => {
    res.send(data);
  })
})

router.get('/order/all', function(req, res, next) {
  order.find({}).sort({createdAt: "descending"}).then((data) => {
    res.send(data);
  })
})
router.get('/order/delete/:orderId', function(req,res,next){
  var orderId = req.params.orderId;

  order.findByIdAndRemove(orderId).then(() => {
        res.json({'status': 'success'});
    }).catch((err) => {
        res.json({'status': 'error'});
    });
})

router.post('/order/new', function(req, res, next) {
  tab.find({_id: req.body._tabId}).then((data) => {
      let tabTitle = data[0].title;
      let allData = [];
      let totalPrice = 0;
      let totalPerc = 0;
      let totalSwtich = 0;
      let totalCoe = 0;

      combobox.find({tabId: req.body._tabId}).then((data) => {
        let comboboxNames = [];
        data.map((cmb) => {
          req.body._combobox.map((cmq) => {
            if(cmb._id == cmq.id){
              comboboxNames.push({
                name: cmb.name,
                option: cmb.options[parseInt(cmq.selectedIndex)].name
              })
            }
          })
          req.body._percent.map((cmq) => {
            if(cmb._id == cmq.id){
              comboboxNames.push({
                name: cmb.name,
                option: cmb.options[parseInt(cmq.selectedIndex)].name
              })
              if(cmb.options[parseInt(cmq.selectedIndex)].price != ''){
                totalPerc += parseInt(cmb.options[parseInt(cmq.selectedIndex)].price)
                if(cmb.options[parseInt(cmq.selectedIndex)].coefficient != 'undefined' && cmb.options[parseInt(cmq.selectedIndex)].coefficient != undefined && cmb.options[parseInt(cmq.selectedIndex)].coefficient != ''){
                  totalCoe += parseInt(cmb.options[parseInt(cmq.selectedIndex)].coefficient)
                }
              }
            }
          })
        })
        allData.push({
          comboNames: comboboxNames
        })

        switchs.find({tabId: req.body._tabId}).then((sw) => {
            let tempSw = [];
            req.body._switch.map((fsw) => {
              sw.map((ssw) => {
                if(fsw == ssw._id){
                  tempSw.push(ssw.name);
                  totalSwtich += parseInt(ssw.price);
                }
              })
            })
            allData.push({
              switchs: tempSw
            })

          combination.find({tabId: req.body._tabId, _id: req.body._combId}).then((data) => {
            let combPrice = parseInt(data[0].totalPrice);
            totalPrice += combPrice;
            totalPrice = totalPrice + ((totalPrice * totalPerc) / 100);
            if(totalCoe > 0){
              totalPrice = (totalPrice * totalCoe);
            }
            totalPrice += totalSwtich;
            let backTotalPrice = totalPrice;

              const generatedId = orderid.generate().replace('-', '').replace('-', '');
              new order({
                orderId: generatedId,
                customerId: req.body.userId,
                discordAcceptUsername: '',
                discordSuccess: false,
                orderCheck: false,
                totalPrice: req.body._totalPrice.replace('€',''),
                account: {
                    nickname: req.body.nickname,
                    password: req.body.password,
                    accountId: req.body.accountId,
                    phone: req.body.phone,
                    summonerName: req.body.summonerName
                },
                detail: {
                  ...allData,
                  note: req.body.note
                },
              }).save().then((data) => {
                 res.send({
                  'status': 'success',
                  'orderId': generatedId,
                  'totalPrice': req.body._totalPrice,
                  'ibanNo': 'xxxxxxxxxxxxxxxxxx / (Account Holder: xxxxxxxxxxxxxxxxxx)'
                })
              }).catch((err) => {
                res.send({
                  'status': 'error',
                })
                console.log("Order Save Error: ", err);
              })
          })
        })
      })
  })
})

module.exports = router;