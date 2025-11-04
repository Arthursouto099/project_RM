


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
        <Carousel className="w-[100%] ">
            <CarouselContent className="">
                {urls.map((image) => (
                    <CarouselItem key={image}>
                        <img className="rounded-md" src={image} alt="" />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
