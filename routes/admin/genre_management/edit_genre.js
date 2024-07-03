const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_retrieve_genre, core_update_genre, control_service_data } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "edit_genre"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 1
const blocname = tabside[idbloc].texte
const pagename = "Modifier un genre"
const template = "genre_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    id = parseInt(id)
    let genre = null

    let r_core_genre = await core_retrieve_genre(req.session.jwt_token, id)

    if (r_core_genre.success) {
      genre = r_core_genre.data
    }

    res.render(
      profile + "/genre_management/edit_genre", {
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
      genre: genre
    })
  } else {
    res.redirect(routedebase + "/" + template)
  }

});



router.post('/:id', async function (req, res, next) {
  let id = req.params.id

  if (!isInteger(parseInt(id))) {
    res.redirect(routedebase + "/" + template)
  }

  let body = req.body
  let bcontrol = control_service_data(SERVICE_TYPE, body)

  let error = ""

  if (bcontrol.success) {
    let genre_data = {
      id: parseInt(id),
      name: body.name,
      description: body.description
    }
    let r_core_upd_genre = await core_update_genre(req.session.jwt_token, genre_data)

    if (r_core_upd_genre.success) {
      res.redirect(routedebase + "/genre_management/genre_list")
    } else {
      error = r_core_upd_genre.message
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