import React, { useState } from 'react';  // Add useState import
import { Card, Button, ButtonGroup, Badge, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaImages, FaEye } from 'react-icons/fa';  // Add FaEye import
import './ProductStyles.css';  // Import your CSS
import ProductModal from './ProductModal';  // Adjust the path as necessary

function renderTooltip(props, message) {
  return <Tooltip {...props}>{message}</Tooltip>;
}

function ProductCard({ product, productType, isLoading, isError }) {
  const [show, setShow] = useState(false);  // New state for controlling the modal

  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log("Button clicked");  // Debug line
    setShow(true);
  };
  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (isError) {
    return <p>Error loading product.</p>;
  }

  return (
    <>
      <Card className="product-card" style={{ width: '18rem', height: '100%', margin: '30px 15px 30px 15px' }}>
        <Card.Img variant="top" src={product.image ? product.image : 'placeholder.jpg'} alt={product.name} />
        {product.stock === 0 && <Badge className="stock-indicator out-of-stock">Out of Stock</Badge>}
        {product.stock > 0 && product.stock <= 10 && <Badge className="stock-indicator low-in-stock">Low in Stock</Badge>}
        {product.stock > 10 && <Badge className="stock-indicator in-stock">In Stock</Badge>}

        <Card.Body style={{ position: 'relative' }}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text style={{ maxHeight: '50px', overflow: 'hidden' }}>
            {product.description.length > 50
              ? `${product.description.substring(0, 47)}...`
              : product.description}
          </Card.Text>
          <Card.Text>Price: ₱{product.price}</Card.Text>
          <Card.Text>Brand: {product.brand_name}</Card.Text>
          {productType === 'shoe' && (
            <>
              <Card.Text>Type: {product.type}</Card.Text>
              <Card.Text>Status: {product.status}</Card.Text>
              <Card.Text>Gender: {product.gender}</Card.Text>
              <div className="variants">
                <strong>Variants:</strong>
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    Color: {variant.color}, Size: {variant.size}, Stock: {variant.stock}
                  </div>
                ))}
              </div>
            </>
          )}
          {productType === 'accessory' && (
            <>
              <Card.Text>Category: {product.category}</Card.Text>
              <Card.Text>Stock: {product.stock}</Card.Text>
            </>
          )}
        </Card.Body>
        <Card.Footer style={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <ButtonGroup size="sm" className="d-flex justify-content-center">
            <OverlayTrigger placement="top" overlay={(props) => renderTooltip(props, 'Edit Product')}>
              <Button variant="primary"><FaEdit /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={(props) => renderTooltip(props, 'Delete Product')}>
              <Button variant="danger"><FaTrashAlt /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={(props) => renderTooltip(props, 'View Images')}>
              <Button variant="info"><FaImages /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={(props) => renderTooltip(props, 'Quick View')}>
              <Button variant="success" onClick={handleShow}><FaEye /></Button>
            </OverlayTrigger>
          </ButtonGroup>
        </Card.Footer>
      </Card>
      
      <ProductModal 
      show={show} 
      handleClose={handleClose} 
      product={product} 
      productType={productType}
    />


</>
);
}

export default ProductCard;