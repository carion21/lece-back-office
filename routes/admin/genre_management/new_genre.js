const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { control_service_data, core_create_genre } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "new_genre"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 1
const blocname = tabside[idbloc].texte
const pagename = "Nouveau genre"
const template = "genre_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/', async function (req, res, next) {
  let user_connected = null

  res.render(
    profile + "/genre_management/new_genre", {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    appDescription: APP_DESCRIPTION,
    profile: profile,
    blocname: blocname,
    pagename: pagename,
    page: page,
    template: template,
    routedebase: routedebase,
    tabside: tabside,
    user_data: req.session.user_data,
    moment: moment,
    user_connected: user_connected
  })
});


router.post('/', async function (req, res, next) {
  let body = req.body
  let bcontrol = control_service_data(SERVICE_TYPE, body)

  let error = ""

  if (bcontrol.success) {
    let genre_data = {
      name: body.name,
      description: body.description
    }
    let r_core_new_genre = await core_create_genre(req.session.jwt_token, genre_data)

    if (r_core_new_genre.success) {
      res.redirect(routedebase + "/genre_management/genre_list")
    } else {
      error = r_core_new_genre.message
    }

  } else {
    error = bcontrol.message
  }

  if (error) {
    res.render(
      profile + "/genre_management/new_genre", {
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