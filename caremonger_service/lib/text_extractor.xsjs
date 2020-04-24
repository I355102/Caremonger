var xsenv = $.require("@sap/xsenv");

var cai_credentials = xsenv.getServices({ cai: {  name: "CAI_TEXT_ANALYZER" } }).cai;

const request = $.require('superagent');
var url = cai_credentials.url + 'train/v2/request';

var data = [{
		"REQUESTER_NAME": "Sahil", "REQUESTER_PHONE_NUMBER": "9991282936", "REQUEST_DESCRIPTION": "Accident occured in Hoodi",
		"REQUEST_TYPE": "SOS", "REQUESTER_LOCATION": "Hoodi", "REQUEST_TIME": "2020-04-22 16:56:10", "CRITICALITY": "Very high"
		}, {
		"REQUESTER_NAME": "Sreedevi", "REQUESTER_PHONE_NUMBER": "9991282936", "REQUEST_DESCRIPTION": "Accident occured in Hoodi",
		"REQUEST_TYPE": "SOS", "REQUESTER_LOCATION": "Hoodi", "REQUEST_TIME": "2020-04-22 16:56:10", "CRITICALITY": "Very high"
		}, {
		"REQUESTER_NAME": "Sreedevi", "REQUESTER_PHONE_NUMBER": "9991282936", "REQUEST_DESCRIPTION": "Accident occured in Hoodi",
		"REQUEST_TYPE": "SOS", "REQUESTER_LOCATION": "Hoodi", "REQUEST_TIME": "2020-04-22 16:56:10", "CRITICALITY": "Very high"
		}, {
		"REQUESTER_NAME": "Sreedevi", "REQUESTER_PHONE_NUMBER": "9991282936", "REQUEST_DESCRIPTION": "Accident occured in Hoodi",
		"REQUEST_TYPE": "SOS", "REQUESTER_LOCATION": "Hoodi", "REQUEST_TIME": "2020-04-22 16:56:10", "CRITICALITY": "Very high"
		}, {
		"REQUESTER_NAME": "Sreedevi", "REQUESTER_PHONE_NUMBER": "9991282936", "REQUEST_DESCRIPTION": "Accident occured in Hoodi",
		"REQUEST_TYPE": "SOS", "REQUESTER_LOCATION": "Hoodi", "REQUEST_TIME": "2020-04-22 16:56:10", "CRITICALITY": "Very high"
		}]; 

request
  .post(url)
  .send({
  	"text": "9971822468 I am calling from Mahadevpura and I need 2 kg rice"
  })
  .set('Authorization', cai_credentials.developerToken)
  .end((err, res) => 
	console.log(res.text));