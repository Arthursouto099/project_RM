import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselImages {
  urls: string[]
}

export function CarouselImgs({ urls }: CarouselImages) {
  return (
    <Carousel className="w-[100%]">
      <CarouselContent>
        {urls.map((media, index) => {
          const isVideo = /\.(mp4|webm|mov|mkv|avi)$/i.test(media)

          return (
            <CarouselItem key={index} className="flex justify-center items-center">
              {isVideo ? (
                <video
                  src={media}
                  controls
                  className="rounded-md w-full  object-contain"
                />
              ) : (
                <img
                  src={media}
                  alt={`media-${index}`}
                  className="rounded-md w-full  object-contain"
                />
              )}
            </CarouselItem>
          )
        })}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}