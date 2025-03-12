/* eslint-disable no-unused-vars */
import { memo } from 'react';
import TagsFilter from './styles';
import { Icon } from '@/components';
import colors from '@/utils/colors';
import { isEmpty } from 'lodash';

interface Props {
    data: any;
    onDelete: (index: number) => void;
    onReset: () => void;
}
const TagFilter = ({
    data,
    onDelete,
    onReset
}: Props) => {
    const lastFilter = data.filter((value) => value.filter?.length > 0 || value.filter !== null);
    const selectedFilter = data.filter((val) => !isEmpty(val.filter));
    const singleFilter = data.filter((value) => (value.type === 'Hubungan Master SKU' || value.type === 'Integrasi Pesanan') && (value.filter !== null && value?.filter !== undefined)  );
    return (
        <TagsFilter.Container>
            {data.map((value, index) => (
                <>
                    {value.filter?.length > 0 && (
                        <TagsFilter.Tag key={index}>
                            <TagsFilter.Title>
                                {`${value.filter.length}  ${value.type} Terpilih`}
                            </TagsFilter.Title>
                            <div onClick={() => {
                                if(lastFilter.length === 0) {
                                    onReset();
                                } else {
                                    onDelete(index);
                                }
                            }}>
                                <Icon  style={{cursor: 'pointer', color: colors.white}} name="cross"/>
                            </div>
                            
                        </TagsFilter.Tag>
                    )}

                    {(value.type === 'Hubungan Master SKU' || value.type === 'Integrasi Pesanan' ) &&  (value.filter?.length > 0 || value.filter !== null) ? (
                        <TagsFilter.Tag key={index}>
                            <TagsFilter.Title>
                                {`1 ${value.type} Terpilih`}
                            </TagsFilter.Title>
                            <div onClick={() => {
                                if(lastFilter.length === 0) {
                                    onReset();
                                } else {
                                    onDelete(index);
                                }
                            }}>
                                <Icon  style={{cursor: 'pointer', color: colors.white}} name="cross"/>
                            </div>
                            
                        </TagsFilter.Tag>
                    ): null}
                    
                </>
                
            ))}
            {console.log('cek lodash', selectedFilter , singleFilter )}
            {(selectedFilter.length + singleFilter.length ) > 1 && (
                <TagsFilter.TagSecondary onClick={onReset}>
                    <TagsFilter.TitleSecondary>{'Hapus Semua'}</TagsFilter.TitleSecondary>
                </TagsFilter.TagSecondary>
            )}
            
        </TagsFilter.Container>

    );
};

export default memo(TagFilter);