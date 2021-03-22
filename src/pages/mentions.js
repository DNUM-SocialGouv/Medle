import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import Mentions from "../mdx/mentions.mdx"

const MentionsPage = () => {
  return <MdxWrapper title="Mentions légales" mdx={<Mentions />} />
}

export default MentionsPage
