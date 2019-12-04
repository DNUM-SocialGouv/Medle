import moment from "moment"
import joursFeries from "@socialgouv/jours-feries"

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
   const publicHolidays = joursFeries(moment(dateStr).format("YYYY"))

   const allDates = Object.values(publicHolidays).map(elt => moment(elt).format("YYYY-MM-DD"))

   if (allDates.includes(dateStr)) {
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
