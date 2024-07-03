const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_list_genre, core_list_author, control_service_data, core_list_book, core_create_book } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "new_book"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 3
const blocname = tabside[idbloc].texte
const pagename = "Nouveau livre"
const template = "book_list"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/', async function (req, res, next) {
  let genres = []

  let r_core_genres = await core_list_genre(req.session.jwt_token)
  if (r_core_genres.success) {
    genres = r_core_genres.data
    // recupere que les status actifs true
    genres = genres.filter(genre => genre.status === true)
  }

  let authors = []

  let r_core_authors = await core_list_author(req.session.jwt_token)
  if (r_core_authors.success) {
    authors = r_core_authors.data
    // recupere que les status actifs true
    authors = authors.filter(author => author.status === true)
  }

  res.render(
    profile + "/book_management/new_book", {
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
    genres: genres,
    authors: authors
  })
});


router.post('/', async function (req, res, next) {
  let body = req.body
  body.genres = typeof body.genres === "string" ? [body.genres] : body.genres;
  let bcontrol = control_service_data(SERVICE_TYPE, body)

  let error = ""

  if (bcontrol.success) {
    let book_data = {
      authorId: parseInt(body.author),
      title: body.title,
      summary: body.summary,
      pages: parseInt(body.pages),
      releaseDate: body.release_date,
      genres: body.genres.map(g => parseInt(g)),
    }

    let r_core_new_book = await core_create_book(req.session.jwt_token, book_data)

    if (r_core_new_book.success) {
      res.redirect(routedebase + "/book_management/book_list")
    } else {
      error = r_core_new_book.message
    }
  } else {
    error = bcontrol.message
  }

  if (error) {
    let genres = []

    let r_core_genres = await core_list_genre(req.session.jwt_token)
    if (r_core_genres.success) {
      genres = r_core_genres.data
      // recupere que les status actifs true
      genres = genres.filter(genre => genre.status === true)
    }

    let authors = []

    let r_core_authors = await core_list_author(req.session.jwt_token)
    if (r_core_authors.success) {
      authors = r_core_authors.data
      // recupere que les status actifs true
      authors = authors.filter(author => author.status === true)
    }
    res.render(
      profile + "/book_management/new_book", {
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
      rbody: body,
      genres: genres,
      authors: authors
    })
  }
});

module.exports = router;