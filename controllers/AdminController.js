const express = require('express');
const router = express.Router();

const service = 'admin'

// routers
const index = require('../routes/' + service + '/index')

const genre_list = require('../routes/' + service + '/genre_management/genre_list')
const new_genre = require('../routes/' + service + '/genre_management/new_genre')
const edit_genre = require('../routes/' + service + '/genre_management/edit_genre')
const view_genre = require('../routes/' + service + '/genre_management/view_genre')
const activate_genre = require('../routes/' + service + '/genre_management/activate_genre')
const deactivate_genre = require('../routes/' + service + '/genre_management/deactivate_genre')

const author_list = require('../routes/' + service + '/author_management/author_list')
const new_author = require('../routes/' + service + '/author_management/new_author')
const edit_author = require('../routes/' + service + '/author_management/edit_author')
const view_author = require('../routes/' + service + '/author_management/view_author')
const activate_author = require('../routes/' + service + '/author_management/activate_author')
const deactivate_author = require('../routes/' + service + '/author_management/deactivate_author')

const book_list = require('../routes/' + service + '/book_management/book_list')
const new_book = require('../routes/' + service + '/book_management/new_book')
const add_book_file = require('../routes/' + service + '/book_management/add_book_file')
const add_book_cover = require('../routes/' + service + '/book_management/add_book_cover')
const edit_book = require('../routes/' + service + '/book_management/edit_book')
const view_book = require('../routes/' + service + '/book_management/view_book')
const activate_book = require('../routes/' + service + '/book_management/activate_book')
const deactivate_book = require('../routes/' + service + '/book_management/deactivate_book')

const submission_list = require('../routes/' + service + '/submission_management/submission_list')
const view_submission = require('../routes/' + service + '/submission_management/view_submission')

const subscriber_list = require('../routes/' + service + '/subscriber_management/subscriber_list')

const message_list = require('../routes/' + service + '/message_management/message_list')
const read_message = require('../routes/' + service + '/message_management/read_message')

const security = require('../routes/' + service + '/user_management/security')
const account_details = require('../routes/' + service + '/user_management/account_details')

// routes with each router
router.use('/', index)

router.use('/genre_management/genre_list', genre_list)
router.use('/genre_management/new_genre', new_genre)
router.use('/genre_management/edit_genre', edit_genre)
router.use('/genre_management/view_genre', view_genre)
router.use('/genre_management/activate_genre', activate_genre)
router.use('/genre_management/deactivate_genre', deactivate_genre)

router.use('/author_management/author_list', author_list)
router.use('/author_management/new_author', new_author)
router.use('/author_management/edit_author', edit_author)
router.use('/author_management/view_author', view_author)
router.use('/author_management/activate_author', activate_author)
router.use('/author_management/deactivate_author', deactivate_author)

router.use('/book_management/book_list', book_list)
router.use('/book_management/new_book', new_book)
router.use('/book_management/add_book_file', add_book_file)
router.use('/book_management/add_book_cover', add_book_cover)
router.use('/book_management/edit_book', edit_book)
router.use('/book_management/view_book', view_book)
router.use('/book_management/activate_book', activate_book)
router.use('/book_management/deactivate_book', deactivate_book)

router.use('/submission_management/submission_list', submission_list)
router.use('/submission_management/view_submission', view_submission)

router.use('/subscriber_management/subscriber_list', subscriber_list)

router.use('/message_management/message_list', message_list)
router.use('/message_management/read_message', read_message)

router.use('/user_management/security', security)
router.use('/user_management/account_details', account_details)




module.exports = router;