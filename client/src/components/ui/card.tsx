import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardThumbnailProps {
  src: string;
  alt: string;
}

interface CardHeadingProps {
  children: ReactNode;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
  as?: "p" | "div" | "ul";
}

interface CardFooterProps {
  children: ReactNode;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`flex flex-col gap-5 p-2 pb-8 rounded-3xl bg-bg-dark ${className}`}
    >
      {children}
    </div>
  );
};

const CardThumbnail = ({ src, alt }: CardThumbnailProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className="p-10 h-45 rounded-2xl object-contain bg-bg-light"
    />
  );
};

const CardHeading = ({ children }: CardHeadingProps) => {
  return (
    <h3 className="px-2 font-instrument text-3xl tracking-[.0125em] text-fg-light">
      {children}
    </h3>
  );
};

const CardBody = ({
  children,
  className = "",
  as: Component = "div",
}: CardBodyProps) => {
  return (
    <Component className={`px-2 text-fg-dark-tertiary ${className}`}>
      {children}
    </Component>
  );
};

const CardFooter = ({ children }: CardFooterProps) => {
  return <div className="px-2 pt-10 text-fg-light mt-auto">{children}</div>;
};

Card.Thumbnail = CardThumbnail;
Card.Heading = CardHeading;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
