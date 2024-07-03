const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { control_service_data, core_create_author } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "new_author"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 2
const blocname = tabside[idbloc].texte
const pagename = "Nouvel auteur"
const template = "author_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

const FormData = require('form-data');
const fs = require("fs");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Define the maximum size for uploading
// picture i.e. 10 MB. it is optional
const maxSize = 10 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /png|jpeg|jpg/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
      "following filetypes - " +
      filetypes
    );
  },

}).single("photo");

router.get('/', async function (req, res, next) {
  let user_connected = null

  res.render(
    profile + "/author_management/new_author", {
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
  let message = ""
  let error = ""

  upload(req, res, async function (err) {
    let body = req.body
    if (err) {
      error = err.toString()
    } else {
      let bcontrol = control_service_data(SERVICE_TYPE, body)

      if (bcontrol.success) {
        const author_data = new FormData();

        author_data.append("name", body.name);
        author_data.append("email", body.email);
        author_data.append("biography", body.biography);
        // author_data.append("photo", req.file);
        author_data.append("photo", fs.createReadStream(req.file.path));

        const r_core_new_author = await core_create_author(req.session.jwt_token, author_data);

        if (r_core_new_author.success) {
          // suppression du fichier
          fs.unlinkSync(req.file.path);
          
          res.redirect(routedebase + "/author_management/author_list");
        } else {
          error = r_core_new_author.message
        }
      } else {
        error = bcontrol.message
      }

    }

    if (error) {
      res.render(
        profile + "/author_management/new_author", {
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
        error: error,
        rbody: body
      })
    }
  });
});


module.exports = router;