const express = require('express');
const axios = require('axios');

const { getMoment, getDirectusUrl, getRouteDeBase, getCoreUrl } = require('../../config/utils');
const { APP_NAME, APP_VERSION, APP_DESCRIPTION, DEFAULT_ROUTE_CLIENT, USERPROFILE_TYPE_CLIENT, USERPROFILE_TYPES, DEFAULT_ROUTE_ADMIN, USERPROFILE_TYPE_ADMIN, DEFAULT_ROUTE_INTERMED, DEFAULT_ROUTES } = require('../../config/consts');
const { control_service_data, directus_retrieve_user, directus_verify_hash, directus_create_connection_history, core_signin } = require('../../config/global_functions');
const router = express.Router();

const SERVICE_TYPE = "security_login"

const urlapi = getCoreUrl();
const moment = getMoment();
const service = "security"

router.get('/', async function (req, res, next) {
  if (req.session.user_data) {
    let route = req.session.user_data.profile == USERPROFILE_TYPE_CLIENT ? DEFAULT_ROUTE_CLIENT : DEFAULT_ROUTE_ADMIN
    res.redirect(route)
  } else {
    res.render(
      "security/login", {
      appName: APP_NAME,
      appVersion: APP_VERSION,
      appDescription: APP_DESCRIPTION,
      service: service
    })
  }
});

router.post('/', async function (req, res, next) {
  let body = req.body
  let bcontrol = control_service_data(SERVICE_TYPE, body)

  let error = ""

  if (bcontrol.success) {
    let r_core_user = await core_signin(body)

    if (r_core_user.success) {
      req.session.user_data = r_core_user.data.data.user
      req.session.jwt_token = r_core_user.data.data.jwt
      let route = DEFAULT_ROUTE_ADMIN
      console.log("Redirecting to: " + route);

      res.redirect(route)
    } else {
      error = r_core_user.message
    }

  } else {
    error = bcontrol.message
  }

  if (error) {
    res.render(
      "security/login", {
      appName: APP_NAME,
      appVersion: APP_VERSION,
      appDescription: APP_DESCRIPTION,
      service: service,
      rbody: body,
      error: error
    })
  }
});

module.exports = router;