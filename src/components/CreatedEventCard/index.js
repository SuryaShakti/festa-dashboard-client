import { useRouter } from "next/router";
import React from "react";

const createdEventCard = ({ item, section, removeDraft }) => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer"
      onClick={() =>
        item.status === 1 && router.push(`/create-event?eventId=${item._id}`)
      }
    >
      {" "}
      <div
        className={
          item.status === 1
            ? "relative rounded-2xl bg-gray-100 bg-opacity-10 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
            : "relative rounded-2xl bg-opacity-25 to-violet-800 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
        }
      >
        <div className="">
          <div className="bg-[#ffffff] bg-opacity-20 flex justify-center items-center rounded-t-xl">
            {item.status === 1 ? (
              <img
                className="h-32 w-full rounded-t-xl object-cover"
                src={item.attachments[0]}
              />
            ) : (
              <div className="w-full relative h-32 flex flex-col space-y-2 justify-between items-center border border-gray-400 rounded-t-xl">
                <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 tetx-xl font-bold tracking-wide">
                  Draft
                </div>
                <div className="flex-1"></div>
              </div>
            )}
          </div>
          <div
            className={
              item.status === 1
                ? "p-3"
                : "p-3 bg-teal-200 rounded-b-2xl bg-opacity-20"
            }
          >
            <div className=" text-base font-bold  text-center my-3">
              {item.name}
            </div>
            {/* <div className="text-base font-bold  text-center mb-3">
            {item.upDOwnPerrcentage}
          </div> */}
            <div className="w-full h-px bg-white"></div>
            <div className=" text-xs text-center mt-2">
              {item.description ? item.description : "No description available"}
            </div>
            <div className="flex w-full justify-between px-2 mt-2">
              <button
                onClick={() => removeDraft(item._id)}
                className="px-4 py-1 text-sm rounded-md cursor-pointer bg-indigo-600 hover:bg-white hover:text-gray-700 text-white"
              >
                Remove
              </button>
              <button
                onClick={() => router.push(`/create-event?eventId=${item._id}`)}
                className="px-4 py-1 text-sm rounded-md cursor-pointer bg-indigo-600 hover:bg-white hover:text-gray-700 text-white"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default createdEventCard;
