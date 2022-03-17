import React from 'react';

type PropType = {
  label: string;
  classes: string;
  onClick: React.MouseEventHandler<any>;
  children?: React.ReactChild | React.ReactChild[];
};

const Button = ({ label, classes = '', onClick, children }: PropType) => {
  return (
    <div className={`button ${classes}`} onClick={onClick}>
      <span className="background"></span>
      <span className="label">{label}</span>
      {children}
    </div>
  );
};

Button.defaultProps = {
  label: '',
  classes: '',
  onClick: () => {},
};

export default Button;
