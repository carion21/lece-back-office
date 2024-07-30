const { SERVICE_TYPES_FIELDS } = require("./consts")
const { isString, isInteger, isBoolean, isObject, isArray, isNumber, isArrayOfString, isArrayOfInteger, getMoment, getCoreUrl } = require("./utils")

const axios = require('axios');
const validator = require('email-validator');

require('dotenv').config()

const urlapi = getCoreUrl()
const moment = getMoment()


const control_service_data = ((service_type_value, service_data) => {
  let result = {
    success: false
  }

  let error = ""

  try {
    if (isObject(service_data)) {
      let authorized_services = Object.keys(SERVICE_TYPES_FIELDS)

      if (authorized_services.includes(service_type_value)) {
        if (service_type_value == "undefined") {
          result.success = true
        } else {
          let rcontrol_basic = execute_service_basic_control_field(service_type_value, service_data)

          if (rcontrol_basic.success) {
            result.success = true
          } else {
            error = rcontrol_basic.message
          }
        }
      } else {
        error = "service_type is not valid or not implemented"
      }
    } else {
      error = "service_data must be an object"
    }
  } catch (err) {
    error = "big error when controlling service data : " + err.toString()
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const execute_service_basic_control_field = ((service_type_value, service_data) => {
  let result = {
    success: false
  }

  let error = ""

  try {
    let data_fields = Object.keys(service_data)
    let data_values = Object.values(service_data)

    let authorized_fields = SERVICE_TYPES_FIELDS[service_type_value].fields
    let authorized_types = SERVICE_TYPES_FIELDS[service_type_value].types

    let present_fields = data_fields.filter(field => authorized_fields.includes(field))
    let present_types = present_fields.map(field => authorized_types[authorized_fields.indexOf(field)])

    let required_fields = SERVICE_TYPES_FIELDS[service_type_value].required
    // let required_types = required_fields.map(field => authorized_types[authorized_fields.indexOf(field)])
    // verify if each element of required_fields is in data_fields
    if (required_fields.every(field => data_fields.includes(field))) {
      let rcontrol_fields_type = control_fields_type(present_fields, present_types, data_fields, data_values)

      if (rcontrol_fields_type.success) {
        result.success = true
      } else {
        error = rcontrol_fields_type.message
      }
    } else {
      error = "the authorized fields for service_type " + service_type_value + " are : " + authorized_fields.join(", ")
    }
  } catch (err) {
    error = "big error while executing service basic control field : " + err.toString()
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const control_fields_type = ((rfields, rtypes, dfields, dvalues) => {
  let result = {
    success: false
  }

  let error = ""

  result.success = true

  for (let i = 0; i < rfields.length; i++) {
    const field = rfields[i];
    const ftype = rtypes[i];
    const index = dfields.indexOf(field)
    if (index != -1) {
      const value = dvalues[index];
      let rcontrol_field_type = control_field_type(field, value, ftype)
      if (!rcontrol_field_type.success) {
        error = rcontrol_field_type.message
        result.success = false
        break;
      }
    } else {
      error = "the field " + field + " is required"
      result.success = false
      break;
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const control_field_type = ((field, value, field_type) => {
  let result = {
    success: false
  }

  let error = ""

  switch (field_type) {
    case "string":
      if (isString(value) && value != "") {
        result.success = true
      } else {
        error = "the field " + field + " must be a string"
      }
      break;
    case "string_not_empty":
      if (isString(value) && value != "") {
        result.success = true
      } else {
        error = "the field " + field + " must be a string and not empty"
      }
      break;
    case "string_email":
      if (isString(value) && value != "") {
        if (validator.validate(value)) {
          result.success = true
        } else {
          error = "the field " + field + " must be a string email"
        }
      } else {
        error = "the field " + field + " must be a string and not empty"
      }
      break;
    case "string_date":
      if (isString(value) && value != "") {
        if (moment(value, "YYYY-MM-DD HH:mm:ss").isValid() || moment(value, "YYYY-MM-DD").isValid()) {
          result.success = true
        }
      }
      if (!result.success) {
        error = "the field " + field + " must be a string date"
      }
      break;
    case "string_boolean":
      if (isString(value) && value != "") {
        if (value == "true" || value == "false") {
          result.success = true
        }
      }
      if (!result.success) {
        error = "the field " + field + " must be a string boolean"
      }
      break;
    case "string_integer":
      if (isString(value) && value != "") {
        if (isInteger(parseInt(value))) {
          result.success = true
        }
      }
      if (!result.success) {
        error = "the field " + field + " must be a string integer"
      }
      break;
    case "integer":
      if (isInteger(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be an integer"
      }
      break;
    case "boolean":
      if (isBoolean(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be a boolean"
      }
      break;
    case "object":
      if (isObject(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be an object"
      }
      break;
    case "array":
      if (isArray(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be an array"
      }
      break;
    case "number":
      if (isNumber(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be a number"
      }
      break;
    case "array_of_string":
      if (isString(value)) {
        value = [value]
      }
      if (isArrayOfString(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be an array of string"
      }
      break;
    case "array_of_integer":
      if (isInteger(value)) {
        value = [value]
      }
      if (isArrayOfInteger(value)) {
        result.success = true
      } else {
        error = "the field " + field + " must be an array of integer"
      }
      break;
    case "array_of_string_integer":
      if (isArrayOfString(value)) {
        if (value.every(element => isInteger(parseInt(element)))) {
          result.success = true
        }
      }
      if (!result.success) {
        error = "the field " + field + " must be an array of string integer"
      }
      break;
    case "undefined":
      result.success = true
      break;
    default:
      error = "the field " + field + " has an unknown type"
      break;
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_signin = (async (body) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_TO_SIGNIN
  try {
    let response = await axios.post(urlcomplete, {
      username: body.email,
      password: body.password
    })
    if (response.status == 201) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_retrieve_admin = (async (jwt_token, user_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_ADMIN
  urlcomplete += "/" + user_data.id.toString()
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_get_stats = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_STATS
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_list_genre = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_retrieve_genre = (async (jwt_token, genre_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  urlcomplete += "/" + genre_id.toString()
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_create_genre = (async (jwt_token, genre_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  try {
    let response = await axios.post(urlcomplete, genre_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 201) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_update_genre = (async (jwt_token, genre_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  urlcomplete += "/" + genre_data.id.toString()
  try {
    let response = await axios.patch(urlcomplete, genre_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_change_status_genre = (async (jwt_token, genre_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  urlcomplete += "/change-status/" + genre_data.id.toString()
  try {
    let response = await axios.patch(urlcomplete, genre_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_delete_genre = (async (jwt_token, genre_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_GENRE
  urlcomplete += "/" + genre_id.toString()
  try {
    let response = await axios.delete(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 204) {
      result.success = true
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_list_author = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_retrieve_author = (async (jwt_token, author_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  urlcomplete += "/" + author_id.toString()
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_create_author = (async (jwt_token, author_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  try {
    let response = await axios.post(urlcomplete, author_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token,
        ...author_data.getHeaders()
      }
    })
    if (response.status == 201) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_update_author = (async (jwt_token, author_id, author_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  urlcomplete += "/" + author_id.toString()
  try {
    let response = await axios.patch(urlcomplete, author_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token,
        ...author_data.getHeaders()
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})


const core_change_status_author = (async (jwt_token, author_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  urlcomplete += "/change-status/" + author_data.id.toString()
  try {
    let response = await axios.patch(urlcomplete, author_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_delete_author = (async (jwt_token, author_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_AUTHOR
  urlcomplete += "/" + author_id.toString()
  try {
    let response = await axios.delete(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 204) {
      result.success = true
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_list_book = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_retrieve_book = (async (jwt_token, book_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/" + book_id.toString()
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_create_book = (async (jwt_token, book_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  try {
    let response = await axios.post(urlcomplete, book_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 201) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

// form data file upload
const core_add_book_cover = (async (jwt_token, book_id, book_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/add-cover-file/" + book_id.toString()
  try {
    let response = await axios.patch(urlcomplete, book_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token,
        ...book_data.getHeaders()
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

// form data file upload
const core_add_book_file = (async (jwt_token, book_id, book_file) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/" + book_id.toString() + "/file"
  try {
    let response = await axios.post(urlcomplete, book_file, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token,
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.status == 201) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_update_book = (async (jwt_token, book_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/" + book_data.id.toString()
  try {
    let response = await axios.patch(urlcomplete, book_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_change_status_book = (async (jwt_token, book_data) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/change-status/" + book_data.id.toString()
  try {
    let response = await axios.patch(urlcomplete, book_data, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_delete_book = (async (jwt_token, book_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK
  urlcomplete += "/" + book_id.toString()
  try {
    let response = await axios.delete(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 204) {
      result.success = true
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})


const core_list_subscriber = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_SUBSCRIBER
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_list_message = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_MESSAGE
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_read_message = (async (jwt_token, message_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_MESSAGE
  urlcomplete += "/" + message_id.toString()
  console.log(urlcomplete);
  try {
    let response = await axios.patch(urlcomplete, {}, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
    if (err.response) {
      error = err.response.data.message
    }
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_list_submission = (async (jwt_token) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK_SUBMISSION
  try {
    let response = await axios.get(urlcomplete, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
  }

  if (error != "") {
    result.message = error
  }

  return result
})

const core_view_submission = (async (jwt_token, submission_id) => {
  let result = {
    success: false
  }

  let error = ""

  let urlcomplete = urlapi + process.env.ROUTE_OF_CORE_FOR_BOOK_SUBMISSION
  urlcomplete += "/" + submission_id.toString()
  try {
    let response = await axios.patch(urlcomplete, {}, {
      headers: {
        'Authorization': 'Bearer ' + jwt_token
      }
    })
    if (response.status == 200) {
      let rdata = response.data
      result.success = true
      result.data = rdata.data
    } else {
      error = response.data.message
    }
  } catch (err) {
    error = err.message
  }

  if (error != "") {
    result.message = error
  }

  return result
})

module.exports = {
  control_service_data,
  core_signin,
  core_retrieve_admin,
  core_get_stats,
  core_list_genre,
  core_retrieve_genre,
  core_create_genre,
  core_update_genre,
  core_change_status_genre,
  core_delete_genre,
  core_list_author,
  core_retrieve_author,
  core_create_author,
  core_update_author,
  core_change_status_author,
  core_delete_author,
  core_list_book,
  core_retrieve_book,
  core_create_book,
  core_add_book_cover,
  core_add_book_file,
  core_update_book,
  core_change_status_book,
  core_delete_book,
  core_list_subscriber,
  core_list_message,
  core_read_message,
  core_list_submission,
  core_view_submission
}