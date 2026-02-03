import {
  AlignLeft,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Users2,
  UsersRound,
} from "lucide-react";
import { User2, CirclePlus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserApi, { type CommonUser, type FriendRequest } from "@/api/UserApi";
import { useEffect, useRef, useState } from "react";
import { DialogCreatePost } from "./post-create-modal";
import Avatar from "@/api_avatar";
import { toast } from "sonner";
import HelpModal from "./help-modal";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Feed",
    url: "/home",
    icon: AlignLeft,
  },
  {
    title: "Seu Perfil",
    url: "/profile",
    icon: User2,
  },
  {
    title: "Conversas",
    url: "/direct",
    icon: MessageSquare,
  },
  {
    title: "Comunidades",
    url: "/community",
    icon: UsersRound,
  },
  {
    title: "Minhas Comunidades",
    url: "/community/creation",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/me",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [me, setMe] = useState<CommonUser>();
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (requests.length > 0 && !notifiedRef.current) {
      requests.forEach((r) =>
        toast.info(
          `
          ${r.requester.username} enviou uma solicitação de amizade
        `,
          { description: "Há novos pedidos aguardando sua análise." },
        ),
      );
      notifiedRef.current = true;
    }
  }, [requests.length]);

  useEffect(() => {
    const getRequest = async () => {
      const request = await UserApi.getFriendRequest();
      setRequests(request.data?.filter((d) => d.status === "pending") ?? []);
    };

    getRequest();
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      const response = await UserApi.get();

      if (!response.success) return;

      const data = response.data as CommonUser;
      setMe(data);
    };

    fetchMe();
  }, []);

  const navigateToMe = () => {
    navigate("/me", { replace: true, state: { from: location } });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex justify-center items-center">
          <div
            className="p-4  w-full bg-sidebar-accent/40 py-2 mb-5  rounded-md flex gap-2 cursor-pointer items-center"
            onClick={navigateToMe}
          >
            <Avatar name={me?.username} image={me?.profile_image} />

            <div>
              <h1 className="text-[15px] font-semibold">
                {me?.username.split(" ")[0]} {me?.username.split(" ")[1]}{" "}
              </h1>
              <p className="text-[10px]">{me?.email}</p>
            </div>
          </div>
          <SidebarSeparator></SidebarSeparator>

          <SidebarGroupContent className="py-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton className="relative" asChild>
                  <Link to={"/friends"}>
                    <Users2 />
                    {requests.length > 0 && (
                      <div className="absolute -top-0 h-2 w-2 bg-red-500 rounded-full"></div>
                    )}

                    <span>Amigos/Pedidos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarSeparator></SidebarSeparator>
              <SidebarMenu>
                <SidebarGroupLabel>Ações</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className=" cursor-pointer w-full flex justify-center items-center gap-2">
                      <DialogCreatePost onClose={() => {}} isUpdated={false}>
                        <h1 className="w-full flex gap-2 items-center h-full">
                          {" "}
                          <CirclePlus /> Criar
                        </h1>
                      </DialogCreatePost>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute w-full p-5 left-0 bottom-0">
          <div className=" max-w-[50%] gap-3 flex">
            <HelpModal />
            <Button
              className=""
              onClick={() => {
                cookieStore.delete("cookie_token");
                navigate("/login");
              }}
              variant={"secondary"}
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
