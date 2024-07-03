const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl, isInteger } = require('../../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('../../../config/consts');
const { activeSidebare, getIndice } = require('../../../config/sidebare');
const { core_retrieve_book, core_list_genre, core_list_author, core_update_book, control_service_data } = require('../../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "edit_book"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 3
const blocname = tabside[idbloc].texte
const pagename = "Modifier un livre"
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
      profile + "/book_management/edit_book", {
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
      genres: genres,
      authors: authors
    })
  } else {
    res.redirect(routedebase + "/" + template)
  }

});


router.post('/:id', async function (req, res, next) {
  let id = req.params.id

  if (isInteger(parseInt(id))) {
    let body = req.body
    body.genres = typeof body.genres === "string" ? [body.genres] : body.genres;
    let bcontrol = control_service_data(SERVICE_TYPE, body)

    let error = ""

    if (bcontrol.success) {
      let book_data = {
        id: parseInt(id),
        authorId: parseInt(body.author),
        title: body.title,
        summary: body.summary,
        pages: parseInt(body.pages),
        releaseDate: body.release_date,
        genres: body.genres.map(g => parseInt(g)),
      }

      let r_core_new_book = await core_update_book(req.session.jwt_token, book_data)

      if (r_core_new_book.success) {
        res.redirect(routedebase + "/book_management/view_book/" + id)
      } else {
        error = r_core_new_book.message
      }

    } else {
      error = bcontrol.message
    }

    if (error) {
      id = parseInt(id)
      let book = null

      let r_core_book = await core_retrieve_book(req.session.jwt_token, id)

      if (r_core_book.success) {
        book = r_core_book.data
      }

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
        profile + "/book_management/edit_book", {
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
        book: book,
        genres: genres,
        authors: authors
      })
    }

  } else {
    res.redirect(routedebase + "/" + template)
  }

});

module.exports = router;