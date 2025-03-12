/* eslint-disable no-unused-vars */
import Trigger from 'rc-trigger';
import React,{ useState } from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import styles from '@/assets/css/cascader.module.css';
import jsonData from './dataOptions.json';
import DropdownPopup from './dropdownpopup';
import { FormDataSingleSku } from '@/utils/type/masterSku';
import { checkSapace, clearEmojiInput } from '@/utils/formater';
import { Icon } from '@/components';

interface CascaderInputProps {
  dataForm: FormDataSingleSku;
  setValue: (data: string | FormDataSingleSku) => void;
  edit?: boolean;
}

type Category = {
  id: string;
  name: string;
  parentId: string;
  status: string;
  children: Category[];
};

type  ManipulateArrayOptions = {
  name: string;
};

function CascaderCustomInput ({setValue,dataForm,edit}: CascaderInputProps) {
    const [visibleDropdown,setVisibleDropdown]= useState<boolean>(false);
    const [manipulateArrayOptions,setManipulateArrayOptions]= useState<ManipulateArrayOptions[]>([]);
    const [errorForm, setErrorForm] = useState<'CATEGORY_SKU'>(
      null
    );

      const findPath = (targetName:string) => {
        const queue = jsonData.map(category => ({ ...category, path: category.name }));
        
        while (queue.length > 0) {
            const current = queue.shift();
    
            if (current.name === targetName) {
                return current.path;
            }
    
            if (current.children) {
                for (const  child of current.children) {
                    queue.push({
                        ...child,
                        path: current.path + ' / ' + child.name
                    });
                }
            }
        }
          return targetName;
      };

      const searchAndBuildPaths = (searchTerm: string): ManipulateArrayOptions[] => {
        const results: ManipulateArrayOptions[] = [];
        const searchTermLower = searchTerm.toLowerCase();
    
        const traverse = (node: Category, path: string, parentHasSearchTerm: boolean): void => {
            const newPath = path ? `${path} / ${node.name}` : node.name;
            const currentNodeHasSearchTerm = node.name.toLowerCase().includes(searchTermLower);
            const shouldIncludePath = parentHasSearchTerm || currentNodeHasSearchTerm;
    
            if (shouldIncludePath && node.children.length === 0) {
                results.push({ name: newPath });
            }
    
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    traverse(child, newPath, shouldIncludePath);
                }
            }
        };
    
        for (const category of jsonData) {
            traverse(category, '', false);
        }
    
        return results;
    };

      const handleVisibleChange = (visible: boolean) => {
        setVisibleDropdown(visible);
      };

      const handleTypingInput = (value:string) => {
        if (!value) {
          setErrorForm('CATEGORY_SKU');
          setManipulateArrayOptions([]);
          setValue({ ...dataForm, categorySku: value });
        } else  {
          setErrorForm(null);
          setValue({ ...dataForm, categorySku: findPath(value) });
          setManipulateArrayOptions(searchAndBuildPaths(value));
        }
      };

      const handleSelectedValue = (value:string) => {
        setValue({ ...dataForm, categorySku: findPath(value) });
        setManipulateArrayOptions([]);
        setErrorForm(null);
        setVisibleDropdown(false);
        setVisibleDropdown(false);
      };

      const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
       
        const sanitizedValue = checkSapace(value);
        handleTypingInput(checkSapace(sanitizedValue));
      };


    return(
        <Trigger
        action={['click']}
        popup={
          <DropdownPopup 
            options={manipulateArrayOptions?.length > 0 ? manipulateArrayOptions : jsonData} 
            setValue={handleSelectedValue} 
            isSearching={manipulateArrayOptions?.length > 0 ? true : false} 
            valueInput={dataForm.categorySku} 
            findPath={findPath}
            />
        }
        popupAlign={{
          points: ['tl', 'bl'],
          offset: [0, 5],
        }}
        popupStyle={{
            display: visibleDropdown ? '' : 'none'
        }}
        popupClassName={styles.popupstyle}
        onPopupVisibleChange={handleVisibleChange}
      >
         <FormGroup className={'mb-4'}>
            <Label className={styles.labelstyle}>
            {'Kategori'}
            <span className={styles.required}>*</span>
            </Label>

            <div className={'form-control-wrap'}>
                <div className={'form-icon form-icon-right'}>
                  {!visibleDropdown ?
                    <Icon name='downward-ios' className={styles.stickylabeliconstyle}/>
                  :
                    <Icon name='upword-ios' className={styles.stickylabeliconstyle}/>
                  }
                </div>
            </div>
            <Input 
                id="cascader-input"
                value={edit ? findPath(dataForm.categorySku) : dataForm.categorySku}
                onChange={(e) => handleInput(e)}
                invalid ={errorForm === 'CATEGORY_SKU'}
                maxLength={100}
                placeholder='Masukkan Kategori SKU'
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
            />
            <FormFeedback>
              <span className="text-danger position-absolute mb-4" style={{fontSize: 12}}>
                {'Harap mengisi Kategori'}
              </span>
            </FormFeedback>
        </FormGroup>
      </Trigger>
    );
}

export default React.memo(CascaderCustomInput);