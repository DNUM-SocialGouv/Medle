import Head from "next/head"
import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import CGU from "../mdx/cgu.mdx"

const CGUPage = () => {
  return (
    <>
      <Head>
        <title>Conditions générales d&apos;utilisation - Medlé</title>
      </Head>
      <MdxWrapper title="Conditions générales d'utilisation" mdx={<CGU />} />
    </>
  )
}

export default CGUPage
