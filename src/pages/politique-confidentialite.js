import Head from "next/head"
import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import Privacy from "../mdx/privacy.mdx"

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Politique de confidentialité - Medlé</title>
      </Head>
      <MdxWrapper title="Politique de confidentialité" mdx={<Privacy />} />
    </>
  )
}

export default PrivacyPage
