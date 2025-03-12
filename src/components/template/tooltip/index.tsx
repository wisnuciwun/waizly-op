import React from 'react';
import {Icon} from '@/components';
import {UncontrolledTooltip, UncontrolledTooltipProps} from 'reactstrap';

interface Props {
  iconClass: string | null;
  icon: string | null;
  id: string | null;
  direction: UncontrolledTooltipProps['placement'] | null;
  text: string | null;
}

const TooltipComponent = ({iconClass, icon, id, direction, text, ...props}: Props & {[key: string]: any}) => {
  return (
    <React.Fragment>
      {props.tag ? (
        <props.tag id={id}>
          <Icon className={`${iconClass ? iconClass : ''}`} name={icon}></Icon>
        </props.tag>
      ) : (
        <Icon className={`${iconClass ? iconClass : ''}`} name={icon} id={id}></Icon>
      )}
      <UncontrolledTooltip style={props.style} autohide={false} placement={direction} target={id}>
        {text}
      </UncontrolledTooltip>
    </React.Fragment>
  );
};

export default TooltipComponent;
