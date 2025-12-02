import React from 'react'
import ReactPaginate from 'react-paginate'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

export default function PaginationBar({ totalPages, handlePageClick }) {
  return (
    <div className="w-full flex justify-center">
      <ReactPaginate
        breakLabel={<span className="mx-2 hidden sm:inline">•••</span>}
        nextLabel={
          <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-400 ml-2 sm:ml-4">
            <BsChevronRight />
          </span>
        }
        onPageChange={(e) => handlePageClick(e.selected + 1)}
        pageRangeDisplayed={window.innerWidth < 640 ? 1 : 3} // Show fewer pages on small screens
        pageCount={totalPages}
        previousLabel={
          <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-400 mr-2 sm:mr-4">
            <BsChevronLeft />
          </span>
        }
        renderOnZeroPageCount={null}
        containerClassName="flex flex-wrap items-center justify-center my-4 gap-1 sm:gap-2"
        pageClassName="block border border-gray-100 hover:bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-md mx-1 sm:mx-2"
        activeClassName="bg-[#ffcd2b] font-semibold"
      />
    </div>
  )
}
