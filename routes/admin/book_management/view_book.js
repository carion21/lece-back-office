const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_retrieve_book } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "view_book"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 3
const blocname = tabside[idbloc].texte
const pagename = "Détail d'un livre"
const template = "book_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    id = parseInt(id)
    let book = null

    let r_core_book = await core_retrieve_book(req.session.jwt_token, id)

    if (r_core_book.success) {
      book = r_core_book.data
    }

    res.render(
      profile + "/book_management/view_book", {
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
      book: book
    })
  } else {
    res.redirect(routedebase + "/" + template)
  }

});

module.exports = router;