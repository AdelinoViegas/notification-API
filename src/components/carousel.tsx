"use client";

import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

export default function Carousel({ url }: { url: string[]}){
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
      {url.map((name, index) => (
      <SwiperSlide key={index}>
        <div>
          <Image
            width={500}
            height={500}
            className="w-full h-full"
            src={name}
            alt={name}
          />
        </div>
      </SwiperSlide>
    ))}
    </Swiper>
  )
} 

// "use client";

// import Image from "next/image";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";

// export default function Carousel({ url }: { url: string[] }) {
//   const [sliderRef] = useKeenSlider<HTMLDivElement>(
//     {
//       loop: true,
//       initial: 0,
//     },
//     [
//       (slider) => {
//         let timeout: ReturnType<typeof setTimeout>;
//         let mouseOver = false;

//         function clearNextTimeout() {
//           clearTimeout(timeout);
//         }

//         function nextTimeout() {
//           clearTimeout(timeout);
//           if (mouseOver) return;
//           timeout = setTimeout(() => {
//             slider.next();
//           }, 5000);
//         }

//         slider.on("created", () => {
//           slider.container.addEventListener("mouseover", () => {
//             mouseOver = true;
//             clearNextTimeout();
//           });
//           slider.container.addEventListener("mouseout", () => {
//             mouseOver = false;
//             nextTimeout();
//           });
//           nextTimeout();
//         });
//         slider.on("animationEnded", nextTimeout);
//         slider.on("updated", nextTimeout);
//       },
//     ]
//   );

//   if (!url || url.length === 0) return null;

//   return (
//     <div ref={sliderRef}>
//       {url.map((slideUrl, index) => (
//         <div 
//           key={slideUrl || index} 
//           className="keen-slider__slide relative"
//         >
//           <Image
//             src={slideUrl}
//             alt={`Slide de apresentação ${index + 1}`}
//             width={100}
//             height={100}
//             sizes="(max-width: 768px) 100vw, 60vw"
//             priority={index === 0}
//             className="object-cover object-center w-full h-full rounded-t-3xl lg:rounded-none lg:rounded-r-3xl"
//           />
//         </div>
//       ))}
//     </div>
//   );
// }