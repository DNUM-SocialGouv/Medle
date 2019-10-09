export default async (req, res) => {
   console.log("body", req.body)
   const { email, password } = await req.body

   const validPassword = password => {
      return password.length
   }

   if (email === "michel.martin@caramail.fr" && password === "toto") {
      //return done(null, { user: "Michel Martin" })
      res.status(200).json({ token: "1234" })
   } else if (!email) {
      //   return done(null, false, { message: "Incorrect username." })
      return res.status(400).json({ message: "Incorrect username" })
   } else if (!validPassword(password)) {
      //   return done(null, false, { message: "Incorrect password." })
      res.status(400).json({ message: "Incorrect password" })
   } else {
      res.status(500).json({ message: "Erreur serveur" })
   }

   //    try {
   //       const response = await fetch(url)

   //       if (response.ok) {
   //          const { id } = await response.json()
   //          return res.status(200).json({ token: id })
   //       } else {
   //          // https://github.com/developit/unfetch#caveats
   //          const error = new Error(response.statusText)
   //          error.response = response
   //          throw error
   //       }
   //    } catch (error) {
   //       const { response } = error
   //       return response
   //          ? res.status(response.status).json({ message: response.statusText })
   //          : res.status(400).json({ message: error.message })
   //    }
}
