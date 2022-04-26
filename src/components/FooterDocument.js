import PropTypes from "prop-types"
import React from "react"

import { getFooterDocument } from "../clients/footer-documents"

const FooterDocument = ({ label, type }) => {
  const downloadFooterDocument = async (type) => {
    try {
      const documentData = await getFooterDocument(type)
      const url = URL.createObjectURL(new Blob([documentData]))
      window.open(url)
    } catch (error) {
      console.warn("Pas de document " + type + " trouvé !")
      window.open("/404")
    }
  }

  return (
    <>
      <button
        className="footer-document-button"
        aria-label={`${label} (nouvelle fenêtre)`}
        onClick={() => downloadFooterDocument(type)}
      >
        {label}
      </button>

      <style jsx>{`
        .footer-document-button {
          color: #181818;
          padding: 0px 15px;
          background-color: white;
          border-style: hidden;
        }
        .footer-document-button:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}

FooterDocument.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
}

export default FooterDocument
