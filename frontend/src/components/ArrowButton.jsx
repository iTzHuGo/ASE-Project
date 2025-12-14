import React from "react";
import { Button, Icon } from "semantic-ui-react";

const ArrowButton = ({ direction = "next", onClick, disabled, ariaLabel }) => {
  const isBack = direction === "back";
  return (
    <Button
      circular
      icon
      className={`arrow-button ${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Icon name={isBack ? "chevron left" : "chevron right"} />
    </Button>
  );
};

export default ArrowButton;
