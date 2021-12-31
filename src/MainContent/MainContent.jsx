import React, { useEffect, useState } from "react";
import "./maincontent.css";
import axios from "axios";

import DatePicker from "react-date-picker";
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
const MainContent = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [holidaysPermanent, setholidaysPermanent] = useState([]);
  const [timelineOption, setTimelineOption] = useState("");
  const [country, setCountry] = useState("");
  const [division, setDivision] = useState("england-and-wales");
  const [filters, setFilters] = useState({
    timeline: "",
    from: "",
    to: "",
  });
  const fromToFilter = (a) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const tempDate = new Date(a.date);
    return tempDate >= fromDate && tempDate <= toDate;
  };
  const timelineFilter = (a) => {
    const currTime = new Date();
    const thisTime = new Date(a.date);
    return (
      currTime - thisTime <=
        1000 * 24 * 60 * 60 * timelinemap[timelineOption] &&
      currTime - thisTime >= 0
    );
  };
  const countryFilter = (a) => {
    return a.country === country;
  };
  const handleApplyFilter = (e) => {
    e.preventDefault();
    let newHolidays = holidaysPermanent;
    if (from && to) {
      newHolidays = newHolidays.filter(fromToFilter);
    }
    if (timelineOption) {
      newHolidays = newHolidays.filter(timelineFilter);
    }
    if (country) {
      newHolidays = newHolidays.filter(countryFilter);
    }
    setHolidays(newHolidays);
  };
  const handleClearFilters = (e) => {
    e.preventDefault();
    setFrom("");
    setTo("");
    setTimelineOption("");
    setCountry("");
    setHolidays(holidaysPermanent);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://www.gov.uk/bank-holidays.json");

      const ew = response.data["england-and-wales"].events.map((item) => ({
        ...item,
        country: "england-and-wales",
      }));
      const sc = response.data["scotland"].events.map((item) => ({
        ...item,
        country: "scotland",
      }));
      const ni = response.data["northern-ireland"].events.map((item) => ({
        ...item,
        country: "northern-ireland",
      }));
      setHolidays(ew.concat(sc).concat(ni));
      setholidaysPermanent(ew.concat(sc).concat(ni));
    } catch (error) {
      console.log(error);
    }
  };
  const timelinemap = {
    yesterday: 1,
    lastWeek: 7,
    lastMonth: 30,
    lastYear: 365,
  };
  const countryOption = [
    {
      label: "None",
      value: "",
    },
    {
      label: "Northern Ireland",
      value: "northern-ireland",
    },
    {
      label: "Scotland",
      value: "scotland",
    },
    {
      label: "England and Wales",
      value: "england-and-wales",
    },
  ];
  const timelineOptions = [
    {
      label: "None",
      value: "",
    },
    {
      label: "Yesterday",
      value: "yesterday",
    },
    {
      label: "Last Week",
      value: "lastWeek",
    },
    {
      label: "Last Month",
      value: "lastMonth",
    },
    {
      label: "Last Year",
      value: "lastYear",
    },
  ];
  useEffect(() => {}, [holidays]);

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="main__content__container">
      <div className="main__content__heading">
        <h1 className="main__content__text">Get to know all you holidays</h1>
      </div>
      <div className="filter__header">
        <h1 className="filter__heading">
          Filter your holidays with the options below
        </h1>
      </div>
      <div className="filter__container">
        <div className="filter__options__container">
          <div className="timeline__filter__container">
            <span className="timeline__filter__container__text">Country</span>
            <select
              className="filter__select"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              {countryOption.map((option) => (
                <option className="filter__item" value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="timeline__filter__container">
            <span className="timeline__filter__container__text">
              Holidays in{" "}
            </span>
            <select
              className="filter__select"
              value={timelineOption}
              onChange={(e) => setTimelineOption(e.target.value)}
            >
              {timelineOptions.map((option) => (
                <option className="filter__item" value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="from__date__container">
            <span className="timeline__filter__container__text">From</span>
            <input
              className="date__input"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="to__date__container">
            <span className="timeline__filter__container__text">To</span>
            <input
              type="date"
              className="date__input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div className="date__range__filter__container"></div>
        <div className="buttons__container">
          <button
            className="filter__button"
            type="submit"
            onClick={handleApplyFilter}
          >
            Apply Filters
          </button>
          <button
            className="clear__filter__button"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="results__header">
        <div className="result__header__text">Title</div>
        <div className="result__header__text">Country</div>
        <div className="result__header__text">Date</div>
        <div className="result__header__text">Notes</div>
        <div className="result__header__text">Bunting</div>
      </div>
      <div className="results__container">
        {holidays.map((item) => {
          return (
            <div
              className="single__holiday"
              key={item.date + generateString(7)}
            >
              <div className="single__holiday__wrapper">
                <div className="result__text__title">{item.title}</div>
                <div className="result__text__title">{item.country}</div>
                <div className="result__text__date">{item.date}</div>
                <div className="result__text__notes">{item.notes}</div>
                <div className="result__text__notes">
                  {item.bunting ? "True" : "False"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainContent;
