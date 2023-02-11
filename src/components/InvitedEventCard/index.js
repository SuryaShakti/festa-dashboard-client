import { useRouter } from "next/router";
import React from "react";

const InvitedEventCard = ({ item, section }) => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/${section}/${item._id}`)}
    >
      {" "}
      <div
        className={
          item.status === 1
            ? "relative rounded-2xl bg-gray-900 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
            : "relative rounded-2xl bg-gradient-to-r from-purple-600  to-violet-800 text-white mx-auto my-2 md:my-2 w-full max-w-[256px]"
        }
      >
        <div className="p-3">
          <div className="bg-[#ffffff] bg-opacity-20 p-3 flex justify-center items-center rounded-2xl">
            {item.status === 1 ? (
              <img className="h-32 w-full" src={item.attachments[0]} />
            ) : (
                <div className="w-full h-32 flex flex-col space-y-2 justify-center items-center border border-white rounded-xl">
                  <div className="text-white tetx-xl font-bold tracking-wide">Draft</div>
                  <div className="px-4 py-px text-sm rounded-lg cursor-pointer hover:bg-white hover:text-gray-700 border border-white text-white">Remove</div>
              </div>
            )}
          </div>
          <div className="text-base font-bold  text-center my-3">
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
  );
};

export default InvitedEventCard;
