import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const useImageUpload = (initialImages = []) => {
  const [images, setImages] = useState(initialImages);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles]);
      setImagePreviews(prev => [...prev, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
    }
  });

  useEffect(() => {
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

  return {
    images,
    imagePreviews,
    getRootProps,
    getInputProps,
    setImages,
    setImagePreviews
  };
};

export default useImageUpload;
