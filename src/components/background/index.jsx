import "./styles.css";

function Mountain() {
  return (
    <>
      <div className="mountain">
        <div className="mountain-shadow" />
        <div className="snow-shadow" />
        <div className="snow" />
        <div className="snow-jagged" />
        <div className="snow-jagged-shadow" />
      </div>
    </>
  );
}

function Cloud({ size }) {
  return (
    <div className={size}>
      <div className="cloud"></div>
    </div>
  );
}

function CanvasWrapper({ showBackground }) {
  return (
    <div className="background-container">
      <Mountain />
      <div className="back-mountain-container">
        <Mountain />
      </div>
      <div className="front-mountain-container">
        <Mountain />
      </div>
      <Cloud size="x1" />
      <Cloud size="x2" />
      <Cloud size="x3" />
      <Cloud size="x4" />
      <Cloud size="x5" />
    </div>
  );
}

export default CanvasWrapper;
