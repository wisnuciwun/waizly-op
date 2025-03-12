import { Input } from 'reactstrap';

export const FormInput = ({ register, name, ...props }) => {
    const { ref, ...registerField } = register(name);
    return <Input innerRef={ref} {...registerField} {...props} style={{ backgroundImage: 'none' }} />;
};



