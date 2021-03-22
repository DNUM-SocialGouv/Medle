import React from "react"

import MdxWrapper from "../components/MdxWrapper"
import FAQ from "../mdx/faq.mdx"

const FaqPage = () => {
  return <MdxWrapper title="FAQ" mdx={<FAQ />} />
}

export default FaqPage
