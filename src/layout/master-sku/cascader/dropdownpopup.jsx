/* eslint-disable react-hooks/exhaustive-deps */
import React,{  useState,useEffect } from 'react';
import Create from './styles';
import { Icon } from '@/components';

const DropdownPopup = ({ options, setValue, valueInput, isSearching, findPath}) => {
    const [optionsChildren, setOptionsChildren] = useState([]);
    const [optionsSecondChildren, setOptionsSecondChildren] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedFirstChildren, setselectedFirstChildren] = useState('');
    const [selectedSecondChildren, setselectedSecondChildren] = useState('');

    const handleClick = (value) => {
        setValue(value);    
    };

    const handleGetFirstChildren = (value) => {
        const selectedOption = options.find((listParent) => listParent.name === value);
        if (selectedOption && selectedOption.children) {
            setOptionsChildren(selectedOption.children);
            if(!valueInput){
                setOptionsSecondChildren([]);
            }
        } 
        setselectedFirstChildren(value);
    };

    const handleGetSecondChildren = (value) => {
        const selectedOption = optionsChildren.find((listParent) => listParent.name === value);
        if (selectedOption && selectedOption.children) {
            setOptionsSecondChildren(selectedOption.children);
        } 
        setselectedSecondChildren(value);
    };

    const isValueInChildren = (children, value) => {
        for (let child of children) {
            if (child.name === value) {
                return true;
            }
            if (child.children && isValueInChildren(child.children, value)) {
                return true;
            }
        }
        return false;
    };

    // const findLabelByValue = (value, options) => {
    //     for (let option of options) {
    //       if (option.value === value) {
    //         return option.name;
    //       }
    //       if (option.children) {
    //         const foundLabel = findLabelByValue(value, option.children);
    //         if (foundLabel) return foundLabel;
    //       }
    //     }
    //     return null;
    //   };

      const getValueFromSplit = (value, index) => {
        const parts = value.split(' / ');
            if(parts.length === 1) {
                return parts[0];
            }
            if (index <= parts.length) {
                return parts[index];
            }
        return null; 
    };

    const handleFindEditPath = findPath(valueInput);

      useEffect(() => {
        if(Boolean(handleFindEditPath) && optionsChildren.length > 0) {
            handleGetSecondChildren(getValueFromSplit(handleFindEditPath, 1));
        } else {
            setselectedSecondChildren('');
        }
      },[handleFindEditPath, optionsChildren.length]);

      useEffect(() => {
        if(Boolean(handleFindEditPath)) {
            handleGetFirstChildren(getValueFromSplit(handleFindEditPath, 0));
        } else {
            setselectedFirstChildren('');
        }
      },[handleFindEditPath]);


    return (
        <>  
            {isSearching ? 
            <div className='d-flex'>
                <Create.ContainerWrapperList width={'100%'} isNotOverFlow={false} isBorderNone={true}>
                    <ul>
                        {options.map((list, idx) => (
                            <Create.ListItemCascader 
                                key={idx} 
                                isBackGroundColor={selectedValue === list.name}
                            >
                                <Create.TextList 
                                    onClick={() => handleClick(list.name)}
                                    isFontBold={selectedValue === list.name}
                                >
                                    {list.name}
                                </Create.TextList>
                            </Create.ListItemCascader>
                        ))}
                    </ul>
                </Create.ContainerWrapperList>
            </div>
            :
            <div className='d-flex'>
            <Create.ContainerWrapperList isNotOverFlow={false} isBorderNone={false}>
                <ul>
                    {options.map((list, idx) => (
                        <Create.ListItemCascader 
                            key={idx} 
                            isBackGroundColor={isValueInChildren(list.children, selectedValue) || selectedFirstChildren === list.name}
                        >
                            <Create.TextList
                                 onClick={() => {
                                    if (list.children?.length === 0) {
                                        handleClick(list.name);
                                        setSelectedValue(findPath(list.name));
                                    } else {
                                        handleGetFirstChildren(list.name);
                                    }
                                }}
                                isFontBold={isValueInChildren(list.children, selectedValue) ||selectedFirstChildren === list.name}
                            >
                                {list.name}

                                {list.children?.length !== 0 && (
                                    <Icon name='forward-ios'/>
                                )}
                            </Create.TextList>
                        </Create.ListItemCascader>
                    ))}
                </ul>
            </Create.ContainerWrapperList>

            {optionsChildren.length > 0 && (
                <Create.ContainerWrapperList isNotOverFlow={false} isBorderNone={false}>
                    <ul>
                        {optionsChildren.map((list, idx) => (
                            <Create.ListItemCascader 
                            key={idx} 
                            isBackGroundColor={isValueInChildren(list.children, selectedValue) || selectedSecondChildren === list.name}
                            >
                                <Create.TextList
                                    onClick={() => {
                                        if (list.children?.length === 0) {
                                            handleClick(list.name);
                                            setSelectedValue(findPath(list.name));
                                            setOptionsSecondChildren([]);
                                        } else {
                                            handleGetSecondChildren(list.name);
                                        }
                                    }}
                                    isFontBold={isValueInChildren(list.children, selectedValue) || selectedSecondChildren === list.name}
                                >
                                    {list.name}

                                    {list.children?.length !== 0 && (
                                        <Icon name='forward-ios'/>
                                    )}
                                </Create.TextList>
                            </Create.ListItemCascader>
                        ))}
                    </ul>
                </Create.ContainerWrapperList>
            )}

            {optionsSecondChildren.length > 0 && (
                <Create.ContainerWrapperList isNotOverFlow={false} isBorderNone={true}>
                    <ul>
                        {optionsSecondChildren.map((list, idx) => (
                            <Create.ListItemCascader 
                                key={idx} 
                                isBackGroundColor={getValueFromSplit(handleFindEditPath ?? selectedValue, 2) === list.name}
                            >
                                <Create.TextList 
                                    onClick={() => {
                                        handleClick(list.name);
                                        setSelectedValue(findPath(list.name));
                                    }}
                                    isFontBold={getValueFromSplit(handleFindEditPath ?? selectedValue, 2) === list.name}
                                >
                                    {list.name}
                                </Create.TextList>
                            </Create.ListItemCascader>
                        ))}
                    </ul>
                </Create.ContainerWrapperList>
            )}
            </div>
            }
        </>
    );
};

export default DropdownPopup;