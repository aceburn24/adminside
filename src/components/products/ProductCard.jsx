import React from 'react';
import { Card, Button, ButtonGroup, Badge, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaImages } from 'react-icons/fa';
import './ProductStyles.css';  // Import your CSS

function renderTooltip(props, message) {
  return <Tooltip {...props}>{message}</Tooltip>;
}

function ProductCard({ product, productType, isLoading, isError }) {
  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (isError) {
    return <p>Error loading product.</p>;
  }
  return (
    <Card className="product-card" style={{ width: '18rem', height: '100%', margin: '30px 15px 30px 15px' }}>
      <Card.Img variant="top" src={product.image ? product.image : 'placeholder.jpg'} alt={product.name} />
      {product.stock === 0 && <Badge className="stock-indicator out-of-stock">Out of Stock</Badge>}
      {product.stock > 0 && product.stock <= 20 && <Badge className="stock-indicator low-in-stock">Low in Stock</Badge>}
      {product.stock > 20 && <Badge className="stock-indicator in-stock">In Stock</Badge>}


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
        </ButtonGroup>
      </Card.Footer>
    </Card>
    
  );
}

export default ProductCard;
