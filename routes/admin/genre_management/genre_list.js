const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_list_genre } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "genre_list"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 1
const blocname = tabside[idbloc].texte
const pagename = "Liste des genres"
const template = "genre_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/', async function (req, res, next) {
  let genres = []

  let r_core_genres = await core_list_genre(req.session.jwt_token)
  if (r_core_genres.success) {
    genres = r_core_genres.data
  }

  res.render(
    profile + "/" + tabside[idbloc].elements[index].template, {
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
    genres: genres
  })
});


router.post('/', async function (req, res, next) {

});

module.exports = router;