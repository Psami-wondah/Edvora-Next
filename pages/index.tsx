import { useEffect, useState } from "react";
import filterlogo from "../public/images/SVGs/filter.svg";
import Image from "next/image";
import moment from "moment";
import { useAppSelector, useAppThunkDispatch } from "../redux/store/store";
import { getUser, getRides } from "../redux/actions/ride";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import _ from "underscore";
import { Ride, User, PayLoad } from "../types/ride";
import { FormControl, InputLabel, MenuItem, Popover, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Theme {
  selected: {
    color: string;
  };
}
export default function Home() {
  const dispatch = useAppThunkDispatch();
  const { rides, user, isLoading, states, cities } = useAppSelector((state) => state.ride);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState("nearest");
  const [generalList, setGeneralList] = useState([] as Array<Ride>);
  const [displayList, setDisplayList] = useState([] as Array<Ride>);
  const [rawRides, setRawRides] = useState([]);
  const [nearestRides, setNearestRides] = useState([]);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [userData, setUserData] = useState({} as User);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleStateChange = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };
  const handleCityChange = (event: SelectChangeEvent) => {
    setCity(event.target.value as string);
  };
  useEffect(() => {
    if (state !== "" && city !== "") {
      setGeneralList(displayList.filter((item) => item.state == state && item.city == city));
    } else if (state !== "" && city == "") {
      setGeneralList(displayList.filter((item) => item.state == state));
    } else if (state == "" && city !== "") {
      setGeneralList(displayList.filter((item) => item.city == city));
    } else {
      setGeneralList(displayList);
    }
  }, [state, city]);

  const getClosestNumber = (number: number, array: Array<number>) => {
    var current = array[0];
    array.forEach((item) => {
      if (Math.abs(number - item) < Math.abs(number - current)) {
        current = item;
      }
    });
    return current;
  };

  useEffect(() => {
    setUpcomingRides(
      generalList.filter((item) => new Date(item.date).getTime() > new Date().getTime()),
    );
  }, [generalList]);

  useEffect(() => {
    const iteratees = (obj: Ride) => obj.distance;
    const sorted = _.sortBy(
      generalList.filter((item) => new Date(item.date).getTime() < new Date().getTime()),
      iteratees,
    );
    setPastRides(sorted);
  }, [generalList]);
  useEffect(() => {
    const iteratees = (obj: Ride) => obj.distance;
    const sorted = _.sortBy(generalList, iteratees);
    setNearestRides(sorted);
  }, [generalList]);

  useEffect(() => {
    setUserData(user as User);
  }, [user]);
  useEffect(() => {
    setGeneralList(displayList);
  }, [displayList]);
  useEffect(() => {
    const newList = [];
    rawRides.forEach((ride) => {
      const distance = Math.abs(
        getClosestNumber(userData.station_code, ride.station_path) - userData.station_code,
      );
      newList.push({ ...ride, distance });
    });
    setDisplayList(newList);
  }, [rawRides]);

  useEffect(() => {
    setRawRides(rides);
  }, [rides]);

  useEffect(() => {
    (async () => {
      return await dispatch(getUser());
    })()
      .then((res) => {
        const payload = res.payload as PayLoad;
        if (payload.status) {
          toast.success(payload.message);
        } else {
          toast.error(payload.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      return await dispatch(getRides());
    })()
      .then((res) => {
        const payload = res.payload as PayLoad;
        if (payload.status) {
          toast.success(payload.message);
        } else {
          toast.error(payload.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userData]);

  return (
    <>
      <div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{
            "& .MuiPopover-paper": {
              borderRadius: "16px",
              width: "15rem",
              backgroundColor: "#131313",
              color: "white",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
            },
          }}
        >
          <div className="text-[#A5A5A5]  border-b-[#A5A5A5] border-b-2 mx-4 font-[300] text-xl font-sfProDisplay mb-2 p-2 ">
            Filters
          </div>
          <FormControl
            variant="filled"
            sx={{
              m: 1,
              minWidth: 120,
              backgroundColor: "#232323",
              "& .MuiSvgIcon-root": {
                color: "#A5A5A5",
              },
            }}
          >
            <InputLabel id="select-2" className="text-white">
              State
            </InputLabel>
            <Select
              labelId="select-2"
              id="select-2-filled"
              value={state}
              label="Age"
              onChange={handleStateChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {states?.map((item, key) => {
                return (
                  <MenuItem
                    id="menu-item"
                    value={item}
                    key={key}
                    className="bg-[#232323]"
                    sx={{
                      backgroundColor: "#232323",
                      color: "white",
                      ":hover": {
                        color: "black",
                      },
                    }}
                  >
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="filled"
            sx={{
              m: 1,
              minWidth: 120,
              backgroundColor: "#232323",
              "& .MuiSvgIcon-root": {
                color: "#A5A5A5",
              },
            }}
          >
            <InputLabel id="demo-simple-select-filled-label" className="text-white">
              Cities
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="select-2-filled"
              value={city}
              label="Age"
              onChange={handleCityChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {cities?.map((item, key) => {
                return (
                  <MenuItem
                    id="menu-item"
                    value={item}
                    key={key}
                    className="bg-[#232323]"
                    sx={{
                      backgroundColor: "#232323",
                      color: "white",
                      ":hover": {
                        color: "black",
                      },
                    }}
                  >
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Popover>
        <nav className="flex justify-between bg-[#101010] text-white py-4 px-6 md:px-11 items-center">
          <div className="font-bold text-xl  md:text-4xl font-sfProDisplay">Edvora</div>
          {isLoading ? (
            <TailSpin color="white" height={20} width={20} />
          ) : (
            <div className="flex justify-evenly items-center">
              <p className=" md:text-xl mr-4 font-inter font-bold ">{userData.name}</p>
              <div className="rounded-full overflow-hidden">
                <img src={userData.url} alt="profile-photo" className="w-8  object-cover" />
              </div>
            </div>
          )}
        </nav>
        <div className="bg-[#292929] px-4 md:px-11 font-inter pb-11">
          <div className=" text-[#D0CBCB] text-sm md:text-base flex md:justify-between px-2 md:px-0">
            <div className="flex py-5">
              <div
                onClick={() => setActiveTab("nearest")}
                className={`mr-2 md:mr-11 border-2 border-[#292929] py-1 cursor-pointer ${
                  activeTab == "nearest" ? "border-b-2 border-b-white text-white" : ""
                }`}
              >
                Nearest rides ({nearestRides.length})
              </div>
              <div
                onClick={() => setActiveTab("upcoming")}
                className={`mr-2 md:mr-11 border-2 border-[#292929] py-1 cursor-pointer ${
                  activeTab == "upcoming" ? "border-b-2 border-b-white text-white" : ""
                }`}
              >
                Upcoming rides ({upcomingRides.length})
              </div>
              <div
                onClick={() => setActiveTab("past")}
                className={` border-2 border-[#292929] py-1 cursor-pointer ${
                  activeTab == "past" ? "border-b-2 border-b-white text-white" : ""
                }`}
              >
                Past rides ({pastRides.length})
              </div>
            </div>
            <div className="flex items-center cursor-pointer" onClick={handleClick}>
              <Image src={filterlogo} width={12} height={12} alt="filterlogo" />
              <p className="ml-1 md:ml-2 font-[500]">Filters</p>
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-96">
              <TailSpin color="white" height={100} width={100} />
            </div>
          ) : (
            <div>
              {(activeTab == "nearest"
                ? nearestRides
                : activeTab == "upcoming"
                ? upcomingRides
                : activeTab == "past"
                ? pastRides
                : []
              )?.map((ride, key) => {
                return (
                  <div
                    key={key}
                    className="grid md:grid-cols-4 bg-[#171717] px-6 py-9 md:py-7 rounded-xl mb-4 relative"
                  >
                    <div className="col-span-1">
                      <img
                        src={ride.map_url}
                        alt="map_url"
                        className="mb-3 md:mb-0 h-36 w-96 md:w-72 object-cover"
                      />
                    </div>
                    <div className="col-span-3 ml-5">
                      <p className="text-[#CFCFCF]">
                        Ride Id : <span className="text-white">{ride.id}</span>
                      </p>
                      <p className="text-[#CFCFCF]">
                        Origin Station :{" "}
                        <span className="text-white">{ride.origin_station_code}</span>
                      </p>
                      <p className="text-[#CFCFCF]">
                        station_path :{" "}
                        <span className="text-white">{`[${String(ride.station_path)}]`}</span>
                      </p>
                      <p className="text-[#CFCFCF]">
                        Date :{" "}
                        <span className="text-white">
                          {moment(new Date(ride.date)).format("Do MMMM YYYY HH:mm")}
                        </span>
                      </p>
                      <p className="text-[#CFCFCF]">
                        Distance : <span className="text-white">{ride.distance}</span>
                      </p>
                    </div>
                    <div className="flex text-white space-x-3 w-max absolute left-3 md:left-auto md:right-0 -top-5 md:top-0 text-xs pr-7 pt-6">
                      <div className="bg-[#000000] rounded-3xl py-1 px-2">
                        <p>{ride.city}</p>
                      </div>
                      <div className="bg-[#000000] rounded-3xl py-1 px-2">
                        <p>{ride.state}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
