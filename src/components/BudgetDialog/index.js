import { Dialog, Menu, Transition } from "@headlessui/react";
import axios from "axios";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import Spinner from "../Spinner";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/outline";

const BudgetDialog = ({ budgetOpen, setBudgetOpen, eventId, subevents }) => {
  const [budget, setBudget] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [subEventBudget, setSubEventBudget] = useState([]);
  const [fetchLoading, setFecthLoading] = useState(true);
  const [totalBudgetLoading, setTotalBudgetLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState({});
  const [note, setNote] = useState("");
  const [divAmount, setDivAmount] = useState(0);
  const [divisons, setDivisons] = useState([]);
  const [totalSubEventAmount, setTotalSubEventAmount] = useState(0);
  const innerDialogInputRef = useRef(null);

  useEffect(() => {
    if (open && innerDialogInputRef.current) {
      innerDialogInputRef.current.focus();
    }
  }, [open]);

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");

    setFecthLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/event-management/event-budget?event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data.data[0]);
        setBudget(response.data.data[0]);
        setTotalAmount(response.data.data[0].amount);
        setSubEventBudget([...response.data.data[0].subEventBudgets]);
        setFecthLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setFecthLoading(false);
      });
  };

  const getCategories = async () => {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.test.festabash.com/v1/category",
    };
    setLoading(true);
    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log(eventId);
    fetchBudget();
    getCategories();
  }, []);

  const modifyTotalAmount = async () => {
    const token = localStorage.getItem("token");
    if (totalAmount > 0) {
      setTotalBudgetLoading(true);
      var data = JSON.stringify({
        amount: totalAmount,
        subEventBudgets: subEventBudget.map((item) => {
          return {
            subBudgetId: item._id,
            amount: item.amount,
          };
        }),
      });

      var config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `https://api.test.festabash.com/v1/event-management/event-budget/${budget._id}?event=${eventId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          setBudgetOpen(false);
          setTotalBudgetLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setTotalBudgetLoading(false);
        });
    } else {
      toast.error("Total amount can't be 0", {
        position: "bottom-right",
      });
    }
  };

  const saveHandler = async () => {
    modifyTotalAmount();
  };

  const handleBudgetChange = (event) => {
    const newTotalBudget = parseInt(event.target.value);
    setTotalAmount(newTotalBudget);
    // Distribute the total budget equally among sub events
    // const defaultBudget = newTotalBudget / subEventBudget.length;
    // setSubEventBudget(subEventBudget.map(() => defaultBudget));
    const _subEvents = subEventBudget;
    console.log(
      _subEvents.map(
        (item) => (item.amount = newTotalBudget / subEventBudget.length)
      )
    );
    console.log(subEventBudget);
  };

  const handleEventBudgetChange = (index, value) => {
    // console.log(index, value);
    const remainingBudget = totalAmount - value;
    console.log(remainingBudget);
    const subEventBudgetCopy = [...subEventBudget];
    subEventBudgetCopy[index].amount = value;

    const numRemaining = subEventBudgetCopy.filter(
      (subEvent, i) => i !== index
    ).length;
    const remainingValue = remainingBudget / numRemaining;
    subEventBudgetCopy.forEach((subEvent, i) => {
      if (i !== index) {
        subEvent.amount = remainingValue;
      }
    });

    setSubEventBudget(subEventBudgetCopy);
  };

  const getDetails = async (event) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/sub-event-management/sub-event-budget/${event._id}?event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        setDivisons(response.data.divisions);
        setTotalSubEventAmount(response.data.amount);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const saveDivisons = () => {
    if (!selectedCat?.title) {
      toast.error("Please select a category", { position: "bottom-right" });
      return;
    } else if (!selectedSubCat?.title) {
      toast.error("Please select a Sub category", { position: "bottom-right" });
    } else if (divAmount === 0) {
      toast.error("Please enter amount", { position: "bottom-right" });
    } else {
      setDivisons([
        ...divisons,
        {
          category: selectedCat._id,
          subCategory: selectedSubCat._id,
          amount: parseInt(divAmount),
          note: note.trim() !== "" ? note : "N/A",
        },
      ]);

      setSelectedCat({});
      setSelectedSubCat({});
      setDivAmount(0);
      setNote("");
    }
  };

  const deleteDiv = (div) => {
    console.log(div);
    console.log(divisons);
    const _divisons = [...divisons];

    setDivisons([
      ..._divisons.filter(
        (div2) =>
          div2.category !== div.category && div2.subCategory !== div.subCategory
      ),
    ]);
  };

  const DivisionSaveHandler = async () => {
    const token = localStorage.getItem("token");
    console.log(divisons)

    var data = JSON.stringify({
      amount: totalSubEventAmount,
      divisions: divisons,
    });

    setLoading(true);
    var config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `https://api.test.festabash.com/v1/sub-event-management/sub-event-budget/${selectedSubEvent._id}?event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        toast.success("Budget distriibuted successfully among the categories", {position: "bottom-right"})
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <Transition appear show={budgetOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setBudgetOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Budget
                  </Dialog.Title>
                  {fetchLoading ? (
                    <div className="my-5 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div>
                        <div>
                          <div className="text-gray-700 text-base font-medium mb-1">
                            Total Budget
                          </div>
                          <input
                            type="number"
                            className="w-full py-2 border rounded-lg px-4 border-gray-400"
                            value={totalAmount}
                            onChange={handleBudgetChange}
                            placeholder={"Enter the budget of your event"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="my-5">
                    {subEventBudget &&
                      totalAmount > 0 &&
                      subEventBudget.map((event, index) => (
                        <div
                          className="bg-gray-100 my-3 p-3 rounded-xl"
                          key={index}
                        >
                          <div className="w-full mb-4 flex justify-start items-center space-x-3">
                            <div>
                              <img
                                src={event.subEvent.attachments[0]}
                                className="h-28"
                              />
                            </div>
                            <div className="block">
                              <label className="block text-gray-500 text-xl font-bold">
                                {event?.subEvent?.name}
                              </label>
                              <label className="text-gray-500">
                                Rs. {event?.amount}
                              </label>
                            </div>
                          </div>
                          <Slider
                            value={event.amount}
                            min={0}
                            max={totalAmount}
                            step={1}
                            className="rc-slider"
                            onChange={(value) =>
                              handleEventBudgetChange(index, value)
                            }
                          />
                          {/* <div>Budget: {event.amount}</div> */}
                          <div className="my-2 mt-6">
                            <button
                              onClick={() => {
                                getDetails(event);
                                setSelectedSubEvent(event);
                                setOpen(true);
                              }}
                              className="w-full shadow-lg font-semibold text-gray-700 py-2 bg-white rounded-xl"
                            >
                              Assign Budget
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex shadow-lg w-full mx-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        saveHandler();
                      }}
                    >
                      {totalBudgetLoading ? (
                        <div className="flex w-max mx-auto justify-between items-center space-x-2">
                          <Spinner />
                          <div>Save</div>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          ref={innerDialogInputRef}
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full min-h-[90vh] max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Divide Budget
                  </Dialog.Title>
                  {loading ? (
                    <div className="my-5 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="bg-gray-100 my-3 p-2 rounded-xl">
                        <div className="w-full flex justify-start items-center space-x-3">
                          <div>
                            <img
                              src={selectedSubEvent?.subEvent?.attachments[0]}
                              className="h-20"
                            />
                          </div>
                          <div className="block">
                            <label className="block text-gray-500 text-xl font-bold">
                              {selectedSubEvent?.subEvent?.name}
                            </label>
                            <label className="text-gray-500">
                              Rs. {selectedSubEvent?.amount}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 ">
                        <div className="text-gray-700 font-semibold text-lg">
                          Divide your funds
                        </div>

                        <div className="flex justify-between items-center">
                          <Menu
                            as="div"
                            className="relative inline-block text-left mt-2"
                          >
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                Category
                                <ChevronDownIcon
                                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute  mt-2 w-max px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                  {categories?.map((cat, index) => (
                                    <Menu.Item
                                      key={index}
                                      onClick={() => setSelectedCat(cat)}
                                    >
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active
                                              ? "bg-violet-500 text-white"
                                              : "text-gray-900"
                                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                          {cat.title}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                          <Menu
                            as="div"
                            className="relative inline-block text-left mt-2"
                          >
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                Sub Category
                                <ChevronDownIcon
                                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute  mt-2 w-max px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                  {selectedCat?.subCatgories?.map(
                                    (cat, index) => (
                                      <Menu.Item
                                        key={index}
                                        onClick={() => setSelectedSubCat(cat)}
                                      >
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active
                                                ? "bg-violet-500 text-white"
                                                : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                          >
                                            {cat.title}
                                          </button>
                                        )}
                                      </Menu.Item>
                                    )
                                  )}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                          <div>
                            <div>
                              <input
                                type="number"
                                className="w-full h-[44px] border rounded-lg px-4 border-gray-400"
                                value={divAmount}
                                onChange={(e) => setDivAmount(e.target.value)}
                                placeholder={"Enter the budget"}
                              />
                            </div>
                          </div>
                        </div>
                        <textarea
                          className="w-full my-3 border rounded-lg px-4 border-gray-400"
                          value={note}
                          row={2}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder={"Note"}
                        />
                        <div className="w-full mb-3 flex justify-end">
                          <button
                            type="button"
                            className="inline-flex shadow-lg  justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => {
                              saveDivisons();
                            }}
                          >
                            save
                          </button>
                        </div>
                      </div>

                      <div className="my-2 flex-1">
                        {divisons?.map((div, index) => (
                          <div
                            key={index}
                            className="bg-slate-100 mb-2 rounded-xl p-3 shadow flex justify-between items-center"
                          >
                            <div className="flex-1">
                              <div className="text-lg text-gray-700 font-semibold">
                                {
                                  categories.filter(
                                    (cat) => cat._id === div.category
                                  )[0]?.title
                                }
                              </div>
                              <div className="my-1 text-gray-700 ">
                                {
                                  categories
                                    .filter(
                                      (cat) => cat._id === div.category
                                    )[0]
                                    ?.subCatgories.filter(
                                      (cat) => cat._id === div.subCategory
                                    )[0]?.title
                                }
                              </div>
                              <div className=" text-gray-700 ">
                                {div.amount}
                              </div>
                            </div>
                            <div onClick={() => deleteDiv(div)}>
                              <TrashIcon className="text-gray-700 w-5 hover:text-gray-800" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="my-4 flex justify-center">
                        <button
                          type="button"
                          className="inline-flex shadow-lg w-full mx-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            DivisionSaveHandler();
                          }}
                        >
                          {totalBudgetLoading ? (
                            <div className="flex w-max mx-auto justify-between items-center space-x-2">
                              <Spinner />
                              <div>Save</div>
                            </div>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BudgetDialog;
