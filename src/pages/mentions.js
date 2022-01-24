import Head from "next/head"
import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import Mentions from "../mdx/mentions.mdx"

const MentionsPage = () => {
  return (
    <>
      <Head>
        <title>Mentions légales - Medlé</title>
      </Head>
      <MdxWrapper title="Mentions légales" mdx={<Mentions />} />
    </>
  )
}

export default MentionsPage
