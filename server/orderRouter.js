const db = require('./orderDB.js');
const express = require('express');
const app = express.Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': process.env.PAYPAL_ID,
  'client_secret': process.env.PAYPAL_SECRET
});

var pendingPayments = {};

app.post('/callback/payment_complete', (req, res) => {
  console.log(JSON.stringify(req.body));
  res.json();
  if (pendingPayments[req.body.orderid].res) {
    db.addMentorShip(pendingPayments[req.body.orderid].uid,
      pendingPayments[req.body.orderid].mid,
      pendingPayments[req.body.orderid].service_name,
      pendingPayments[req.body.orderid].service_price,
      (err) => {
        if (err) {
          console.log(err);
          pendingPayments[req.body.orderid].res.json({code: 1, errMsg: 'Database Error'});
          pendingPayments[req.body.order_id] = null;
          return;
        }
        pendingPayments[req.body.orderid].res.json({code: 0});
        pendingPayments[req.body.order_id] = null;
      });
  }
  else {
// Error Handling
  }
});

app.post('/api/poll_payment', (req, res) => {
  pendingPayments[req.body.order_id].res = res;
  setTimeout(function () {
    try {
      res.json({code: 15});
    } catch (e) {
    }
    pendingPayments[req.body.order_id].res = null;
  }, 10000);
});


app.post('/api/create_order', (req, res) => {
  // Temporary code for internal testing.
  // No payment required, get straight through as if payment confirmed
  db.addMentorShip(req.body.uid,
    req.body.mid,
    req.body.service_name,
    req.body.service_price,
    (err) => {
      if (err) {
        console.log(err);
        res.json({code: 1});
      }
      res.json({code: 0, url: '/account/mentor'});
    });
//   var timestamp = new Date().getTime();
//
//   var create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://job.y-l.me/return/payment_complete",
//         "cancel_url": "http://job.y-l.me/return/payment_cancel"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": req.body.service_name,
//                 "sku": req.body.service_name,
//                 "price": req.body.service_price,
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": req.body.service_price
//         },
//         "description": "Buddy Career 提供的服务"
//     }]
// };
//
//   paypal.payment.create(create_payment_json, function (err, payment) {
//     if (err) {
//       console.log(err);
//       res.json({code: 2, errMsg: 'Paypal API Error'});
//       return;
//     }
//
//     var redirect_url = '';
//     payment.links.forEach(function(el){
//       if(el.rel == 'approval_url')
//         redirect_url = el.href;
//     });
//
//     pendingPayments[payment.id] = {uid: req.body.uid, mid: req.body.mid, service_name: req.body.service_name, service_price: req.body.service_price};
//     console.dir(payment);
//     res.json({code: 0, url: redirect_url});
//   });
});

app.get('/return/payment_complete', (req, res) => {
  paypal.payment.get(req.query.paymentId, (err, payment) => {
    console.dir(payment);
    if (err) {
      console.log(err);
      res.json({code: 2, errMsg: 'Paypal API Error'});
      return;
    }

    // if(payment.payer.status == 'VERIFIED'){ // TODO: uncommment these

    db.addMentorShip(pendingPayments[payment.id].uid,
      pendingPayments[payment.id].mid,
      pendingPayments[payment.id].service_name,
      pendingPayments[payment.id].service_price,
      (err) => {
        if (err) {
          console.log(err);
          pendingPayments[payment.id] = null;
          return;
        }
        pendingPayments[payment.id] = null;
        res.redirect('/account/mentor');
      });

    // }
    // else{
    // res.redirect('/account/payment_fail');
    // }
  });
});

module.exports = app;