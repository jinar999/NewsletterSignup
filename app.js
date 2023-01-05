const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAdd = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAdd,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/008f33bb33";
  const options = {
    method: "POST",
    auth: "Jinar:43a3b3ef928ca09012812cfdc8d21dd0-us11",
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

  request.write(jsonData);
  request.end();

  // console.log(firstName, lastName, emailAdd);
});
app.post("/success", function (req, res) {
  res.redirect("/");
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function (req, res) {
  console.log(" app is running on port 3000 by Xin");
});

// api key
// 43a3b3ef928ca09012812cfdc8d21dd0-us11

// Audience ID
// 008f33bb33

// curl -X GET \
//   'https://${dc}.api.mailchimp.com/3.0/lists?fields=<SOME_ARRAY_VALUE>&exclude_fields=<SOME_ARRAY_VALUE>&count=10&offset=0&before_date_created=<SOME_STRING_VALUE>&since_date_created=<SOME_STRING_VALUE>&before_campaign_last_sent=<SOME_STRING_VALUE>&since_campaign_last_sent=<SOME_STRING_VALUE>&email=<SOME_STRING_VALUE>&sort_field=<SOME_STRING_VALUE>&sort_dir=<SOME_STRING_VALUE>&has_ecommerce_store=<SOME_BOOLEAN_VALUE>&include_total_contacts=<SOME_BOOLEAN_VALUE>' \
//   --user "anystring:${apikey}"'
