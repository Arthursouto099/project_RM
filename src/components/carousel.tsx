import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel";

interface CarouselImages {
  urls: string[];
}

export function CarouselImgs({ urls }: CarouselImages) {
  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {urls.map((media, index) => {
          const isVideo = /\.(mp4|webm|mov|mkv|avi)$/i.test(media);

          return (
            <CarouselItem
              key={index}
              className="
                flex items-center justify-center
                aspect-[4/5] sm:aspect-video
                bg-black/5
              "
            >
              <div className="w-full h-full p-2 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={media}
                    controls
                    preload="metadata"
                    className="w-full h-full rounded-lg object-contain bg-black"
                  />
                ) : (
                  <img
                    src={media}
                    alt={`media-${index}`}
                    loading="lazy"
                    className="w-full h-full rounded-lg object-contain bg-black/10"
                  />
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
