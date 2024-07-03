const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_read_message } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "read_message"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 5
const blocname = tabside[idbloc].texte
const pagename = "Lire un message"
const template = "message_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    id = parseInt(id)

    let r_core_read_message = await core_read_message(req.session.jwt_token, id)

    console.log(r_core_read_message);

    if (r_core_read_message.success) {
      message = r_core_read_message.data
      console.log(message);
    }

  }

  res.redirect(routedebase + "/message_management/" + template)
});

module.exports = router;