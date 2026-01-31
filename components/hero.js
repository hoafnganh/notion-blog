import Image from "next/image";

export default function HeroSection(){
    return (
      <section className="relative mb-6 h-80 flex justify-center items-center w-full">
      <div
        className="absolute w-full h-full overflow-hidden"
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
      <div className="z-10 text-center px-8 drop-shadow-lg shadow-black">
        <div className="uppercase text-sm mb-4 text-gray-800 dark:text-gray-200">Welcome to</div>
        <div className="text-4xl font-mplus font-medium">
        <span className="text-red-400 dark:text-blue-600">HoafngAnh&apos;s</span>
        <span className="text-orange-400 dark:text-blue-400"> Blog</span>
        </div>
      </div>
      </section>
    );
}