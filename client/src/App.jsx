import React from "react";
import "./App.css";
import Content from "./Main";
// import DatabaseContext from "./utils/context";

export const DatabaseContext = React.createContext({});

function App() {
  const [currentDb, setCurrentDb] = React.useState({});
  return (
    <DatabaseContext.Provider value={[currentDb, setCurrentDb]}>
      <div className="App">
        <Content />
      </div>
    </DatabaseContext.Provider>
  );
}

export default App;
