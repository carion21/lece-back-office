const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_update_author, control_service_data, core_change_status_author } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "deactivate_author"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 2
const blocname = tabside[idbloc].texte
const pagename = "Desactivation d'un auteur"
const template = "author_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    let r_core_upd_author = await core_change_status_author(req.session.jwt_token, {
      id: parseInt(id),
      status: false
    })

    if (!r_core_upd_author.success) {
      console.log(r_core_upd_author);
    }

    res.redirect(routedebase + "/author_management/view_author/" + id)
  } else {
    res.redirect(routedebase + "/author_management/" + template)
  }
});


module.exports = router;