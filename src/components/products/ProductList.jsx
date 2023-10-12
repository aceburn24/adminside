import React, { useState, useEffect, useCallback } from 'react';  // Add useCallback import
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductFormModal from './forms/ProductFormModal';
import { Container, Row, Col, Button, FormControl, Dropdown, Spinner, Pagination } from 'react-bootstrap';

function ProductList() {
  const [products, setProducts] = useState({
    
    shoes: [],
    accessories: [],
  });
  const [isLoading, setIsLoading] = useState(true);  // New
  const [isError, setIsError] = useState(false);  // New
  const [errorMessage, setErrorMessage] = useState(""); // Added
  const [displayType, setDisplayType] = useState('both');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOptions, setSortOptions] = useState({ field: 'name', order: 'asc' });
  const [showForm, setShowForm] = useState(false);

    // Fetch data function using useCallback
    const fetchData = useCallback(() => {
        setIsLoading(true);
        setIsError(false);
    
        const { field, order } = sortOptions;
        
        // Fetch shoes and their variants
        axios.get(`http://localhost:8000/api/shoes?sortField=${field}&sortOrder=${order}`)
        .then(response => {
            setProducts(prevState => ({
              ...prevState,
              shoes: response.data,
            }));
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching shoes:', error);
            setIsError(true);
            setErrorMessage("Failed to fetch shoes. Please retry.");
            setIsLoading(false);
          });
        
        // Fetch accessories with sorting
        axios.get(`http://localhost:8000/api/accessories?sortField=${field}&sortOrder=${order}`)
        .then(response => {
            setProducts(prevState => ({
                ...prevState,
                accessories: response.data,
            }));
        })
        .catch(error => {
            console.error('Error fetching accessories:', error);
            setIsError(true);
            setErrorMessage("Failed to fetch accessories. Please retry.");
        });
      }, [sortOptions]);  // Add sortOptions as a dependency
    
      // UseEffect for fetching data
      useEffect(() => {
        fetchData();
      }, [fetchData]); 
  

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

    const indexOfLastShoe = currentPage * itemsPerPage;
    const indexOfFirstShoe = indexOfLastShoe - itemsPerPage;
    const currentShoes = filteredShoes.slice(indexOfFirstShoe, indexOfLastShoe);

    const indexOfLastAccessory = currentPage * itemsPerPage;
    const indexOfFirstAccessory = indexOfLastAccessory - itemsPerPage;
    const currentAccessories = filteredAccessories.slice(indexOfFirstAccessory, indexOfLastAccessory);



  
    return (
     <Container fluid>
      {isLoading ? (
        <Spinner animation="border" />
      ) : isError ? (
        <>
          <p>{errorMessage}</p> {/* Modified */}
          <Button onClick={fetchData}>Retry</Button>
        </>
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
                  <Button variant="primary" onClick={() => setShowForm(true)}>
                    Add New Product
                  </Button>
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
                <Col md={4}>
                    {/* Updated Dropdown for Sorting */}
                    <Dropdown onSelect={(e) => {
                    const [field, order] = e.split('-');
                    setSortOptions({ field, order });
                    }}>
                    <Dropdown.Toggle variant="warning" id="dropdown-sort">
                        Sort Products
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="name-asc">Name: A to Z</Dropdown.Item>
                        <Dropdown.Item eventKey="name-desc">Name: Z to A</Dropdown.Item>
                        <Dropdown.Item eventKey="price-asc">Price: Low to High</Dropdown.Item>
                        <Dropdown.Item eventKey="price-desc">Price: High to Low</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Col>
                </Row>

    
              <Row className="justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} />
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                {[...Array(Math.ceil(filteredShoes.length / itemsPerPage)).keys()].map(page => (
                    <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => setCurrentPage(page + 1)}>
                    {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredShoes.length / itemsPerPage)))} />
                <Pagination.Last onClick={() => setCurrentPage(Math.ceil(filteredShoes.length / itemsPerPage))} />
                </Pagination>

                <ProductFormModal
                  show={showForm}
                  handleClose={() => setShowForm(false)}
                />
                
              </Row>
    
              <Row className="mt-4">
                {displayType === 'both' ? (
                    <>
                    <h2>All Products</h2>
                    {/* Use currentShoes and currentAccessories instead of filteredShoes and filteredAccessories */}
                    {[...currentShoes, ...currentAccessories]
                        .sort((a, b) => sortOptions.order === 'asc' ? a[sortOptions.field] - b[sortOptions.field] : b[sortOptions.field] - a[sortOptions.field])
                        .map((product, index) => (
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
                    {currentShoes
                        .sort((a, b) => sortOptions.order === 'asc' ? a[sortOptions.field] - b[sortOptions.field] : b[sortOptions.field] - a[sortOptions.field])
                        .map(shoe => (
                        <Col md={4} className="mb-4">
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
                    {currentAccessories
                        .sort((a, b) => sortOptions.order === 'asc' ? a[sortOptions.field] - b[sortOptions.field] : b[sortOptions.field] - a[sortOptions.field])
                        .map(accessory => (
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
