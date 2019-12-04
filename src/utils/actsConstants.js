import moment from "moment"
import { FRENCH_PUBLIC_HOLIDAY_ENDPOINT } from "../config"
import fetch from "isomorphic-unfetch"

const initFetchFrenchPublicHoliday = async () => {
   const currentYear = moment().year()
   try {
      // TODO : cache data for some duration and refresh after time elapsed
      const res = await fetch(FRENCH_PUBLIC_HOLIDAY_ENDPOINT + currentYear)
      const json = await res.json()
      console.log("Jours fériés chargés")
      frenchPublicHoliday = json.map(elt => elt.date)
   } catch (error) {
      console.error("Erreur chargment jours fériés", error)
      frenchPublicHoliday = []
   }
}

let frenchPublicHoliday

initFetchFrenchPublicHoliday()

const periodOfDayValues = {
   week: {
      title: "lun.-ven.",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Journée",
            subTitle: "(8h30-18h30)",
         },
         {
            title: "Soirée",
            subTitle: "(18h30-00h)",
         },
      ],
   },
   saturday: {
      title: "sam.",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Matin",
            subTitle: "(8h30-12h30)",
         },
         {
            title: "Après-midi",
            subTitle: "(12h30-18h)",
         },
         {
            title: "Soirée",
            subTitle: "(18h-00h)",
         },
      ],
   },
   sunday: {
      title: "dim. et férié",
      period: [
         {
            title: "Nuit profonde",
            subTitle: "(00h-8h30)",
         },
         {
            title: "Journée",
            subTitle: "(08h30-18h30)",
         },
         {
            title: "Soirée",
            subTitle: "(18h30-00h)",
         },
      ],
   },
}

const getSituationDate = dateStr => {
   if (!frenchPublicHoliday) {
      console.warn("Les jours fériés n'ont pas été rapatriés")
   } else if (frenchPublicHoliday.includes(dateStr)) {
      return "sunday"
   }

   const dayInt = moment(dateStr).day()
   switch (dayInt) {
      case 0:
         return "sunday"
      case 6:
         return "saturday"
      default:
         return "week"
   }
}

export { periodOfDayValues, getSituationDate }
