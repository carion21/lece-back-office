const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_update_book, control_service_data, core_change_status_book } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "activate_book"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 3
const blocname = tabside[idbloc].texte
const pagename = "Activation d'un livre"
const template = "book_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    let r_core_upd_book = await core_change_status_book(req.session.jwt_token, {
      id: parseInt(id),
      status: true
    })

    if (!r_core_upd_book.success) {
      console.log(r_core_upd_book);
    }
  }

  res.redirect(routedebase + "/book_management/" + template)
});


module.exports = router;