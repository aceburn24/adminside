import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const AccessoryForm = ({ formData, handleChange, handleMainImageChange, handleVariantImages }) => {
  const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop: handleVariantImages });
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This is a required field.
    </Tooltip>
  );

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [validation, setValidation] = useState({
    name: true,
    price: true,
    stock: true,
  });

  const validate = () => {
    const newValidation = {
      name: formData.name !== '',
      price: formData.price >= 1,
      stock: formData.stock >= 0,
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
                    <Form.Control 
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
                  <Form.Control 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                  />
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
                  <Form.Label>Category</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                  />
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
                  <Form.Label>Brand Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="brand_name" 
                    value={formData.brand_name} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    isInvalid={!validation.stock}
                  />
                  <Form.Control.Feedback type="invalid">Stock cannot be negative.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Main Image</Form.Label>
                  <OverlayTrigger placement="right" overlay={renderTooltip}>
                    <div>
                      <input 
                        type="file"
                        id="fileInput"
                        name="mainImage"
                        onChange={handleImagePreview}
                        style={{ display: 'none' }}
                        required
                      />
                      <label htmlFor="fileInput" className="btn btn-outline-secondary">
                        Choose File
                      </label>
                      <span id="fileLabel">
                        {formData.mainImage ? formData.mainImage.name : 'No file'}
                      </span>
                    </div>
                  </OverlayTrigger>
                  {mainImagePreview && <img src={mainImagePreview} alt="Main Preview" width="100" />}
                </Form.Group>
              </Col>

            </Row>
          </Card.Body>
        </Card>

        <Form.Group className="mb-4">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop additional images here, or click to select files</p>
            <Button variant="outline-secondary">Upload Additional Images</Button>
          </div>
        </Form.Group>
      </Form>
    </>
  );
};

export default AccessoryForm;
