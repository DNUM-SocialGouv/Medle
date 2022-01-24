export const mapForSelect = (data, fnValue, fnLabel) => (!data ? null : { label: fnLabel(data), value: fnValue(data) })

export const mapArrayForSelect = (data, fnValue, fnLabel) =>
  !data?.length ? [] : data.map((curr) => ({ label: fnLabel(curr), value: fnValue(curr) }))

/**
 * Traduction des valeurs des aides à l'accessibilité de react-select version 4.3.1
 * */
export const ariaLiveMessagesFR = {
  guidance: (props) => {
    const { isSearchable, isMulti, isDisabled, tabSelectsValue, context } = props
    switch (context) {
      case "menu":
        return `Utilisez les touches Haut et Bas pour parcourir les choix${
          isDisabled ? "" : ", appuyez sur Entrée pour sélectionner le choix actuellement ciblé"
        }, appuyez sur Échap pour quitter le menu${
          tabSelectsValue ? ", appuyez sur Tab pour sélectionner le choix et quitter le menu" : ""
        }.`
      case "input":
        return `${props["aria-label"] || "Aucun choix"} est ciblé${
          isSearchable ? ", tapez du texte pour affiner la liste" : ""
        }, appuyez sur les touches Haut ou Bas pour ouvrir le menu${
          isMulti ? ", appuyez sur la touche Gauche pour cibler les choix sélectionnés" : ""
        }`
      case "value":
        return `Utilisez les touches Gauche et Droit pour basculer entre les valeurs ciblées,
         appuyez sur Retour Arrière pour supprimer la valeur actuellement ciblée`
      default:
        return ""
    }
  },

  onChange: (props) => {
    const { action, label = "", isDisabled } = props
    switch (action) {
      case "deselect-option":
      case "pop-value":
      case "remove-value":
        return `choix ${label} désélectionné.`
      case "select-option":
        return isDisabled
          ? `choix ${label} désactivé. Merci d'en sélectionner un autre.`
          : `choix ${label} sélectionné.`
      default:
        return ""
    }
  },

  onFocus: (props) => {
    const { context, focused = {}, options, label = "", selectValue, isDisabled, isSelected } = props

    const getArrayIndex = (arr, item) => (arr && arr.length ? `${arr.indexOf(item) + 1} of ${arr.length}` : "")

    if (context === "value" && selectValue) {
      return `valeur ${label} ciblée, ${getArrayIndex(selectValue, focused)}.`
    }

    if (context === "menu") {
      const disabled = isDisabled ? " désactivé" : ""
      const status = `${isSelected ? " sélectionné" : "ciblé"}${disabled}`
      return `choix ${label} ${status}, ${getArrayIndex(options, focused)}.`
    }
    return ""
  },

  onFilter: (props) => {
    const { inputValue, resultsMessage } = props
    return `${resultsMessage}${inputValue ? " pour le terme de recherche " + inputValue : ""}.`
  },
}

export const reactSelectCustomTheme = (theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors, // Couleurs par défaut
    primary: "#2673E5", // #2684ff x
    primary75: "#4c9aff", // #4c9aff
    primary50: "#b2d4ff", // #b2d4ff
    primary25: "#deebff", // #deebff
    danger: "#de350b", // #de350b
    dangerLight: "#ffbdad", // #ffbdad
    neutral0: "#ffffff", // #ffffff
    neutral5: "#f2f2f2", // #f2f2f2
    neutral10: "#e6e6e6", // #e6e6e6
    neutral20: "cccccc", // #cccccc
    neutral30: "#b3b3b3", // #b3b3b3
    neutral40: "#797676", // #999999 x
    neutral50: "#808080", // #808080
    neutral60: "#666666", // #666666
    neutral70: "#4d4d4d", // #4d4d4d
    neutral80: "#333333", // #333333
    neutral90: "#1a1a1a", // #1a1a1a
  },
})
