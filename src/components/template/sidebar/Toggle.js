import Icon from '@/components/atoms/icon';

const Toggle = ({ className, click, icon }) => {
  return (
    <a
      href="#toggle"
      className={className ? className : ''}
      onClick={(ev) => {
        ev.preventDefault();
        click(ev);
      }}
    >
      <Icon name={icon} />
    </a>
  );
};
export default Toggle;
