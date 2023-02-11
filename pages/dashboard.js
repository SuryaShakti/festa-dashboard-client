import React from 'react'

const dashboard = () => {
  return (
    <div className="flex bg-white rounded-3xl min-h-[95vh] flex-col px-10 py-4 md:mr-6 ">
      <div className="bg-white py-5 border-b border-gray-200 ">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              Dashboard
            </h3>
          </div>
          {/* <div className="ml-4 mt-2 flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create new job
            </button>
          </div> */}
        </div>
      </div>
      dashboard
    </div>
  );
}

export default dashboard