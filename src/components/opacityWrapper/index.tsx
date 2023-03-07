import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

const OpacityAnimation = ({
  duration,
  from,
  to,
  show,
  children,
  unmountOnExit,
  styles = {},
  className,
}) => {
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: from,
  };

  const transitionStyles = {
    entering: { opacity: from },
    entered: { opacity: to },
    exiting: { opacity: from },
    exited: { opacity: from },
  };

  return (
    <CSSTransition
      in={show}
      timeout={duration}
      classNames={"opacity"}
    >
      {(state) => (
        <div
          className={className}
          style={{ ...styles, ...defaultStyle, ...transitionStyles[state] }}
        >
          {children}
        </div>
      )}
    </CSSTransition>
  );
};

export default OpacityAnimation;
