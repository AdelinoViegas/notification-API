"use client";

import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

export default function Carousel({ url }: { url: string[]}){
  return(
    <Swiper
      className="h-full"
      modules={[Autoplay, EffectFade ]}
      spaceBetween={50}
      slidesPerView={1} 
      effect="slide"
      autoplay={{
        delay: 5000, 
        disableOnInteraction: false,
      }}
    >
      {url.map((name, index) => (
      <SwiperSlide key={index}>
        <Image
          width={500}
          height={500}
          className="size-full"
          src={name}
          alt={name}
        />
      </SwiperSlide>
    ))}
    </Swiper>
  )
} 