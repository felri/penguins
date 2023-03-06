import { useState, useRef } from "react";
import Background from "./components/background";
import Penguin from "./components/penguin";
import Plot from "./components/plot";
import { ClipboardMessage } from "./components/utils";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import "./App.css";

const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

function App({ updateRefValue }) {
  const [dissipate, setDissipate] = useState(false);

  const handleShowGraph = () => {
    updateRefValue();
    setDissipate(!dissipate);
  };

  return (
    <div className="App">
      <div className="container-info">
        <span className={
          dissipate ? "dissipate" : ""
        }>
          Do you like penguins?
          <br /> Do you like scatter plots?
          <br /> Well, have we got a treat for you!
          <div className="click-here" onClick={handleShowGraph}>
            Click Here
          </div>
        </span>
      </div>
      {
        dissipate && (
          <Plot />
        )}
    </div>
  );
}

function AppWrapper() {
  const showGraph = useRef(false);

  const updateRefValue = () => {
    showGraph.current = !showGraph.current;
  };

  return (
    <>
      {/* <Background isToggled={showGraph} /> */}
      <Penguin zoom={showGraph} />
      <App updateRefValue={updateRefValue}/>
    </>
  );
}

export default AppWrapper;
