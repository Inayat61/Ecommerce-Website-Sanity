import React, { useState } from "react";
import { client, urlFor } from "../../lib/client";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ productData, productShow }) => {
  const { image, name, details, price } = productShow;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd } = useStateContext();
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
          </div>
          {/* Issue here */}
          <div className="small-images-container">
            {image?.map((item, i) => {
              <img
                src={urlFor(item && item[i])}
                // className={
                //   i === index ? "small-image selected-image" : "small-image"
                // }
                // onMouseEnter={() => setIndex(i)}
              />;
            })}
          </div>
          <div className="product-detail-desc">
            <h1>{name}</h1>
            <div className="reviews">
              <div>
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiOutlineStar />
              </div>
              <p>(20)</p>
            </div>
            <h4>Details:</h4>
            <p>{details}</p>
            <p className="price">${price}</p>
            <div className="quantity">
              <h3>Quantity:</h3>
              <p className="quantity-desc">
                <span className="minus" onClick={decQty}>
                  <AiOutlineMinus />
                </span>
                <span className="num">{qty}</span>
                <span className="plus" onClick={incQty}>
                  <AiOutlinePlus />
                </span>
              </p>
            </div>
            <div className="buttons">
              <button
                type="button"
                className="add-to-cart"
                onClick={() => onAdd(productShow, qty)}
              >
                Add to Cart
              </button>
              <button type="button" className="buy-now">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>May you like the products</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {productData.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export const getStaticPaths = async () => {
  const query = `*[_type =='product' ]{
        slug{
            current
        }
    } `;
  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};
export const getStaticProps = async ({ params: { slug } }) => {
  const product = `*[_type =='product' && slug.current=='${slug}'][0]`;
  const productShow = await client.fetch(product);
  const productQuery = '*[_type == "product"]';
  const productData = await client.fetch(productQuery);

  return {
    props: { productData, productShow },
  };
};

export default ProductDetails;
