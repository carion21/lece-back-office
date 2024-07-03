const Sidebare = require('../config/sidebare')
const ElementSidebare = require('../config/element_sidebare')
const BlocSidebare = require('./bloc_sidebare')
const { DEFAULT_ROUTE_ADMIN } = require('./consts')


class TabSidebase {

  constructor() {

  }

  /**
   * MENU DU COMPTE ADMIN
   */

  static admin() {
    return [
      BlocSidebare.nouveauBloc(
        "accueil",
        [
          ElementSidebare.nouveauElement("Tableau de bord", DEFAULT_ROUTE_ADMIN + "", "index", "bx bx-home", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "gestion des genres",
        [
          ElementSidebare.nouveauElement("Genres", DEFAULT_ROUTE_ADMIN + "/genre_management/genre_list", "genre_management/genre_list", "bx bx-book", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "gestion des auteurs",
        [
          ElementSidebare.nouveauElement("Auteurs", DEFAULT_ROUTE_ADMIN + "/author_management/author_list", "author_management/author_list", "bx bx-user", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "gestion des livres",
        [
          ElementSidebare.nouveauElement("Livres", DEFAULT_ROUTE_ADMIN + "/book_management/book_list", "book_management/book_list", "bx bx-book-open", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "gestion des abonnés",
        [
          ElementSidebare.nouveauElement("Abonnés", DEFAULT_ROUTE_ADMIN + "/subscriber_management/subscriber_list", "subscriber_management/subscriber_list", "bx bx-user-voice", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "gestion des messages",
        [
          ElementSidebare.nouveauElement("Messages", DEFAULT_ROUTE_ADMIN + "/message_management/message_list", "message_management/message_list", "bx bx-message", 0),
        ]
      ),
      BlocSidebare.nouveauBloc(
        "mon compte",
        [
          ElementSidebare.nouveauElement("Détails du compte", DEFAULT_ROUTE_ADMIN + "/user_management/account_details", "user_management/account_details", "bx bx-cog", 0),
          ElementSidebare.nouveauElement("Sécurité", DEFAULT_ROUTE_ADMIN + "/user_management/security", "user_management/security", "bx bx-lock-alt", 0),
          ElementSidebare.nouveauElement("Déconnexion", "/security/logout", "security/logout", "bx bx-log-out", 0),
        ]
      ),
    ]
  }

}

module.exports = TabSidebase