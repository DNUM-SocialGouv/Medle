import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { withAuthSync } from "../../utils/auth"
import { ACT_DETAIL_ENDPOINT } from "../../config"
import fetch from "isomorphic-unfetch"
import Layout from "../../components/Layout"
import Banner from "../../components/Banner"
import { Alert, Container, Spinner } from "reactstrap"

const ActDetail = () => {
   const router = useRouter()
   const { id } = router.query

   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState(false)
   const [act, setAct] = useState()

   useEffect(() => {
      const fetchData = async () => {
         let json
         try {
            const res = await fetch(ACT_DETAIL_ENDPOINT + "/" + id)
            json = await res.json()
            setAct(json.act)
         } catch (error) {
            console.error(error)
            setError(error)
         }
         setIsLoading(false)
      }

      setIsLoading(true)
      setError(false)
      fetchData()
   }, [id])

   return (
      <Layout>
         <Banner title="Détail d'un acte " />
         <Container>
            {isLoading && (
               <div style={{ width: 100 }} className="mx-auto mt-5 mb-3">
                  <Spinner color="primary">Loading...</Spinner>
               </div>
            )}

            {error && (
               <Alert color="danger" className="mt-5 mb-5">
                  Erreur de base de données
               </Alert>
            )}

            {!error && !isLoading && <span>{id}</span>}
         </Container>
      </Layout>
   )
}

export default withAuthSync(ActDetail)
