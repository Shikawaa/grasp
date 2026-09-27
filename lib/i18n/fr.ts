import {
  applyTypography,
  type TypographyDictionary,
} from "@/lib/i18n/typography";

const rawFr = {
  brand: "grasp",
  metadata: {
    title: "Grasp — Un thème à la fois",
    description: "Quelques minutes par jour pour comprendre un thème et t’en souvenir vraiment.",
  },
  language: {
    french: "FR",
    english: "EN",
    switchToFrench: "Afficher en français",
    switchToEnglish: "Afficher en anglais",
  },
  navigation: {
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    home: "Retour à l’accueil",
  },
  welcome: {
    eyebrow: "Bientôt disponible",
    lead: "Un thème par semaine, quelques minutes par jour, et ",
    highlight: "tu t’en souviens vraiment.",
    description:
      "Grasp apprend à te connaître, te raconte des thèmes précis en courtes leçons et t’aide à retenir chaque idée.",
    accountNote: "La démo jouable arrive bientôt.",
    arrowNote: "une vraie carte de révision",
    scrollNote: "la suite, par ici",
    preview: {
      label: "Vrai ou faux ?",
      theme: "Sakoku",
      progress: "1 / 3",
      question: "Pendant le sakoku, le Japon a coupé tout contact avec l’étranger.",
      wrongAnswer: "Vrai",
      rightAnswer: "Faux",
      feedback: "Exactement. Cette idée tient mieux.",
    },
    lessonPreview: {
      theme: "Psychologie",
      progress: "Leçon 2 sur 4",
      title: "Pourquoi on procrastine, même quand on sait",
      sentence: "Ton cerveau choisit l’immédiat.",
      sentenceHighlight: "choisit l’immédiat",
    },
    themeWall: {
      title: "Chaque semaine, un thème choisi pour toi",
      note: "Des angles précis, jamais des sujets fourre-tout.",
      topics: [
        "Comment le Japon s’est fermé au monde pendant 200 ans",
        "Pourquoi on procrastine, même quand on sait",
        "Edison contre Tesla : la guerre des courants",
        "Comment les Vikings ont atteint l’Amérique",
        "Pourquoi le jazz est né à La Nouvelle‑Orléans",
        "Ce que les champignons se disent sous la forêt",
        "Comment le café a conquis l’Europe",
        "Ce que ton cerveau fait pendant que tu dors",
      ],
    },
    howItWorks: {
      title: "Comment ça marche",
      note: "Quatre étapes, puis ça tourne tout seul.",
      interests: {
        title: "Tu réponds à quelques questions",
        history: "Histoire",
        psychology: "Psychologie",
        arts: "Arts",
        examples: "« les samouraïs, le jazz… »",
      },
      choice: {
        title: "Tu choisis un thème parmi trois",
        chosen: "Pourquoi on procrastine",
        alternativeOne: "Le sakoku",
        alternativeTwo: "Edison contre Tesla",
      },
      lesson: {
        title: "Une leçon de 3 minutes par jour",
        meta: "Leçon 2 sur 4, 3 min",
        sentenceBefore: "Ton cerveau",
        sentenceHighlight: "préfère une récompense immédiate.",
      },
      review: {
        title: "Tes révisions reviennent au bon moment",
        memory: "Mémoire",
        tomorrow: "Demain : 8 cartes",
      },
    },
    footer: {
      copyright: "© 2026",
    },
  },
  privateHome: {
    title: "Le nouveau carnet arrive.",
    description: "Ton espace d’apprentissage sera construit ici, lot après lot.",
  },
  auth: {
    signInTitle: "Retrouve ton carnet",
    signInDescription: "Entre ton e-mail et ton mot de passe.",
    email: "E-mail",
    emailPlaceholder: "toi@exemple.fr",
    password: "Mot de passe",
    currentPasswordPlaceholder: "Ton mot de passe",
    submit: "Se connecter",
    submitting: "Connexion…",
    forgotPassword: "Mot de passe oublié ?",
    resetRequest: "Recevoir le lien",
    resetRequestPending: "Envoi…",
    resetRequestSent: "Le lien de réinitialisation est parti.",
    resetTitle: "Choisis un nouveau mot de passe",
    resetDescription: "Il doit contenir au moins 8 caractères.",
    resetToken: "Code de réinitialisation",
    resetTokenPlaceholder: "Code reçu par e-mail",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirme le mot de passe",
    newPasswordPlaceholder: "8 caractères minimum",
    resetSubmit: "Changer le mot de passe",
    resetPending: "Modification…",
    resetDone: "Ton mot de passe est changé.",
    backToSignIn: "Retour à la connexion",
    invalidCredentials: "L’e-mail ou le mot de passe ne correspond pas.",
    authUnavailable: "La connexion est temporairement indisponible. Réessaie plus tard.",
    emailRequired: "Entre d’abord ton e-mail.",
    resetRequestError: "Le lien n’a pas pu être envoyé. Réessaie.",
    missingToken: "Le code de réinitialisation manque ou n’est plus valide.",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
    passwordMismatch: "Les deux mots de passe ne correspondent pas.",
    resetError: "Le mot de passe n’a pas pu être changé. Réessaie.",
  },
  notFound: {
    title: "Cette page n’existe pas.",
    note: "Elle a peut-être été retirée du carnet.",
  },
} as const;

export type DictionaryShape = TypographyDictionary<typeof rawFr>;

export const fr = applyTypography(rawFr, "fr");
