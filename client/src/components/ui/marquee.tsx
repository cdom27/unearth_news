interface MarqueeProps {
  items: {
    id: string;
    imageSrc: string;
    alt: string;
  }[];
}

const Marquee = ({ items }: MarqueeProps) => {
  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex animate-marquee w-max">
        {items.map((item) => (
          <div
            key={`first-${item.id}`}
            className="flex items-center justify-center h-16 max-w-32 mx-6"
          >
            <img
              src={item.imageSrc}
              alt={item.alt}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}

        {items.map((item) => (
          <div
            key={`second-${item.id}`}
            className="flex items-center justify-center h-16 max-w-32 mx-6"
          >
            <img
              src={item.imageSrc}
              alt={item.alt}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
