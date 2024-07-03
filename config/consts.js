
class Consts {
    static NLIMIT = 10;

    static PORT_SYSTEM = 9555
    static APP_NAME = "LeceBackOffice"
    static APP_AUTHOR = "Carion21"
    static APP_VERSION = "1.0.0"
    static APP_DESCRIPTION = "BackOffice for Lece"

    static USERPROFILE_TYPE_UNDEFINED = 0;
    static USERPROFILE_TYPE_ADMIN = 2;

    static USERPROFILE_TYPES = [
        Consts.USERPROFILE_TYPE_ADMIN,
    ];

    static DEFAULT_PROFILE_ADMIN = "admin";

    static DEFAULT_PROFILES = [
        Consts.DEFAULT_PROFILE_ADMIN,
    ];

    static DEFAULT_ROUTE_ADMIN = "/" + Consts.DEFAULT_PROFILE_ADMIN;

    static DEFAULT_ROUTES = {
        [Consts.USERPROFILE_TYPE_ADMIN]: Consts.DEFAULT_ROUTE_ADMIN,
    };

    static DEFAULT_TYPES = [
        "string",
        "string_not_empty",
        "string_email",
        "string_date",
        "string_integer",
        "string_boolean",
        "number",
        "integer",
        "boolean",
        "object",
        "array",
        "array_of_string",
        "array_of_number",
        "array_of_integer",
        "array_of_boolean",
        "array_of_object",
        "array_of_string_integer"
    ];


    static SERVICE_TYPES = [
        "undefined",
        "security_login",
        "admin_search_spot",
        "admin_search_top",
        "admin_set_settings",
        "admin_account_details",
        "admin_security",
    ];

    static SERVICE_TYPES_FIELDS = {
        "undefined": {},
        "security_login": {
            "fields": ["email", "password"],
            "types": ["string_email", "string"],
            "required": ["email", "password"]
        },
        "new_genre": {
            "fields": ["name", "description"],
            "types": ["string_not_empty", "string"],
            "required": ["name"]
        },
        "edit_genre": {
            "fields": ["name", "description"],
            "types": ["string_not_empty", "string"],
            "required": ["name"]
        },
        "new_author": {
            "fields": ["name", "email", "biography"],
            "types": ["string_not_empty", "string_email", "string_not_empty"],
            "required": ["name", "email", "biography"]
        },
        "edit_author": {
            "fields": ["name", "email", "biography"],
            "types": ["string_not_empty", "string_email", "string_not_empty"],
            "required": ["name", "email", "biography"]
        },
        "new_book": {
            "fields": ["author", "title", "summary", "pages", "release_date", "genres"],
            "types": ["string_integer", "string", "string", "string_integer", "string_date", "array_of_string_integer"],
            "required": ["author", "title", "summary", "pages", "release_date", "genres"]
        },
        "edit_book": {
            "fields": ["author", "title", "summary", "genres"],
            "types": ["string_integer", "string", "string", "array_of_string_integer"],
            "required": ["author", "title", "summary", "genres"]
        },
        "admin_account_details": {
            "fields": ["lastname", "firstname", "email", "phone"],
            "types": ["string", "string", "string_email", "string_integer"],
            "required": ["lastname", "firstname", "phone"]
        },
        "admin_security": {
            "fields": ["current_password", "new_password", "confirm_new_password"],
            "types": ["string", "string", "string"],
            "required": ["current_password", "new_password", "confirm_new_password"]
        },
    };

}

module.exports = Consts;