import { useState } from "react";

type AvatarProps = {
  name?: string;
  image?: string;
  className?: string;
};

export default function Avatar({
  name = "",
  image,
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const trimmedName = name.trim();
  const initial = trimmedName ? trimmedName[0] : "?";
  const second = trimmedName.length > 1 ? trimmedName[1] : "";

  const showFallback = !image || imageError;

  return (
    <div className={`h-11 w-11 ${className}`}>
      <div
        className={`rounded-full w-full h-full flex items-center justify-center bg-card overflow-hidden `}
        aria-label={name || "Avatar"}
      >
        {!showFallback ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full "
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-semibold text-foreground/40 uppercase select-none">
            {initial}
            {second}
          </span>
        )}
      </div>
    </div>
  );
}
