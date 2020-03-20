import React from "react"
import PropTypes from "prop-types"
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
            <RSPagination aria-label="Navigation">
               <PaginationItem>
                  <PaginationLink first href="#" onClick={() => fn(0)} />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink previous href="#" onClick={() => fn(data.currentPage - 1)} />
               </PaginationItem>
               {isExistingPage(data, data.currentPage - 2) && (
                  <PaginationItem>
                     <PaginationLink href="#">...</PaginationLink>
                  </PaginationItem>
               )}

               {isExistingPage(data, data.currentPage - 1) && (
                  <PaginationItem>
                     <PaginationLink href="#" onClick={() => fn(data.currentPage - 1)}>
                        {data.currentPage - 1}
                     </PaginationLink>
                  </PaginationItem>
               )}

               <PaginationItem active={true}>
                  <PaginationLink href="#" onClick={() => fn(data.currentPage)}>
                     {data.currentPage}
                  </PaginationLink>
               </PaginationItem>

               {isExistingPage(data, data.currentPage + 1) && (
                  <PaginationItem>
                     <PaginationLink href="#" onClick={() => fn(data.currentPage + 1)}>
                        {data.currentPage + 1}
                     </PaginationLink>
                  </PaginationItem>
               )}
               {isExistingPage(data, data.currentPage + 2) && (
                  <PaginationItem>
                     <PaginationLink href="#">&hellip;</PaginationLink>
                  </PaginationItem>
               )}
               <PaginationItem>
                  <PaginationLink next href="#" onClick={() => fn(data.currentPage + 1)} />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink last href="#" onClick={() => fn(data.maxPage)} />
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
