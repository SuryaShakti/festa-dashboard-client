import { Dialog, Menu, Transition } from "@headlessui/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/outline";

const BudgetDialogNew = ({ budgetOpen, setBudgetOpen, eventId, subevents }) => {
  const [budget, setBudget] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [subEventBudget, setSubEventBudget] = useState([]);
  const [fetchLoading, setFecthLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [totalBudgetLoading, setTotalBudgetLoading] = useState(false);
  const [selectedSubEvent, setSelectedSubEvent] = useState({});
  const [subEventAmount, setSubEventAmount] = useState();
  const [totalRemaining, setTotalRemaining] = useState();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState({});
  const [selectedSubCat, setSelectedSubCat] = useState({});
  const [note, setNote] = useState("");
  const [divAmount, setDivAmount] = useState(0);
  const [divisons, setDivisons] = useState([]);
  const [totalSubEventAmount, setTotalSubEventAmount] = useState(0);

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");

    setFecthLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-budget?event=${eventId}`,
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
        if (response.data.data[0].amount > 0) {
          setStep(2);
        }
        remaningBudget(response.data.data[0].amount, [
          ...response.data.data[0].subEventBudgets,
        ]);
        setFecthLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setFecthLoading(false);
      });
  };

  const modifyTotalAmount = async () => {
    const token = localStorage.getItem("token");
    if (totalAmount > 0) {
      setTotalBudgetLoading(true);
      var data = JSON.stringify({
        amount: totalAmount,
        subEventBudgets: subEventBudget.map((item) => {
          return {
            subBudgetId: item._id,
            amount:
              selectedSubEvent?._id === item._id ? subEventAmount : item.amount,
          };
        }),
      });

      var config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_API_URL}event-management/event-budget/${budget._id}?event=${eventId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          setTotalBudgetLoading(false);
          toast.success("Your budget has saved successfully", {
            position: "bottom-right",
          });
          remaningBudget(response.data.amount, subEventBudget);
          setStep(2);
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

  const handleBudgetChange = (event) => {
    const newTotalBudget = parseInt(event.target.value);
    setTotalAmount(newTotalBudget);
  };
  const handleSubBudgetChange = (event) => {
    const newTotalSubEventBudget = parseInt(event.target.value);
    setSubEventAmount(newTotalSubEventBudget);
  };

  const remaningBudget = (total, subEvents) => {
    var sum = 0;
    console.log(subEvents?.map((item) => item));
    subEvents?.map((item) => (sum = sum + item.amount))[0];
    console.log("Sum", total, sum);
    setTotalRemaining(total - sum);
  };

  const getCategories = async () => {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}category`,
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

  const getDetails = async (event) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event-budget/${event._id}?event=${eventId}`,
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
      toast.error("Please select a Sub category", {
        position: "bottom-right",
      });
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
    console.log(divisons);

    var data = JSON.stringify({
      amount: totalSubEventAmount,
      divisions: divisons,
    });

    setLoading(true);
    var config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}sub-event-management/sub-event-budget/${selectedSubEvent._id}?event=${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        toast.success("Budget distriibuted successfully among the categories", {
          position: "bottom-right",
        });
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const [updatedTotal, setUpdatedTotal] = useState(0);

  const newTotal = () => {
    console.log(selectedSubEvent?.amount);
    console.log(selectedSubEvent);
    var sum = 0;

    divisons
      ?.map((div, index) => div.amount)
      .sort(function (a, b) {
        return b - a;
      })
      .map((a, index) => (sum = sum + a))[0];

    console.log(sum);

    console.log(selectedSubEvent?.amount - sum);
    setUpdatedTotal(selectedSubEvent?.amount - sum);
  };

  useEffect(() => {
    fetchBudget();
    getCategories();
  }, []);

  useEffect(() => {
    newTotal();
  }, [loading, divisons]);

  return (
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
          <div className="flex h-full min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[90vw] h-full max-h-[93vh] transform overflow-hidden rounded-2xl overflow-y-scroll scrollbar-none bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Event Budget
                </Dialog.Title>
                <div className="mt-2">
                  {fetchLoading ? (
                    <div className="my-5 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-3">
                      <div className="mt-1">
                        <div className="pr-3">
                          <div className="flex items-center">
                            <div className="rounded-full h-8 w-8 -mr-px bg-green-400 text-white font-bold text-lg flex justify-center items-center">
                              1
                            </div>
                            <div className="bg-green-400 font-semibold text-white px-3 text-base rounded-r-xl -ml-1">
                              Enter the Total Event Budget
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-700 mt-1 text-base font-medium mb-1">
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
                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => modifyTotalAmount()}
                          >
                            Save
                          </button>
                        </div>
                        {step > 1 && (
                          <div className="mt-4 w-full">
                            <div className="flex items-center">
                              <div className="rounded-full h-8 w-8 -mr-px bg-green-400 text-white font-bold text-lg flex justify-center items-center">
                                2
                              </div>
                              <div className="bg-green-400 font-semibold text-white px-3 text-base rounded-r-xl -ml-1">
                                Enter the Total Budget you want to spend on each
                                Sub Event.
                              </div>
                            </div>
                            <div className="text-lg my-2 font-semibold text-gray-600">
                              Remaining Budget :{" "}
                              <span className="font-bold text-gray-600 underline underline-offset-1">
                                {totalRemaining}
                              </span>
                            </div>
                            {subEventBudget.length > 0 ? (
                              subEventBudget?.map((event, index) => (
                                <div
                                  key={index}
                                  className="border rounded-xl shadow p-2 my-3"
                                >
                                  <div className="w-full mb-4 flex justify-start items-center space-x-3">
                                    <div>
                                      <img
                                        src={event.subEvent.attachments[0]}
                                        className="h-28 w-28 object-cover"
                                      />
                                    </div>
                                    <div className="block">
                                      <label className="block text-gray-500 text-xl font-bold">
                                        {event?.subEvent?.name}
                                      </label>
                                      <label className="text-gray-500">
                                        {event?.description}
                                      </label>
                                      <label className="text-gray-500">
                                        Rs. {event?.amount}
                                      </label>
                                      <div className="flex w-full justify-end">
                                        <button
                                          onClick={() => {
                                            getDetails(event);
                                            setSelectedSubEvent(event);
                                            setSubEventAmount(event?.amount);
                                          }}
                                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        >
                                          Assign/Edit budget to the sub event
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div>
                                <div className="w-full py-5 text-center text-lg font-semibold text-gray-600">
                                  No Sub events Available. Create a sub event to
                                  divide budget.
                                </div>
                              </div>
                            )}
                            {/* <div className="w-full flex justify-end items-center">
                              <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-10 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                Save
                              </button>
                            </div> */}
                          </div>
                        )}
                      </div>
                      <div>
                        {selectedSubEvent?._id && (
                          <div className="mt-1">
                            <div className="flex items-center">
                              <div className="rounded-full h-8 w-8 -mr-px bg-green-400 text-white font-bold text-lg flex justify-center items-center">
                                3
                              </div>
                              <div className="bg-green-400 font-semibold text-white px-3 text-base rounded-r-xl -ml-1">
                                Enter the Total Budget you want to spend on{" "}
                                {selectedSubEvent.subEvent.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-700 mt-1 text-base font-medium mb-1">
                                Total Budget
                              </div>
                              <input
                                type="number"
                                className="w-full py-2 border rounded-lg px-4 border-gray-400"
                                value={subEventAmount}
                                defaultValue={selectedSubEvent?.amount}
                                onChange={handleSubBudgetChange}
                                placeholder={
                                  "Enter the budget of your sub event"
                                }
                              />
                              <div className="h-4">
                                {subEventAmount > totalRemaining && (
                                  <div className="text-xs text-right w-full text-red-500">
                                    Amount exceeded from remaining amount of{" "}
                                    {totalRemaining}.
                                  </div>
                                )}
                              </div>
                              <div className="mt-1">
                                <button
                                  type="button"
                                  disabled={subEventAmount > totalRemaining}
                                  className="disabled:bg-gray-400 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={() => modifyTotalAmount()}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                            {selectedSubEvent.amount > 0 && (
                              <div>
                                <div className="mt-3 ">
                                  <div className="text-gray-700 font-semibold text-lg">
                                    Divide your funds (Remaining Amount :{" "}
                                    <span className="font-bold text-gray-600 underline underline-offset-1">
                                      {updatedTotal}
                                    </span>
                                    )
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <div className="w-2/3 flex space-x-2">
                                      <Menu
                                        as="div"
                                        className="relative w-full  inline-block text-left mt-2"
                                      >
                                        <div>
                                          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-indigo-300 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                            {selectedCat?.title
                                              ? selectedCat?.title
                                              : "Category"}
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
                                          <Menu.Items className="absolute  mt-2 w-full px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1 ">
                                              {categories?.map((cat, index) => (
                                                <Menu.Item
                                                  key={index}
                                                  onClick={() => {
                                                    setSelectedCat(cat);
                                                    console.log(selectedCat);
                                                  }}
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
                                        className="relative w-full inline-block text-left mt-2"
                                      >
                                        <div>
                                          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-indigo-300 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                            {selectedSubCat?.title
                                              ? selectedSubCat.title
                                              : "Sub Category"}
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
                                          <Menu.Items className="absolute  mt-2 w-full px- origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="px-1 py-1 ">
                                              {selectedCat?.subCatgories?.map(
                                                (cat, index) => (
                                                  <Menu.Item
                                                    key={index}
                                                    onClick={() =>
                                                      setSelectedSubCat(cat)
                                                    }
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
                                    </div>

                                    <div>
                                      <div>
                                        <input
                                          type="number"
                                          className={
                                            divAmount <= updatedTotal
                                              ? "w-full h-[44px] border rounded-lg px-4 border-gray-400 text-gray-700"
                                              : "w-full h-[44px] border rounded-lg px-4 border-gray-400 text-red-600"
                                          }
                                          value={divAmount}
                                          onChange={(e) => {
                                            setDivAmount(e.target.value);
                                          }}
                                          placeholder={"Enter the budget"}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="h-5">
                                    {divAmount > updatedTotal && (
                                      <div className="text-xs text-right w-full text-red-500">
                                        Amount exceeded from remaining amount of{" "}
                                        {updatedTotal}
                                      </div>
                                    )}
                                  </div>
                                  {/* <textarea
                                    className="w-full my-3 border rounded-lg px-4 border-gray-400"
                                    value={note}
                                    row={2}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={"Note"}
                                  /> */}
                                  <div className="w-full mb-3 flex justify-end">
                                    <button
                                      type="button"
                                      disabled={divAmount > updatedTotal}
                                      className="inline-flex disabled:bg-gray-100 shadow-lg  justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                      onClick={() => {
                                        saveDivisons();
                                      }}
                                    >
                                      Add
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
                                                (cat) =>
                                                  cat._id === div.category
                                              )[0]
                                              ?.subCatgories.filter(
                                                (cat) =>
                                                  cat._id === div.subCategory
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
                                        <div>Save Sub Event Budget </div>
                                      </div>
                                    ) : (
                                      "Save Sub Event Budget"
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BudgetDialogNew;
