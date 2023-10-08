import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Row, Col, Card, Tooltip, OverlayTrigger, Spinner, FormControl } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const ShoeForm = ({ formData, handleChange, handleMainImageChange, handleVariantImages }) => {
  const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop: handleVariantImages });
  const [variants, setVariants] = useState([{ color: '', size: '', stock: '' }]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const [validation, setValidation] = useState({
    name: true,
    price: true,
    stock: true,
  });

  const addVariant = useCallback(() => {
    setVariants(prevVariants => [...prevVariants, { color: '', size: '', stock: '' }]);
  }, []);  

  useEffect(() => {
    if (variants.length === 0) {
      addVariant();
    }
  }, [variants, addVariant]);

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is a required field.
    </Tooltip>
  );
  
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setMainImagePreview(reader.result);
    };
    
    if (file) {
      reader.readAsDataURL(file);
      handleMainImageChange(e);
    }
  };

  const validate = () => {
    const newValidation = {
      name: formData.name !== '',
      price: formData.price >= 1,
      stock: variants.every(variant => variant.stock >= 0),
    };
    
    setValidation(newValidation);
    
    return Object.values(newValidation).every(Boolean);
  };

  const handleSubmit = () => {
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMessage('Form submitted successfully!');
      }, 2000);
    }
  };
  
  return (
    <>
      {isLoading ? <Spinner animation="border" variant="primary" /> : null}
      {message && <div className="alert alert-success">{capitalizeFirstLetter(message)}</div>}
      <Form onSubmit={handleSubmit}>
      <Card className="mb-4" style={{ marginTop: '20px' }}>
          <Card.Header>Basic Information</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <OverlayTrigger placement="right" overlay={renderTooltip}>
                    <FormControl 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      isInvalid={!validation.name}
                      required
                    />
                  </OverlayTrigger>
                  <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    isInvalid={!validation.price}
                  />
                  <Form.Control.Feedback type="invalid">Price must be at least 1.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Control type="text" name="type" value={formData.type} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      
          <Card className="mb-4">
          <Card.Header>Additional Information</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
                    <option>Select Status</option>
                    <option>In Stock</option>
                    <option>Pre-order</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Unisex</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Main Image</Form.Label>
                  <OverlayTrigger placement="right" overlay={renderTooltip}>
                    <Form.Control type="file" name="mainImage" onChange={handleImagePreview} required />
                  </OverlayTrigger>
                  {mainImagePreview && <img src={mainImagePreview} alt="Main Preview" width="100" />}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
        <Card.Header>Product Variants</Card.Header>
        <Card.Body>
          {variants.map((variant, index) => (
            <Row key={index} className="align-items-center mb-3">
              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" name="color" value={variant.color} onChange={e => handleChange(e, index)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label>Size</Form.Label>
                  <Form.Control type="text" name="size" value={variant.size} onChange={e => handleChange(e, index)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="stock" 
                    value={variant.stock} 
                    onChange={e => handleChange(e, index)} 
                    isInvalid={!validation.stock}
                  />
                  <Form.Control.Feedback type="invalid">Stock cannot be negative.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center justify-content-end">
                  <Button 
                    variant="danger" 
                    onClick={() => removeVariant(index)}
                    style={{ marginTop: '30px' }}  // Adjust this value as needed
                  >Remove
                  </Button>
                </Col>
            </Row>
          ))}
          <Button variant="primary" className="mt-2" onClick={addVariant}>Add Variant</Button>
        </Card.Body>
      </Card>


        {/* Dropzone for variant images */}
        <Form.Group className="mb-4">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop the Variant Images here, or click to select files</p>
            <Button variant="outline-secondary">Upload Variant Images</Button>
          </div>
        </Form.Group>

        {/* Submit Button in ProductFormModal, as mentioned */}
      </Form>
    </>
  );
};

export default ShoeForm;

