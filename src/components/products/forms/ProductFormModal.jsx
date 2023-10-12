import React, { useState } from 'react';
import { Modal, Form, DropdownButton, Dropdown, Button} from 'react-bootstrap';
import axios from 'axios';
import ShoeForm from './ShoeForm';
import AccessoryForm from './AccessoryForm';

const ProductFormModal = ({ show, handleClose }) => {
  const [errorMessage, setErrorMessage] = useState(null); // Define this only once
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productType, setProductType] = useState('shoe');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: '',
    status: '',
    gender: '',
    brand_name: '',
    category: '',
    stock: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [variantImages, setVariantImages] = useState([]);
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '' }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleVariantImages = (acceptedFiles) => {
        setVariantImages(prev => [...prev, ...acceptedFiles]);
    };    

  const submitForm = async (url, form, isJson = false) => {
    try {
      const headers = isJson 
        ? { 'Content-Type': 'application/json' } 
        : { 'Content-Type': 'multipart/form-data' };
      
      const response = await axios.post(url, form, { headers });
      return response.data;
  
    } catch (error) {
      console.error('There was a problem submitting your form!', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);  // Displaying server error
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      return null;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Variants state at handleSubmit start:', variants);

    const baseUrl = 'http://localhost:8000/api';
    let url;

    // Step 1: Submit Main Product
    if (productType === 'shoe') {
      url = `${baseUrl}/shoes`;
    } else {
      url = `${baseUrl}/accessories`;
    }

    const mainForm = new FormData();
    Object.keys(formData).forEach(key => {
      mainForm.append(key, formData[key]);
    });
    if (mainImage) {
      mainForm.append('image', mainImage);
    }

    const response = await submitForm(url, mainForm);

    let productId;
    if (response && response.id) {
      productId = response.id;
    } else if (response && response.data && response.data.id) {
      productId = response.data.id;
    }
    
    if (!productId) {
      setErrorMessage('Failed to create main product. Cannot proceed.');
      return;
    }
    

    // Step 2: Submit Variants (Only for shoes)
    if (productType === 'shoe') {
      const shoeId = response.id;
      for (let i = 0; i < variants.length; i++) {
        const variantData = {
          shoe_id: shoeId,
          color: variants[i].color,
          size: variants[i].size,  
          stock: parseInt(variants[i].stock, 10)
        };

        console.log('Sending variant data:', variantData);
        const variantResponse = await submitForm(
          `${baseUrl}/variants`, 
          JSON.stringify(variantData),
          true  // Indicating that the content type is JSON
        );

        if (!variantResponse || !variantResponse.id) {
          setErrorMessage(`Failed to create variant ${i + 1}.`);
          return;
        }
      }
    }

    // Step 3: Submit Images (Polymorphic relationship)
    const imageableId = response.id;
    const imageableType = `App\\Models\\${productType.charAt(0).toUpperCase() + productType.slice(1)}`;
    
    console.log('Number of variant images to upload:', variantImages.length); // Check the number of images
    
    const imageForm = new FormData();
    imageForm.append('imageable_id', imageableId);
    imageForm.append('imageable_type', imageableType);
    variantImages.forEach(image => {
      imageForm.append('image_paths[]', image); // Append each image with the key 'image_paths[]'
    });
    
    const imageResponse = await submitForm(`${baseUrl}/images`, imageForm);
    console.log('Image Response:', imageResponse);
    
    if (!imageResponse || !imageResponse.images || imageResponse.images.length === 0) {
        setErrorMessage('Failed to upload variant images.');
        return;
    }
    
   
  
    
    

    // If all steps are successful
    handleClose();
    setShowSuccessModal(true);
  };

  
  
  

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render error message */}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          
          <DropdownButton id="dropdown-item-button" title="Select Product Type">
            <Dropdown.Item as="button" onClick={() => setProductType('shoe')}>Shoe</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => setProductType('accessory')}>Accessory</Dropdown.Item>
          </DropdownButton>
          <Form onSubmit={handleSubmit}>
            {productType === 'shoe' ? ( 
              
              <ShoeForm 
                formData={formData} 
                handleChange={handleChange} 
                handleMainImageChange={handleMainImageChange} 
                handleVariantImages={handleVariantImages}
                variants={variants}
                setVariants={setVariants}
                variantImages={variantImages}
                setVariantImages={setVariantImages}
              />
    
            ) : (
              <AccessoryForm 
                formData={formData} 
                handleChange={handleChange} 
                handleMainImageChange={handleMainImageChange} 
                handleVariantImages={handleVariantImages} 
              />
            )}
    
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product added successfully!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
};

export default ProductFormModal;
