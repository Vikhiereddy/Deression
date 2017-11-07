var mean = 0;
var stddev = 0;
var numEntries = 0;
var emotion =[0,0,0,0,0];
var patient = "insert-email";
var pass = "insert-password";
var doctor = "insert-email";
var filename = "data.csv";
var fs1 = require('file-system');
const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var path = require("path");

const app = express();
app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/sendData", function (req, res) {
  var json_format = JSON.parse(req.body.json_string);



  if(numEntries ==0){
    fs.writeFile("data.csv", "Date-Time, Score, CharCount,", (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
    });

  }

  numEntries += 1;


  getAnalytics(json_format.allmessages,json_format.timestamp);
  //console.log("hey bae");
  res.send("");
});



/*var http = require('http');
http.createServer( function (request, hey) {
  hey.writeHead(200, {'Content-type':'text/plan'});
  hey.write('Hello Node JS Server Response');
  hey.end( );
}).listen(3000);*/

console.log('Server running at http://127.0.0.1:3000/');


    function getAnalytics(message, timestamp){
        //console.log('hello');
        var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
        var natural_language_understanding = new NaturalLanguageUnderstandingV1({
          'username': 'add-key',
          'password': 'add-pass',
          'version_date': '2017-02-27'
        });

      var parameters = {
       'text': message,
       'features': {
        'sentiment': {

         },
        'emotion':{

        }

  }
};

  natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
    console.log('error:', err);
  else
    //console.log(JSON.stringify(response,null));
    var score = response.sentiment.document.score;
    var numchars = response.usage.text_characters;
    emotion[0] += response.emotion.document.emotion.sadness;
    emotion[1] += response.emotion.document.emotion.joy;
    emotion[2] += response.emotion.document.emotion.fear;
    emotion[3] += response.emotion.document.emotion.disgust;
    emotion[4] += response.emotion.document.emotion.anger;
    var oldmean = mean;

    if(numEntries > 1){
      stddev = Math.sqrt(Math.abs(((numEntries - 2.0) * Math.pow(stddev,2) - (score - oldmean) * (score - mean))/(numEntries - 1.0)));

  }else{
    stddev = 0;
    mean = score;
  }
     var tofile = timestamp +", " +score + ", " + numchars+  ",\n";
    fs.appendFile(filename, tofile, (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    console.log(score);
    //if(mean != 0){
      mean = (mean * (numEntries - 1) + score)/numEntries;

    method(score);




});
}

function visualization(filename){
// http://nodejs.org/api.html#_child_processes
    var util = require('util')
    var exec = require('child_process').exec;
    var child;
    fs.writeFile("emotionData.csv", "", (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
    });
    var tofile = "Feeling Prevalence,\n";
    tofile += emotion[0] +",\n" + emotion[1] +",\n"+ emotion[2]+",\n"+emotion[3]
      +",\n"+ emotion[4];
    fs.appendFile("emotionData.csv", tofile, (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });


    child = exec("RScript " +filename, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }

});


}

function method(score){
    console.log(score-mean + " " + mean + " " + stddev);
    if(Math.abs(score-mean) >= 1 * stddev && numEntries > 4){
        visualization("PdfMaker.r");
       // var nodemailer = require('nodemailer');

       /* var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: patient,
                pass: path
            }
        });*/

        var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var transport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: patient,
        pass: pass
    }
});

var mail = {
    from: patient,
    to: patient,
    subject: "Your Patient has entered into a 2 Sigma Event",
    text: "Here are the analytics on your patients' recent history. They currently have a mean of " + mean
    + " and a Standard Deviation of " + stddev,
    //html: "<b>Node.js New world for me</b",
    attachments: [  {   // filename and content type is derived from path
            path: 'Rplots.pdf'
        }]


  }

transport.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    transport.close();
});

/*


        var api_key = 'key-dea8340bb08220ebab7603a346138ae9';
        var domain = 'sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
        var filename1='Rplots.pdf';
        var filepath= path.join(__dirname,"Rplots.pdf");
        //var filepath = path.join(__dirname, filename);
        var file = fs1.readFileSync(filepath);

       var attch = new mailgun.Attachment({data: file, filename: filename1});

        var mailOptions = {
            from: "User <postmaster@sandbox8fb8164757984094aa0ba1f3097e25c1.mailgun.org>",
            to: doctor,
            subject: 'Your Patient is has had a 2 Sigma deviation from the norm',
            text: 'Here is a report on your patients Sentiment',
            attatchment: attch


        };

        mailgun.messages().send(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                 console.log('Email sent');
            }
        });*/
    }
}


