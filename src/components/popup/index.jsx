import OpacityWrapper from "../opacityWrapper";
import "./styles.css";

export default function Popup({ data, show, close }) {
  return (
    <OpacityWrapper
      duration={300}
      from={0}
      to={1}
      show={show}
      className="popup"
      styles={{
        zIndex: show ? 5 : -2,
      }}
    >
      <div className="popup">
        <div className="popup__content">
          <div className="popup__close" onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div>
            <img src={`${data.species}.png`} alt="penguin" className="popup__image"/>
          </div>
          <div className="popup__info">
            <p>
              <b>Species:</b> {data.species}
            </p>
            <p>
              <b>Island:</b> {data.island}
            </p>
            <p>
              <b>Bill Length:</b> {data.bill_length_mm} mm
            </p>
            <p>
              <b>Bill Depth:</b> {data.bill_depth_mm} mm
            </p>
            <p>
              <b>Flipper Length:</b> {data.flipper_length_mm} mm
            </p>
            <p>
              <b>Body Mass:</b> {data.body_mass_g} g
            </p>
          </div>
        </div>
      </div>
    </OpacityWrapper>
  );
}
