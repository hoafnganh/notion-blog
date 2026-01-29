import Image from "next/image";

export default function HeroSection(){
    return (
      <section class="relative mb-6 h-80 flex justify-center items-center w-full">
        <div
          class="absolute w-full h-full overflow-hidden"
          style={{ opacity: 0.5 }}
        >
          <Image
            src="/DSCF3643.JPG"
            className="rounded-lg"
            quality={100}
            fill
            sizes="200vw"
            alt="hero-image"
            style={{
              objectFit: "cover",
            }} 
            priority
          />
        </div>
        <div class="z-10 text-center px-8 drop-shadow-lg shadow-black">
          <div class="uppercase text-sm mb-4">Welcome to</div>
          <div class="text-4xl font-mplus font-medium">
            HoafngAnh&apos;s
            <span className="text-yellow-500"> Blog</span>
          </div>
        </div>
      </section>
    );
}