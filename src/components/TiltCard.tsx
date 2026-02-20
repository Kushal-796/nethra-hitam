import { ReactNode, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode; className?: string };

export default function TiltCard({ children, className = "", ...rest }: Props) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
