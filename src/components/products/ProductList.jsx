import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Container, Row, Col, Button, FormControl, Dropdown, Spinner } from 'react-bootstrap';

function ProductList() {
  const [products, setProducts] = useState({
    shoes: [],
    accessories: [],
  });
  const [isLoading, setIsLoading] = useState(true);  // New
  const [isError, setIsError] = useState(false);  // New
  const [displayType, setDisplayType] = useState('both');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    setIsLoading(true);  // New
    setIsError(false);  // New
    // Fetch shoes and their variants
    axios.get('http://localhost:8000/api/shoes')
      .then(response => {
        const fetchedShoes = response.data.map(shoe => ({
          ...shoe,
          variants: [],  // Initialize variants array for each shoe
        }));
  
        // Fetch variants for each shoe
        fetchedShoes.forEach((shoe, index) => {
          axios.get(`http://localhost:8000/api/shoes/${shoe.id}/variants`)
            .then(response => {
              fetchedShoes[index].variants = response.data;
              setProducts(prevState => ({
                ...prevState,
                shoes: [...fetchedShoes],
              }));
            })
            .catch(error => console.error('Error fetching shoe variants:', error));
        });
      })
      .catch(error => {
        console.error('Error fetching shoes:', error);
      });
  
    // Fetch accessories data (existing code)
    axios.get('http://localhost:8000/api/accessories')
      .then(response => {
        setProducts(prevState => ({
          ...prevState,
          accessories: response.data,
        }));
      })
      .catch(error => {
        console.error('Error fetching accessories:', error);
      });
      setIsLoading(false);
  }, []);

  const filteredShoes = products.shoes.filter(
    product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessories = products.accessories.filter(
    product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
return (
    <Container fluid>
              {isLoading ? (
        <Spinner animation="border" />
      ) : isError ? (
        <p>Error loading products.</p>
      ) : (
        <>
      <Row className="justify-content-between align-items-center">
        <Col md={4}>
          <h1>Product List</h1>
        </Col>
        <Col md={4}>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4} className="text-right">
          <Button variant="info" className="m-2">Add Product</Button>
        </Col>
      </Row>

      <Row className="justify-content-between align-items-center mt-2">
        <Col md={4}>
          <Dropdown onSelect={(e) => setDisplayType(e)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filter Products
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="both">Show Both</Dropdown.Item>
              <Dropdown.Item eventKey="shoes">Show Shoes Only</Dropdown.Item>
              <Dropdown.Item eventKey="accessories">Show Accessories Only</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
            <Row className="mt-4"> {/* Added top margin */}
        {displayType === 'both' ? (
            <>
            <h2>All Products</h2>
            {/* Display combined list of filtered shoes and accessories */}
            {[...filteredShoes, ...filteredAccessories].map((product, index) => (
                <Col md={4} className="mb-4" key={index}>
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    productType={product.hasOwnProperty('type') ? 'shoe' : 'accessory'} 
                />
                </Col>
            ))}
            </>
        ) : null}

        {displayType === 'shoes' ? (
            <>
            <h2>Shoes</h2>
            {/* Display filtered shoes data */}
            {filteredShoes.map(shoe => (
            <Col md={4} className="mb-4"> {/* Added "mb-4" for bottom margin */}
                <ProductCard 
                  key={shoe.id}
                  product={shoe}
                  productType="shoe"
                  isLoading={isLoading}
                  isError={isError}
                />                
            </Col>
            ))}
            </>
        ) : null}

        {displayType === 'accessories' ? (
            <>
            <h2>Accessories</h2>
            {/* Display filtered accessories data */}
            {filteredAccessories.map(accessory => (
                <Col md={4} className="mb-4">
                <ProductCard key={accessory.id} product={accessory} productType="accessory" />
                </Col>
            ))}
            </>
        ) : null}
        </Row>
        </>
      )}
    </Container>
);
}

export default ProductList;
