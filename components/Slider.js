import React, { useState, useEffect } from "react";
import Image from "next/image";

const Slider = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/assets/slide1.jpg", "/assets/slide2.jpg", "/assets/slide3.jpg", "/assets/slide4.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="carousel w-full h-80 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item absolute w-full h-full ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } transition-opacity duration-1000`}
          >
            <img
              src={slide}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 flex justify-between items-center">
          <button
            className="btn btn-circle"
            onClick={() =>
              setCurrentSlide((prevSlide) =>
                prevSlide === 0 ? slides.length - 1 : prevSlide - 1
              )
            }
          >
            ❮
          </button>
          <button
            className="btn btn-circle"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
            }
          >
            ❯
          </button>
        </div>
      </div>
    </>
  );
};

export default Slider;
