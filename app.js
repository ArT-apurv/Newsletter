const express = require("express");
const https = require("https");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.FName;
  const lastName = req.body.LName;
  const eMail = req.body.EMail;

  const data = {
    members: [
      {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jasonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/fa13d52775";

  const options = {
    method: "POST",
    auth: "Art1998:165be8b956704b04c5569715d65a3611-us5",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jasonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("the Server is running");
});

// api key
// 165be8b956704b04c5569715d65a3611-us5

// list id
// fa13d52775
