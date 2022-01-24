import Head from "next/head"
import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import FAQ from "../mdx/faq.mdx"

const FaqPage = () => {
  return (
    <>
      <Head>
        <title>Foire aux questions - Medlé</title>
      </Head>
      <MdxWrapper title="Foire aux questions" mdx={<FAQ />} />
    </>
  )
}

export default FaqPage
