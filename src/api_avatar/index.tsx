

type AvatarProps = {
  name: string
  type?: "human" | "monkey"
  size?: number
}

export default function Avatar({ name, size = 100 }: AvatarProps) {




  const avatarUrl = `https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(name)}`


  return (
    <img
      src={avatarUrl}
      alt={`Avatar de ${name}`}
      width={size}
      height={size}
      className="rounded-full border-2 w-full h-full border-gray-300 "
    />
  )
}