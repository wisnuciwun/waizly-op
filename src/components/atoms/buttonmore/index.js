import React, { useRef } from 'react';
import Icon from '../icon';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import styled from 'styled-components';

function ButtonMore({
  hideButton = false,
  customIcon = 'more-h',
  id = 'popover-option',
  iconStyle = { position: 'relative' },
  popOverTrigger = 'legacy',
  childPlacement = 'bottom-start',
  children = null,
  disabled = false,
}) {
  let c = useRef();
  const hasContent = () => {
    const res = React.Children.toArray(children);
    return res.some((child) => !!child);
  };

  return (
    <>
      <Icon
        hidden={hideButton || !hasContent()}
        name={customIcon}
        id={id}
        style={{ ...iconStyle, cursor: 'pointer' }}
        onClick={() => {
          !disabled &&
            setTimeout(() => {
              c.current.click();
            }, 100);
        }}
      />
      <UncontrolledPopover
        disabled={disabled}
        trigger={popOverTrigger}
        target={id}
        placement={childPlacement}
        hideArrow
        fade
        style={{
          border: 'none',
          outline: 'none',
        }}
      >
        {!disabled && <input ref={c} hidden type="text" />}
        <StyledPopoverBody
          style={{
            border: 'none',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          {children}
        </StyledPopoverBody>
      </UncontrolledPopover>
    </>
  );
}

export default ButtonMore;

const StyledPopoverBody = styled(PopoverBody)`
  border: none;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  > * {
    margin-bottom: 6px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;
