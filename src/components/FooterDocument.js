import PropTypes from "prop-types"
import React from "react"
import { saveAs } from "file-saver"


import { getFooterDocument } from "../clients/footer-documents"

const FooterDocument = ({ label, type }) => {
  const downloadFooterDocument = async (type) => {
    try {
      const documentData = await getFooterDocument(type)
      saveAs(new File([documentData], label + ".pdf", { type: 'application/pdf' }))
    } catch (error) {
      console.warn("Pas de document " + type + " trouvé !")
      window.open("/404")
    }
  }

  return (
    <>
      <button
        type="button"
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
