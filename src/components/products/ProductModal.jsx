import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { Modal, Carousel, Badge, Button } from 'react-bootstrap';

const ProductModal = ({ show, handleClose, product, productType }) => {
  const [imageVariants, setImageVariants] = useState([]);

  useEffect(() => {
    if (show) {
      const url = productType === 'shoe'
        ? `http://localhost:8000/api/shoes/${product.id}/images`
        : `http://localhost:8000/api/accessories/${product.id}/images`;

      axios.get(url)
        .then(response => {
          setImageVariants(response.data);
        })
        .catch(error => {
          console.error('Error fetching image variants:', error);
        });
    }
  }, [show, product, productType]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Carousel>
    {imageVariants.map((image, index) => (
        <Carousel.Item key={index}>
            <img
                className="d-block w-100 modal-image"
                src={`http://localhost:8000/storage/${image.image_path.split('/').pop()}`}
                alt={`Variant ${index + 1}`}
            />
        </Carousel.Item>
    ))}
</Carousel>

        {/* Rest of the existing code remains unchanged */}
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> ₱{product.price}</p>
        <p><strong>Brand:</strong> {product.brand_name}</p>

        {productType === 'shoe' && (
          <>
            <p><strong>Type:</strong> {product.type}</p>
            <p><strong>Status:</strong> {product.status}</p>
            <p><strong>Gender:</strong> {product.gender}</p>
            <p><strong>Variants:</strong></p>
            {product.variants.map((variant, index) => (
              <div key={index}>
                Color: {variant.color}, Size: {variant.size}, Stock: {variant.stock}
                <Badge className={`stock-indicator ${variant.stock === 0 ? 'out-of-stock' : variant.stock <= 10 ? 'low-in-stock' : 'in-stock'}`}>
                  {variant.stock === 0 ? 'Out of Stock' : variant.stock <= 10 ? 'Low in Stock' : 'In Stock'}
                </Badge>
              </div>
            ))}
          </>
        )}
        {productType === 'accessory' && (
          <>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
