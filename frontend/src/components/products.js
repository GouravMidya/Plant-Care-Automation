import React from 'react';
import './App.css';

function Products() {
  return (
    <div className="products-container">
      <div className="top-row">
        <div className="left1">
          <p className="bold">Tagline</p>
          <h1 className="bold">Products</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
        </div>
        <div className="right1">
          <button className="button">View All</button>
        </div>
      </div>
      <div className="bottom-row">
        <div className="column1">
          <img src="1.jpg" alt="Product 1" className="product-image" />
          <p className="product-name">Product 1</p>
          <p className="product-variant">Variant</p>
          <p className="product-price">$10</p>
        </div>
        <div className="column1">
          <img src="1.jpg" alt="Product 2" className="product-image" />
          <p className="product-name">Product 2</p>
          <p className="product-variant">Variant</p>
          <p className="product-price">$20</p>
        </div>
        <div className="column1">
          <img src="1.jpg" alt="Product 3" className="product-image" />
          <p className="product-name">Product 3</p>
          <p className="product-variant">Variant</p>
          <p className="product-price">$30</p>
        </div>
      </div>
    </div>
  );
}

export default Products;
