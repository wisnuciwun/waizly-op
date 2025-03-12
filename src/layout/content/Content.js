const Content = ({ ...props }) => {
  return (
    <div className="nk-content" style={{ marginTop: 17 }}>
      <div className="nk-content-body">
        {!props.page ? props.children : null}
        {props.page === 'component' ? (
          <div className="components-preview wide-md mx-auto">
            {props.children}
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Content;
