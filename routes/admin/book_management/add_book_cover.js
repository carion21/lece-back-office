const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_retrieve_book, core_add_book_cover } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "add_book_cover"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 3
const blocname = tabside[idbloc].texte
const pagename = "Ajouter une couverture de livre"
const template = "book_list"
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

}).single("file");

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
      profile + "/book_management/add_book_cover", {
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



router.post('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    let message = ""
    let error = ""

    upload(req, res, async function (err) {
      if (err) {
        error = err.toString()
      } else {
        const book_data = new FormData();
        book_data.append("file", fs.createReadStream(req.file.path));

        const r_core_new_book = await core_add_book_cover(req.session.jwt_token, id, book_data);

        if (r_core_new_book.success) {
          // suppression du fichier
          fs.unlinkSync(req.file.path);

          res.redirect(routedebase + "/book_management/view_book/" + id);
        } else {
          error = r_core_new_book.message
        }
      }

      if (error) {
        id = parseInt(id)
        let book = null

        let r_core_book = await core_retrieve_book(req.session.jwt_token, id)

        if (r_core_book.success) {
          book = r_core_book.data
        }

        res.render(
          profile + "/book_management/add_book_cover", {
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
          book: book,
          error: error
        })
      }
    });
  } else {
    res.redirect(routedebase + "/" + template)
  }

});

module.exports = router;