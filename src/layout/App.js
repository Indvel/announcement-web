import React, { useState, useContext, useEffect } from 'react';
import { subDays, subMonths, subYears } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import './App.css';
import searchIcon from '../resources/search_icon.svg';
import calendarIcon from '../resources/calendar_icon.svg';
import { GlobalContext } from '../GlobalContext';

import axios, * as others from 'axios';
const cheerio = require('cheerio');

function App() {
  /*검색 영역*/
  const annList = [
    {name: "강원TP", code: "gwtp"},
    {name: "과기부", code: "msit"},
    {name: "산자부", code: "motie"},
    {name: "NTIS", code: "ntis"},
    {name: "SMTECH", code: "smtech"},
    {name: "중기부", code: "mss"},
    {name: "GICA", code: "gica"},
    {name: "국토부", code: "molit"},
    {name: "IRIS", code: "iris"},
    {name: "TIPA", code: "tipa"}
  ];
  const stateList = [
    {name: "전체", code: "all"},
    {name: "모집중", code: "recruiting"},
    {name: "완료", code: "complete"}
  ]
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const rangeList = [
    {name: "전체", code: "all"},
    {name: "지난 7일", code: "last7"},
    {name: "지난 30일", code: "last30"},
    {name: "지난 3개월", code: "last90"},
    {name: "지난 6개월", code: "last180"},
    {name: "지난 1년", code: "last365"}
  ]
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const { state, actions } = useContext(GlobalContext);
  const { selDepart, selState, dateRange, startDate, endDate, isLoading, listData } = state;
  const { setDepart, setState, setDateRange, setStartDate, setEndDate, setIsLoading, setListData } = actions;

  /*날짜 변경 시*/
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const [isOpen, setIsOpen] = useState(false); // 달력 열림 상태 관리

  const handleOpen = () => {
    setIsOpen(true); //날짜 입력박스 focus(활성화) 시 창 열기
  };

  const handleClose = () => {
    changeDate();
    setIsOpen(false); // 확인 버튼 클릭 시 창 닫기
  };

  /*날짜 선택 - 날짜 범위 버튼 클릭 시*/
  const onSelectedChange = (e) => {
    if(dateRange != e.target.id) {
      // dateRange = e.target.id;
      setDateRange(e.target.id);
      e.target.setAttribute('class', 'selected');
      const otherItems = Array.from(document.querySelectorAll('.selRange > li')).filter((item) => item != e.target);
      otherItems.forEach((o) => o.removeAttribute('class'));
    }
  }

  useEffect(() => {
    switch(dateRange) {
      case 'all':
        setStartDate(null);
        setEndDate(null);
        break;
      case 'last7':
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
        break;
      case 'last30':
        setStartDate(subMonths(new Date(), 1));
        setEndDate(new Date());
        break;
      case 'last90':
        setStartDate(subMonths(new Date(), 3));
        setEndDate(new Date());
        break;
      case 'last180':
        setStartDate(subMonths(new Date(), 6));
        setEndDate(new Date());
        break;
      case 'last365':
        setStartDate(subYears(new Date(), 1));
        setEndDate(new Date());
        break;
    }
  }, [dateRange]);

  var rangeDate = rangeList.map((item) => (
    <li className={item.code == dateRange ? "selected" : "none"} id={item.code} onClick={(e) => onSelectedChange(e)}>
      {item.name}
    </li>
    ));
  
  /*공고 목록*/
  const [page, setPage] = useState(1);   // 현재 페이지

  var [annData, setAnnData] = useState(
        {
          gwtp: [],
          msit: [],
          motie: [],
          ntis: [],
          smtech: [],
          mss: [],
          gica: [],
          molit: [],
          iris: [],
          tipa: [],
          dapa: [],
          gsipa: []
        }
  );

  /*표시할 값*/
  var [data, setData] = useState([]);
 
  async function fetchHTML() {
    var { data } = await axios.get("http://13.209.139.113:5000/api/" + selDepart);
    annData[selDepart] = [];
    annData[selDepart] = data;
    setListData(annData[selDepart]);
  }

    useEffect(() => {
      if(listData.length == 0) {
        fetchHTML();
      }
    }, [])

    useEffect(() => {
      if(listData.length == 0) {
        fetchHTML();
      }
      listItems = getListItems(listData);
    }, [listData]);

    /*우선순위*/
    const sortData = function(data) {
      const condition = obj => obj.state == '모집중';
      data.sort((a, b) => {
        // 조건을 만족하면 우선순위를 높게 설정 (음수 반환)
        if(condition(a) && !condition(b)) return -1;
        if(condition(a) && condition(b)) return 1;
        return 0; // 둘 다 조건을 만족하거나 만족하지 않으면 순서 유지
      });
      return data;
    }
    setListData(listData);

    /*열람한 li 스타일 설정*/
    const setViewed = function(e) {
      // var parent = e.target.parentElement.parentElement.parentElement;
      // parent.style.background = "#F3F3F3";
    }

    /*목록 element 표시*/
    const getListItems = function(data) {
      if(data == undefined) return;
      if(data.length != 0) {
        data = sortData(data); //data가 비어있지 않다면 정렬 처리
        return data.map((d) => 
          <div className="td" id={d.state == '모집중' ? 'recruiting' : 'complete'}>
            <li>{d.depart}</li>
            <li>{d.date}</li>
            <li className={d.state == '모집중' ? 'recruiting' : 'complete'}>{d.state}</li>
            <li><b><a href={d.url} target="_blank" onClick={setViewed}>{d.title}</a></b></li>
          </div>
        )
      }
    }
    var listItems = getListItems(listData);

    /*TOP 버튼*/
    const [showButton, setShowButton] = useState(false);
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    useEffect(() => {
      const handleShowButton = () => {
          if (window.scrollY > 200) { //200이상 시 true
              setShowButton(true)
          } else {
              setShowButton(false)
          }
      }
      window.addEventListener("scroll", handleShowButton)
      return () => {
          window.removeEventListener("scroll", handleShowButton)
      }
    }, [])
    var footer;
    if(showButton) { //true면 버튼 표시
      footer = (
      <div className="footer">
        <div className="moveTop" onClick={scrollToTop}>
          TOP
        </div>
      </div>
      )
    } else {
      footer = '';
    }

    /*검색 영역 Functions*/
    /*부처 DropDownBox 변경 시*/
    const changeDepart = (e) => {
      var code = e.target[e.target.selectedIndex].getAttribute('code');
      if(code != selDepart) {
        setDepart(code);
        document.querySelector('.selDepart').value = e.target.value;
      }
    }

    useEffect(() => {
      setListData(annData[selDepart]);
      listItems = getListItems(listData);
    }, [selDepart]);

    /*공고현황(상태) DropDownBox 변경 시*/
    const changeState = (e) => {
      setState(e.target[e.target.selectedIndex].getAttribute('code'));
    }

    useEffect(() => {
      document.querySelector('.selState').value = document.querySelector('.selState option[code=' + selState + ']').innerHTML;
      if(selState == 'all') {
        setListData(annData[selDepart]);
      } else if(selState == 'recruiting') {
        var filter = annData[selDepart].filter((e) => e.state == '모집중');
        setListData(filter);
      } else if(selState == 'complete') {
        var filter = annData[selDepart].filter((e) => e.state == '완료');
        setListData(filter);
      }
    }, [selState]);

    /*날짜 선택 시*/
    const changeDate = function() {
      if(startDate != null && endDate != null) {
        var filter = annData[selDepart].filter((e) => {
          var curr = new Date(e.date);
          return curr >= startDate && curr <= endDate;
        });
        setListData(filter);
      } else {
        setListData(annData[selDepart]);
      }
      listItems = getListItems(listData);
    }
    /*검색 버튼 클릭*/
    const keywordSearch = function() {
     var input = document.querySelector('.inputText').value;
     if(input.length != 0) {
      var filter = annData[selDepart].filter((e) => e.title.indexOf(input) != -1);
      setListData(filter);
     } else {
      setListData(annData[selDepart]);
     }
     listItems = getListItems(listData);
    }
  return (
    <div className="App">
      <div className="searchArea">
        <select className="selDepart" id="selOpt" onChange={changeDepart}>
          {annList.map((item) => (
            <option value={item.name} key={item.code} code={item.code}>
              {item.name}
            </option>
          ))}
        </select>
        <select className="selState" id="selOpt" onChange={changeState}>
          {stateList.map((item) => (
            <option value={item.name} key={item.code} code={item.code}>
              {item.name}
            </option>
          ))}
        </select>

        <div className="selDate">
            <DatePicker className="datePicker"
              selectsRange={true}
              onChange={onChange}
              onFocus={handleOpen}
              shouldCloseOnSelect={false}
              startDate={startDate}
              endDate={endDate}
              selected={startDate}
              locale={ko}
              open={isOpen}
              disabledKeyboardNavigation
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
              }) => (
                <div className="custom-header">
                  <div className="custom-top">
                    <div className="btnArrow" onClick={decreaseMonth}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
                    </div>
                    <span>
                      {date.getFullYear()}년 {date.getMonth() + 1}월
                    </span>
                    <div className="btnArrow" onClick={increaseMonth}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
                    </div>
                  </div>
                  <div className="custom-day-names">
                    {dayNames.map((day, index) => (
                      <span
                        key={index}
                        style={{
                          color: index === 0 ? 'red' : index === 6 ? '#0066FF' : 'black',
                          margin: '3px',
                          fontSize: '12px'
                        }}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              onMonthChange={(date) => setCurrentMonth(date.getMonth())} // 달 변경 시 업데이트
              renderDayContents={(day, date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isCurrentMonth = date.getMonth() === currentMonth; // 이번 달인지 확인
                const dayOfWeek = date.getDay(); // 요일 확인 (0: 일요일, 6: 토요일)
        
                // 스타일 조건 설정
                let style = {};
                if (!isCurrentMonth) {
                  // 이번 달이 아닌 날짜
                  style = { color: 'lightgray' };
                } else if (dayOfWeek === 0) {
                  // 일요일
                  style = { color: 'red' };
                } else if (dayOfWeek === 6) {
                  // 토요일
                  style = { color: 'blue' };
                } else {
                  // 나머지 요일 (이번 달 내)
                  style = { color: 'black' };
                }
        
                return <span style={style}>{day}</span>;
              }}
              dateFormat="yyyy-MM-dd"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              >
              <div className="selRange">
                {rangeDate}
              </div>
              <div className="division"></div>
              <div className="buttons">
                <div className="calBtn" id="btnOk" onClick={handleClose}>
                  확인
                </div>
              </div>
            </DatePicker>
          <div className="calIcon">
            <img src={calendarIcon}></img>
          </div>
        </div>

        <div className="inputArea">
          <input className="inputText" onKeyDown={(e) => {
            if(e.code == 'Enter') {
              keywordSearch();
            }
          }}></input>
          <button className="btnSearch" onClick={keywordSearch}>
            <img src={searchIcon}></img>
          </button>
        </div>
      </div>
      <div className="main">
      <div className="content">
        <div className="content-title">공고 목록</div>
        <div className="contentTable">
          <div className="th">
            <li>부처</li>
            <li>공고일</li>
            <li>접수현황</li>
            <li>공고명</li>
          </div>
          {listItems}
        </div>
      </div>
    </div>
    {footer}
    </div>
  );
}

export default App;
