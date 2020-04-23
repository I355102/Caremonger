var xsenv = $.require("@sap/xsenv");

var cai_credentials = xsenv.getServices({ cai: {  name: "CAI_TEXT_ANALYZER" } }).cai;

const request = $.require('superagent');
var url = cai_credentials.url + 'train/v2/request';
request
  .post(url)
  .send({
  	"text": "9971822468 I am calling from Mahadevpura and I need 2 kg rice"
  })
  .set('Authorization', cai_credentials.developerToken)
  .end((err, res) => 
	console.log(res.text));