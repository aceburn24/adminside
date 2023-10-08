import React, { useState } from 'react';
import { Modal, Form, DropdownButton, Dropdown, Button} from 'react-bootstrap';
import axios from 'axios';
import ShoeForm from './ShoeForm';
import AccessoryForm from './AccessoryForm';

const ProductFormModal = ({ show, handleClose }) => {
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
    setVariantImages(acceptedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = 'http://localhost:8000/api';
    const url = `${baseUrl}/${productType === 'shoe' ? 'shoes' : 'accessories'}`;
    
    const submitForm = async (url, form) => {
      try {
        return await axios.post(url, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('There was a problem submitting your form!', error);
        return null;
      }
    };
    
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });
    
    form.append('image', mainImage);
    
    const response = await submitForm(url, form);
    
    if (response && productType === 'shoe' && variantImages.length > 0) {
      const shoeId = response.data.id;
      const variantUrl = `${baseUrl}/product_variants`;
      
      for (const image of variantImages) {
        const variantForm = new FormData();
        variantForm.append('shoe_id', shoeId);
        variantForm.append('image', image);
        
        await submitForm(variantUrl, variantForm);
      }
    }
    
    if (response) {
      handleClose();
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
  );
};

export default ProductFormModal;
