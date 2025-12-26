"use client";

import React from 'react';
import { Carousel } from 'react-bootstrap';

const CarouselComponent: React.FC = () => {
  return (
    <div className='carousel_container'>
      <Carousel className='carousel' interval={2000}>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event1.jpg"}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event2.jpg"}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event3.jpg"}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event4.jpg"}
            alt="Fourth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event5.jpg"}
            alt="Fifth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event10.jpg"}
            alt="Fifteenth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event12.jpg"}
            alt="Tenth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event13.jpg"}
            alt="Twelfth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event14.jpg"}
            alt="Thirteenth slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block"
            src={"/img/eventphotos/event15.jpg"}
            alt="Fourteenth slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
