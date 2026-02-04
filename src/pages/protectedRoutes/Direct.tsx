import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import { useEffect, useState } from "react";
import { CardFriend } from "./Friends";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Direct() {
  const [friends, setFriends] = useState<CommonUser[]>([]);
  const [page] = useState<number>(1);
  const [fill, setFill] = useState<string>("");

  const filter =
    fill && fill !== ""
      ? friends.filter((f) =>
          f.username.toUpperCase().includes(fill.toUpperCase()),
        )
      : friends;

  useEffect(() => {
    const getFriends = async () => {
      const request = await UserApi.getFriends(page, 10);
      setFriends((prev) => {
        // por algum caralho eu precisei verificar se ele e mesmo um array
        const friendsL = Array.isArray(request.data) ? request.data : [];
        const fill = friendsL.filter(
          (np) => !prev.some((u) => u.id_user === np.id_user),
        );
        return [...prev, ...fill];
      });
    };

    getFriends();
  }, [page]);

  return (
    <Card className=" w-full h-[100%] rounded-none flex flex-col text-sidebar-foreground bg-black/45 gap-5">
      <CardHeader className="w-full">
        <Input
          className="w-full rounded-md border mb-5 p-2"
          placeholder="DIgite o nome do usuario."
          onChange={(e) => setFill(e.target.value)}
          type="text"
          name=""
          id=""
        />
      </CardHeader>

      <CardContent className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4">
        {filter.map((f) => (
          <CardFriend key={f.id_user} friend={f} />
        ))}
      </CardContent>
    </Card>
  );
}
