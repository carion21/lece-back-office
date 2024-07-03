const express = require('express');
const axios = require('axios');

const { getMoment, getTabSideBase, getRouteDeBase, getCoreUrl } = require('../../config/utils');
const { DEFAULT_PROFILE_ADMIN, APP_NAME, APP_VERSION, APP_DESCRIPTION, ORDER_STATUS_INITIATED, ORDER_STATUS_CANCELLED, ORDER_STATUS_SUPPORTED } = require('../../config/consts');
const { activeSidebare, getIndice } = require('../../config/sidebare');
const { core_get_stats } = require('../../config/global_functions');
const router = express.Router();

const urlapi = getCoreUrl();
const moment = getMoment();

const SERVICE_TYPE = "admin_dashboard"

const profile = DEFAULT_PROFILE_ADMIN;
const tabside = getTabSideBase(profile)
const idbloc = 0
const blocname = tabside[idbloc].texte
const pagename = "Tableau de bord"
const template = "index"
const routedebase = getRouteDeBase(profile)
const index = getIndice(tabside[idbloc].elements, template)
const page = tabside[idbloc].elements[index].texte
activeSidebare(tabside[idbloc].elements, index)

router.get('/', async function (req, res, next) {
  let r_core_stats = await core_get_stats(req.session.jwt_token)

  let count_books = 0
  let count_authors = 0
  let count_genres = 0
  let count_submissions = 0
  let count_subscribers = 0
  let count_messages = 0
  let count_new_messages = 0

  if (r_core_stats.success) {
    count_books = r_core_stats.data.data.count_books
    count_authors = r_core_stats.data.data.count_authors
    count_genres = r_core_stats.data.data.count_genres
    count_submissions = r_core_stats.data.data.count_submissions
    count_subscribers = r_core_stats.data.data.count_subscribers
    count_messages = r_core_stats.data.data.count_messages
    count_new_messages = r_core_stats.data.data.count_new_messages
  }

  const dashboard_data = [
    {
      label: "Livres",
      value: count_books,
      mdcard: 6,
      route: "/admin/book_management/book_list"
    },
    {
      label: "Auteurs",
      value: count_authors,
      mdcard: 6,
      route: "/admin/author_management/author_list"
    },
    {
      label: "Genres",
      value: count_genres,
      mdcard: 6,
      route: "/admin/genre_management/genre_list"
    },
    {
      label: "Soumissions",
      value: count_submissions,
      mdcard: 6,
      route: "/admin/submission_management/submission_list"
    },
    {
      label: "Abonnés",
      value: count_subscribers,
      mdcard: 6,
      route: "/admin/subscriber_management/subscriber_list"
    },
    {
      label: count_new_messages == 0 ? "Messages" : "Messages (" + count_new_messages + " non lu.s)",
      value: count_messages,
      mdcard: 6,
      route: "/admin/message_management/message_list"
    }
  ];

  res.render(
    profile + "/" + tabside[idbloc].elements[index].template, {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    appDescription: APP_DESCRIPTION,
    profile: profile,
    blocname: blocname,
    pagename: pagename,
    page: page,
    routedebase: routedebase,
    tabside: tabside,
    user_data: req.session.user_data,
    moment: moment,
    dashboard_data: dashboard_data,
  })
});

router.post('/', async function (req, res, next) {
  let r_dts_coins = await cryptorex_list_coins()
  let dts_coins = []
  if (r_dts_coins.success) {
    dts_coins = r_dts_coins.data
  } else {
    console.log('r_dts_coins', r_dts_coins);
  }
  console.log('dts_coins', dts_coins);

  let r_dts_exchanges = await cryptorex_list_exchanges()
  let dts_exchanges = []
  if (r_dts_exchanges.success) {
    dts_exchanges = r_dts_exchanges.data
  } else {
    console.log('r_dts_exchanges', r_dts_exchanges);
  }
  console.log('dts_exchanges', dts_exchanges);

  let r_dts_currencies = await cryptorex_list_currencies()
  let dts_currencies = []
  if (r_dts_currencies.success) {
    dts_currencies = r_dts_currencies.data
  } else {
    console.log('r_dts_currencies', r_dts_currencies);
  }
  console.log('dts_currencies', dts_currencies);

  let r_dts_fundraiser = await directus_retrieve_last_fundraiser()
  let dts_fundraiser = {}
  if (r_dts_fundraiser.success) {
    dts_fundraiser = r_dts_fundraiser.data
  } else {
    console.log('r_dts_fundraiser', r_dts_fundraiser);
  }
  console.log('dts_fundraiser', dts_fundraiser);

  const dashboard_data = [
    {
      label: "Coins",
      value: dts_coins.length,
      mdcard: 6
    },
    {
      label: "Exchanges",
      value: dts_exchanges.length,
      mdcard: 6
    },
    {
      label: "Der. collecte",
      value: moment(dts_fundraiser.created_at).format("DD/MM/YYYY HH:mm:ss"),
      mdcard: 12
    }
  ];

  let error = ""

  let body = req.body

  const bcontrol = control_service_data(SERVICE_TYPE, body)

  let tops = {
    buy: [],
    sell: []
  }

  if (bcontrol.success) {
    let dts_coin = dts_coins.find(coin => coin.id === parseInt(body.coin))

    r_dts_spot_buy = await directus_filter_ctx_spot({
      fundraiser_id: parseInt(dts_fundraiser.id),
      coin_id: parseInt(body.coin),
      coin_alias: dts_coin.alias,
      currency: body.currency,
      limit: parseInt(body.limit),
      ascending: true
    })
    if (r_dts_spot_buy.success) {
      tops.buy = r_dts_spot_buy.data
    }

    r_dts_spot_sell = await directus_filter_ctx_spot({
      fundraiser_id: parseInt(dts_fundraiser.id),
      coin_id: parseInt(body.coin),
      coin_alias: dts_coin.alias,
      currency: body.currency,
      limit: parseInt(body.limit),
      ascending: false
    })
    if (r_dts_spot_sell.success) {
      tops.sell = r_dts_spot_sell.data
    }
  } else {
    error = bcontrol.message
  }

  if (error) {
    res.render(
      profile + "/" + tabside[idbloc].elements[index].template, {
      appName: APP_NAME,
      appVersion: APP_VERSION,
      appDescription: APP_DESCRIPTION,
      profile: profile,
      blocname: blocname,
      pagename: pagename,
      page: page,
      routedebase: routedebase,
      tabside: tabside,
      user_data: req.session.user_data,
      moment: moment,
      dashboard_data: dashboard_data,
      fundraiser: dts_fundraiser,
      coins: dts_coins,
      currencies: dts_currencies,
      rbody: body,
      error: error
    })
  } else {
    res.render(
      profile + "/" + tabside[idbloc].elements[index].template, {
      appName: APP_NAME,
      appVersion: APP_VERSION,
      appDescription: APP_DESCRIPTION,
      profile: profile,
      blocname: blocname,
      pagename: pagename,
      page: page,
      routedebase: routedebase,
      tabside: tabside,
      user_data: req.session.user_data,
      moment: moment,
      dashboard_data: dashboard_data,
      fundraiser: dts_fundraiser,
      coins: dts_coins,
      currencies: dts_currencies,
      tops: tops,
      rbody: body,
      message: "Top " + body.limit + " des ordres d'achat et de vente récupérés avec succès"
    })
  }
});

module.exports = router;