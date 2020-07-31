const axios = require("axios");
const qs = require('querystring');
const envs = require("../../env.json");
const badgeService = require("./BadgeService");
const fire = require("../../FirebaseU/FirebaseUtils");
const { data } = require("jquery");
const APP_URL = envs.service.app_url;
const SECRET = envs.service.secret;
const CLIENT_ID = envs.service.client_id;
const RETURN_URL = envs.service.return_url;

const ONE_DAY = 86400 * 1000; //86400s to ms
const ONE_HOUR = 3600 * 1000; //3600s to ms

const userToken = {};

const UserAuthService = {
  userAuth: async (initialData) => {
    var d = new Date();
    var time = d.getTime();

    if (
      userToken[initialData.email] &&
      time - userToken[initialData.email][1] < ONE_DAY
    ) {
      return userToken[initialData.email][0];
    }

    let response;
    const userData = `username=${encodeURIComponent(
      initialData.email
    )}&password=${encodeURIComponent(initialData.password)}`;
    await axios({
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "post",
      url: "https://api.badgr.io/o/token",
      data: userData,
    })
      .then((res) => {
        response = res.data;
        userToken[initialData.email] = [response, time];
      })
      .catch((err) => {
        console.log(err);
      });

    return response;
  },
  isLogged: async (data) => {
    var d = new Date();
    var time = d.getTime();
    if (data && data.data) {
      console.log("DATA: ", data.data.issuedOn);
      console.log("TIME: ", time);
      if (data && time - data.data.issuedOn < ONE_DAY) {
        return true;
      }
      return false;
    }
  },
  updateToken: async (initialData) => {
    console.log("BODY", initialData);
    console.log("REFRESH", initialData.token);
    let response;
    var dataRef = qs.stringify({
      refresh_token: initialData.token,
      grant_type: "refresh_token",
    });
    console.log("dataRef: ", dataRef);
    var config = {
      method: "post",
      url: "https://api.badgr.io/o/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: dataRef,
    };

    await axios(config)
      .then(function (res) {
        response = res.data;
        console.log("RESPONSE USERAUTHSERV", JSON.stringify(response));
      })
      .catch(function (error) {
        console.log("Error");
        //console.log(error);
      });

    return response;
  },
  oAuthGetToken: async (data, authToken) => {
    console.log("Data", data);
    const { code } = data.body;

    const url = `https://api.badgr.io/o/token?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${SECRET}&redirect_uri=${encodeURIComponent(RETURN_URL)}`;

    //const url = 'https://api.badgr.io/o/token';

    console.log("URL: ", url);
    console.log("DATA: ", code);

    var config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    };

    var body = {
        grant_type: "authorization_code",
        code: code,
        client_id: CLIENT_ID,
        client_secret: SECRET,
        redirect_uri: RETURN_URL
    }

    let response;
    // await axios.post(url,qs.stringify(body),config)
    //   .then(function (res) {
    //     response = res.data;
    //     console.log("RESPONSE: ", JSON.stringify(response));
    //   })
    //   .catch(function (error) {
    //     console.log("Error", error);
    //   });



    var formBody = [];
    for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch('https://api.badgr.io/o/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
    }).then(res=>res.json()).then(res => console.log(res)).catch(error=>console.log("ERROR",error))

    return response;
  },
  getBackpack: async (data, authToken) => {
    var userBackpack = { badges: [] };

    let response;

    console.log("DATA: ", data);

    await axios({
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      url: `https://api.badgr.io/v2/backpack/assertions`,
      method: "get",
    })
      .then((res) => {
        console.log("IT WORKED!!!");
        response = res.data.result;
      })
      .catch((err) => {
        console.log(err);
      });

    //get the badgedata and return it
    console.log("RESPONSE: ", response);
    var a = await axios({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      url: `https://api.badgr.io/v2/badgeclasses`,
      method: "get",
    });
  },
};

module.exports = UserAuthService;
