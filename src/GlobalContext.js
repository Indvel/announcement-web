import React, { createContext, useState, useContext } from 'react';

// Context 생성
const GlobalContext = createContext();

// Provider 컴포넌트
const GlobalProvider = ({ children }) => {
  var [selDepart, setDepart] = useState('gwtp');
  var [selState, setState] = useState('all');
  var [dateRange, setDateRange] = useState('');
  var [startDate, setStartDate] = useState(new Date());
  var [endDate, setEndDate] = useState(new Date());
  var [isLoading, setIsLoading] = useState(false);
  var [listData, setListData] = useState([]);

  const value = {
    state: { selDepart, selState, dateRange, startDate, endDate, isLoading, listData },
    actions: { setDepart, setState, setDateRange, setStartDate, setEndDate, setIsLoading, setListData }
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };