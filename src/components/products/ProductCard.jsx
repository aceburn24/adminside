import React, { useState } from 'react';
import axios from 'axios';  // Import axios for API calls
import { Card, Button, ButtonGroup, Badge, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import './ProductStyles.css';
import ProductModal from './ProductModal';

function renderTooltip(props, message) {
  return <Tooltip {...props}>{message}</Tooltip>;
}

function ProductCard({ product, productType, isLoading, isError }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log("Button clicked");
    setShow(true);
  };

// Delete product function
const handleDelete = () => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    // Determine the API URL based on productType (shoe or accessory)
    const url = productType === 'shoe'
      ? `http://localhost:8000/api/shoes/${product.id}`
      : `http://localhost:8000/api/accessories/${product.id}`;

    axios.delete(url)
      .then(response => {
        console.log("Product deleted");
        // You may also want to update the UI here (e.g., remove the card or notify the user)
      })
      .catch(error => {
        console.error("Error deleting product:", error);
      });
  }
};

  // Edit product function (navigate to edit page)
  const handleEdit = () => {
    console.log("Navigate to edit page for product:", product.id);
    // Replace with your actual navigation logic (e.g., using React Router)
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
      <Card.Img variant="top" src={product.image ? `http://localhost:8000/storage/${product.image}` : 'placeholder.jpg'} alt={product.name} />
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
              <Button variant="primary" onClick={handleEdit}><FaEdit /></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={(props) => renderTooltip(props, 'Delete Product')}>
              <Button variant="danger" onClick={handleDelete}><FaTrashAlt /></Button>
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