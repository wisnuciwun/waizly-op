// costum dropdown option for werehouse

interface PropsOption {
  value: number;
  name: string;
}

export const optionWerehouse = (options: PropsOption) => {
  return (
    <div className="d-flex align-items-center">
      <div>{options.name}</div>
      {options.value === 3 ? (
        <p
          style={{
            marginLeft: 10,
            fontWeight: 'bold',
            fontSize: 12,
            color: '#FF6E5D',
            backgroundColor: '#FFE3E0',
            padding: '2px 10px 2px 10px',
            borderRadius: '2px',
          }}
        >
          Coming Soon
        </p>
      ) : null}
    </div>
  );
};
