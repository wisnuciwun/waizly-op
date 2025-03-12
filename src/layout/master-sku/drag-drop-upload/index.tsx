/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useCallback, useState } from 'react';
import Create, { styles } from '../create-sku/styles';
import Image from 'next/image';
import ilustrationAddImage from '@/assets/images/illustration/ilustration-add-image.svg';
import {useDropzone} from 'react-dropzone';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ErrorForm, ImagesUploadState } from '@/utils/type/masterSku';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
interface DragAndDropUploadCardProps {
  id: number;
  numberCard: number;
  setIndexImages: (data:  number | null) => void;
  setDataImagesUpload: (data:  ImagesUploadState[] | any) => void;
  removeAndShiftImages: (data:  number | null) => void;
  setModalError:(data:  boolean | null) => void;
  indexImages: number | null;
  imageUploaded: ImagesUploadState;
  setErrorForm: (data:ErrorForm | any) => void;
  errorForm: ErrorForm
}

export default function DragAndDropUploadCard({
    id,
    numberCard,
    setIndexImages,
    imageUploaded,
    indexImages,
    setDataImagesUpload,
    removeAndShiftImages,
    setModalError,
    setErrorForm,
    errorForm
} : DragAndDropUploadCardProps) {
  const fillValueImage = (imageUploaded?.imageBase64 !== null) ? true : false;

  const MAX_SIZE = 1048576;
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  const { attributes,listeners,setNodeRef,transform,transition } = useSortable({id});
  const [errorBorder,setErrorBorder] = useState<boolean>(false);

  const [hovered, setHovered] = useState<boolean>(false);


  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.size > MAX_SIZE || !ACCEPTED_TYPES.includes(file.type)) {
        setModalError(true);
        setErrorBorder(true);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setDataImagesUpload((prevDataImagesUpload: any) => {
            const newDataImagesUpload = [...prevDataImagesUpload];
            const targetIndex = indexImages !== null ? indexImages : newDataImagesUpload.findIndex(image => image.imageBase64 === null);
            if (targetIndex !== -1) {
              newDataImagesUpload[targetIndex] = {
                ...newDataImagesUpload[targetIndex],
                imageBase64: reader.result as string,
                fileType: file
              };
            } else {
              console.warn('No available slot to insert the image.');
            }
            return newDataImagesUpload;
          });
          setErrorForm((prev) =>  ({...prev, firstImageValue: false }));
          setErrorBorder(false);
        };
        reader.readAsDataURL(file);
      }
    }); 
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
      'image/png': ['.png']
    },
    noDrag: true,
    noClick: fillValueImage
  });

  const styleCustom = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
  <>
    <Create.WrapperImageContainer 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{...styleCustom,position:'relative'}} 
    >
      <Create.Browser {...getRootProps({
        onClick: () => {
            if (fillValueImage) {
              setIndexImages(numberCard);
            } else {
              setIndexImages(null);
            }
          },
        })}
        iserrorupload={errorBorder || errorForm.firstImageValue}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <input {...getInputProps({ 
          disabled: fillValueImage,
          type:'file',
          accept:'.jpg,.jpeg,.png'
          })}/>
        <Image
          style={{...styles.Image,opacity: hovered && fillValueImage  ? '0.2' : '1' ,}}
          src={imageUploaded?.imageBase64 ? imageUploaded?.imageBase64 : ilustrationAddImage}
          height={imageUploaded?.imageBase64 ? 153 : 50}
          width={imageUploaded?.imageBase64 ? 153 : 50}
          alt={'image-browser'}
        />

        {hovered && fillValueImage &&
        <Create.ContainerHoverRemoveAction onClick={() => removeAndShiftImages(numberCard)}>
          <IconTrashOutlined height={40} width={40}/> 
        </Create.ContainerHoverRemoveAction>
        }
      </Create.Browser>
    </Create.WrapperImageContainer>
  </>  
  );
} 