import { useState, useRef, useEffect } from "react";
import Background from "./components/background";
import Penguin from "./components/penguin";
import Plot from "./components/plot";
import OpacityWrapper from "./components/opacityWrapper";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import "./App.css";
import Popup from "./components/popup";

const Link = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

function Home({ handleShowGraph, show }) {
  return (
    <OpacityWrapper
      duration={show ? 400 : 1000}
      from={1}
      to={0}
      show={show}
      className="container-info"
      styles={{
        zIndex: !show ? 1 : -1,
      }}
    >
      <span>
        Do you like penguins?
        <br /> Do you like scatter plots?
        <br /> Well, have we got a treat for you!
        <div className="click-here" onClick={handleShowGraph}>
          Click Here
        </div>
      </span>
    </OpacityWrapper>
  );
}

function App({ onClick }) {
  const [showplot, setShowPlot] = useState(false);
  const [showDataPoint, setShowDataPoint] = useState(false);
  const [dataPoint, setDataPoint] = useState({});

  const handleShowGraph = () => {
    onClick();
    setShowPlot(!showplot);
  };

  const handleDataPointClick = (e) => {
    setShowDataPoint(!showDataPoint);
    setDataPoint(e);
  };

  return (
    <div className="App">
      <Home handleShowGraph={handleShowGraph} show={showplot} />
      <Plot 
        show={showplot}
        close={handleShowGraph}
        onClick={handleDataPointClick}
      />
      <Popup data={dataPoint} show={showDataPoint} close={handleDataPointClick}/>
    </div>
  );
}

function AppWrapper() {
  const [showPlot, setShowPlot] = useState(false);

  const handleClick = () => {
    setShowPlot(!showPlot);
  };

  return (
    <>
      <Background showBackground={showPlot} />
      <Penguin show={showPlot} close={handleClick} />
      <App onClick={handleClick} show={showPlot} />
    </>
  );
}

export default AppWrapper;
