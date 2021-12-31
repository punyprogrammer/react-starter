import "./App.css";
import Topbar from "./Topbar/Topbar";
import MainContent from "./MainContent/MainContent";

const App = () => {
  return (
    <div className="app__container">
      <Topbar />
      <MainContent />
    </div>
  );
};

export default App;
