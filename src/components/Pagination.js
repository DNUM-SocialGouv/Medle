import PropTypes from "prop-types"
import React from "react"
import { Pagination as RSPagination, PaginationItem, PaginationLink } from "reactstrap"

const isExistingPage = (data, numPage) => {
  if (!data) return false
  if (numPage <= 0) return false
  if (numPage > data.maxPage) return false

  return true
}

const Pagination = ({ data, fn }) => {
  if (data)
    return (
      <>
        <RSPagination aria-label="Pagination">
          <PaginationItem>
            <PaginationLink aria-label="Aller à la première page" first href="#" onClick={() => fn(0)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              aria-label="Aller à la page précédente"
              previous
              href="#"
              onClick={() => fn(data.currentPage - 1)}
            />
          </PaginationItem>
          {isExistingPage(data, data.currentPage - 2) && (
            <PaginationItem>
              <PaginationLink aria-hidden="true" tag={"span"}>
                &hellip;
              </PaginationLink>
            </PaginationItem>
          )}
          {isExistingPage(data, data.currentPage - 1) && (
            <PaginationItem>
              <PaginationLink
                aria-label={`Aller à la page ${data.currentPage - 1}`}
                href="#"
                onClick={() => fn(data.currentPage - 1)}
              >
                {data.currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem active={true}>
            <PaginationLink
              aria-label={`Aller à la page ${data.currentPage}`}
              href="#"
              onClick={() => fn(data.currentPage)}
            >
              {data.currentPage}
            </PaginationLink>
          </PaginationItem>
          {isExistingPage(data, data.currentPage + 1) && (
            <PaginationItem>
              <PaginationLink
                aria-label={`Aller à la page ${data.currentPage + 1}`}
                href="#"
                onClick={() => fn(data.currentPage + 1)}
              >
                {data.currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {isExistingPage(data, data.currentPage + 2) && (
            <PaginationItem>
              <PaginationLink aria-hidden="true" tag={"span"}>
                &hellip;
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              aria-label="Aller à la page suivante"
              next
              href="#"
              onClick={() => fn(data.currentPage + 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink aria-label="Aller à la dernière page" last href="#" onClick={() => fn(data.maxPage)} />
          </PaginationItem>
        </RSPagination>
        <style jsx global>{`
          .pagination {
            justify-content: center;
            align-items: center;
          }
          .page-item {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .page-link :hover {
            background-color: #a0adba;
          }
        `}</style>
      </>
    )
}

Pagination.propTypes = {
  data: PropTypes.shape({
    currentPage: PropTypes.number,
    maxPage: PropTypes.number,
  }),
  fn: PropTypes.func.isRequired,
}

export default Pagination
