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
            ? "relative rounded-2xl bg-white bg-opacity-25 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
            : "relative rounded-2xl bg-gradient-to-r from-purple-600 bg-opacity-25 to-violet-800 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
        }
      >
        <div className="">
          <div className="bg-[#ffffff] bg-opacity-20 flex justify-center items-center rounded-t-xl">
            {item.status === 1 ? (
              <img
                className="h-32 w-full rounded-t-xl"
                src={item.attachments[0]}
              />
            ) : (
              <div className="w-full h-32 flex flex-col space-y-2 justify-center items-center border border-white rounded-t-xl">
                <div className="text-white tetx-xl font-bold tracking-wide">
                  Draft
                </div>
                <button
                  onClick={() => removeDraft(item._id)}
                  className="px-4 py-px text-sm rounded-lg cursor-pointer hover:bg-white hover:text-gray-700 border border-white text-white"
                >
                  Remove
                </button>
                <button
                  onClick={() =>
                    router.push(`/create-event?eventId=${item._id}`)
                  }
                  className="px-4 py-px text-sm rounded-lg cursor-pointer hover:bg-white hover:text-gray-700 border border-white text-white"
                >
                  View details
                </button>
              </div>
            )}
          </div>
          <div className="p-3">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default createdEventCard;
