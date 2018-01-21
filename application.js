var express = require("express");
var app = express();
var nodemailer = require('nodemailer');

//test 
app.get('/hey',function(req,res){
console.log("input received");
res.send('hey hi how are you?');
});

//sends the html file in response
app.get('/',function(req,res){
res.sendFile(__dirname+"/"+"index2.html");

});


app.get('/convertandmailpdf/:email/:day/:hours/:minutes',function(req,res){

console.log(req.params.email);
console.log(req.params.day);
console.log(req.params.hours);
console.log(req.params.minutes);


//to read the html file
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./index2.html', 'utf8');
var options = { format: 'Letter' };


var pdf = require('html-pdf');
pdf.create(html).toFile(__dirname+"/"+"index3.pdf", function(err, res){

console.log("pdf created .....");
 
//Authorizing gmail account to send emails 
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nodeapptest12@gmail.com',
    pass: 'application'
  }
});

//schedule

var day =req.params.day;
var hours = req.params.hours;
var minutes = req.params.minutes;
var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.hour = hours;
rule.minute = minutes;
rule.dayOfweek = day;
 
var j = schedule.scheduleJob(rule, function(){
transporter.sendMail({
  from: 'nodeapptest12@gmail.com',
  to: req.params.email,
  subject: 'Ticket Stats',
  text: 'Please check the attached pdf',
  attachments: [{
    filename: 'index3.pdf',
    path: "./index3.pdf",
    contentType: 'application/pdf'
  }], function (err, info) {
     if(err){
       console.error(err);
       res.send(err);
     }
     else{
       console.log(info);
       res.send(info);
     }
  }
}); 
 console.log("Your email was sent on day -"+day+"of the week at  "+hours+" hours and  " +minutes+"minutes !! ");
});


//to send mail 
/*
transporter.sendMail({
  from: 'nodeapptest12@gmail.com',
  to: req.params.email,
  subject: 'Ticket Stats',
  text: 'Please check the attached pdf',
  attachments: [{
    filename: 'index3.pdf',
    path: "./index3.pdf",
    contentType: 'application/pdf'
  }], function (err, info) {
     if(err){
       console.error(err);
       res.send(err);
     }
     else{
       console.log(info);
       res.send(info);
     }
  }
}); */

  
  
  
});
 
 
 

res.send('Email Sent!');

});

//listening on port 8081


var server = app.listen(8081, function(){
var host = server.address().address;
var port = server.address().port;
console.log("--",host,port);
});
