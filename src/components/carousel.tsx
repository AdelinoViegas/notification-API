"use client";

import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

type ImageProps = {
  name: string,
  className?: string,
  alt?: string
}

type CarouselProps = {
  images: ImageProps[]
}

export default function Carousel({images}: CarouselProps){
    return(
       <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={50}
        slidesPerView={1} 
        effect="fade"
        autoplay={{
          delay: 5000, 
          disableOnInteraction: false,
        }}
      >
        {images.map((props, index) => (
        <SwiperSlide key={index}>
          <div className="h-screen grow w-full">
            <Image
              className={
                props.className ??
                'rounded-t-3xl lg:rounded-none lg:rounded-r-3xl w-full h-full'
              }
              fill
              src={props.name}
              alt={props.alt ?? 'Image'}
            />
          </div>
        </SwiperSlide>
      ))}
      </Swiper>
    )
} 