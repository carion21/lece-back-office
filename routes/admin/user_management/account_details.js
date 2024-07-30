const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, isInteger, getCoreUrl } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION, NLIMIT } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_retrieve_admin } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "admin_account_details"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 7
const blocname = tabside[idbloc].texte
const pagename = "Détail du compte"
const template = "account_details"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/', async function (req, res, next) {

  let user_connected = null
  let r_core_admin = await core_retrieve_admin(req.session.jwt_token, req.session.user_data)
  if (r_core_admin.success) {
    user_connected = r_core_admin.data.data
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
    user_connected: user_connected
  })
});

module.exports = router;