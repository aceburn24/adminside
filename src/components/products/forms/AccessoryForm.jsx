import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const AccessoryForm = ({ formData, handleChange, handleMainImageChange, handleVariantImages }) => {
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  // Remove a main image preview
  const removeMainImagePreview = () => {
    setMainImagePreview(null);
  };

  // Remove an additional image preview
  const removeAdditionalImagePreview = (indexToRemove) => {
    setAdditionalImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const [validation] = useState({
    name: true,
    price: true,
    stock: true,
  });

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

  const { getRootProps, getInputProps } = useDropzone({ 
    accept: 'image/*', 
    onDrop: acceptedFiles => {
      handleVariantImages(acceptedFiles);
      setAdditionalImagePreviews(prev => [...prev, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
    }
  });

  useEffect(() => {
    return () => {
      additionalImagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [additionalImagePreviews]);;

  return (
    <>
      <Form>
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
                  <FormControl 
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
                  <FormControl 
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
                  <FormControl 
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
                            {mainImagePreview && 
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={mainImagePreview} alt="Main Preview" width="100" style={{ margin: '10px' }} />
                                    <Button variant="danger" size="sm" style={{ position: 'absolute', right: 0, top: 0 }} onClick={removeMainImagePreview}>X</Button>
                                </div>
                            }
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

        {/* Additional Images Dropzone */}
        <Form.Group className="mb-4">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop additional images here, or click to select files</p>
                <Button variant="outline-secondary">Upload Additional Images</Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '16px' }}>
                {additionalImagePreviews.map((src, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                            src={src} 
                            alt={`Preview ${index}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '8px' }}
                        />
                        <Button variant="danger" size="sm" style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => removeAdditionalImagePreview(index)}>X</Button>
                    </div>
                ))}
            </div>
        </Form.Group>
      </Form>
    </>
);

};

export default AccessoryForm;
