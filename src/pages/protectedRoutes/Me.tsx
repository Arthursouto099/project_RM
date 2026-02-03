import UserApi, { type CommonUser } from "@/api/UserApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/storage/supabaseClient";
import { ModeToggle } from "@/components/ToggleThemeButton";
import Avatar from "@/api_avatar";

export default function Me() {
  const [me, setMe] = useState<CommonUser>();
  const [loading, setLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<number>(0);
  const [field, setFields] = useState<"informacoes" | "configuracoes">(
    "informacoes",
  );

  useEffect(() => {
    const fetchMe = async () => {
      const response = await UserApi.get();

      if (!response.success) return;

      const data = response.data as CommonUser;
      setMe(data);
      setLoading(false);
    };

    fetchMe();
  }, [updated]);

  return (
    <section className="p-3  h-[95%] w-[100%] flex ">
      {loading ? <div></div> : null}
      <div className=" p-4  flex-1/2 ">
        <div className=" flex items-center gap-3">
          <Avatar
            image={me?.profile_image}
            key={me?.id_user}
            name={me?.username}
          />

          <div className="flex flex-col text-sidebar-foreground ">
            <p className="font-normal text-[14px] opacity-85">{me?.username}</p>
            <h1 className=" ">{me?.email}</h1>
          </div>
        </div>

        <div className="mt-10 text-sidebar-foreground  mb-[-4%]   ">
          <div className="flex gap-3">
            <h1
              className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "informacoes" ? "border-b-accent/40 border-2 pb-1" : ""} `}
              onClick={() => setFields("informacoes")}
            >
              Informações
            </h1>
            <h1
              className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "configuracoes" ? "border-b-accent/40 border-2 pb-1" : ""} `}
              onClick={() => setFields("configuracoes")}
            >
              configurações
            </h1>
          </div>
        </div>

        {field === "informacoes" && (
          <div className="mt-20 text-sidebar-foreground">
            {me ? (
              <UpdateForm
                onUpdated={() => {
                  setUpdated((prev) => prev + 1);
                }}
                cpf={me.cpf}
                email={me.email}
                username={me.username}
                password="**********"
                contact={me.contact}
                birth={me.birth}
                gender={me.gender}
                bio={me.bio}
                desc={me.desc}
                nickname={me.nickname}
              ></UpdateForm>
            ) : null}
          </div>
        )}

        {field === "configuracoes" && (
          <div className="mt-20 text-sidebar-foreground">
            <UserConfigs />
          </div>
        )}
      </div>

      {/* 
        <div className="flex-1/5 ">
              <div className=" p-3 w-[100%] h-[100%] ">
                      <div className="bg-accent-dark p-5 rounded-md text-background-light">
                        <div className="flex gap-3">
                            <Share2 width={100} height={90} className=""></Share2>
                            <div>
                              
                              <h2 className="text-sm font-semibold">Quantidade de publicações</h2>
                              <h1 className="text-7xl">2</h1>
                            </div>
                            
                            
                        </div>
                        
                      </div>
                </div>
        </div> */}
    </section>
  );
}

export function UserConfigs() {
  return (
    <div className=" grid grid-cols-2  text-sidebar-foreground gap-5 ">
      <div className="">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <h1>Mudar o Tema Principal</h1>
        </div>
      </div>
    </div>
  );
}

const genderOptions: string[] = [
  "Masculino",
  "Feminino",
  "Não Binário",
  "Agênero",
  "Gênero Fluido",
  "Transgênero",
  "Travesti",
  "Homem Trans",
  "Mulher Trans",
  "Pangênero",
  "Bigênero",
  "Outro",
  "Prefiro não dizer",
];

export interface CommonUserProps {
  username: string;
  email: string;
  password: string;
  cpf: string;
  birth?: Date | undefined;
  profile_image?: string | undefined;
  fk_address?: number | undefined;
  contact?: string | undefined;
  gender?:
    | "Masculino"
    | "Feminino"
    | "Não Binário"
    | "Agênero"
    | "Gênero Fluido"
    | "Transgênero"
    | "Travesti"
    | "Homem Trans"
    | "Mulher Trans"
    | "Pangênero"
    | "Bigênero"
    | "Outro"
    | "Prefiro não dizer"
    | undefined;
  emergency_contact?: string | undefined;
  bio?: string | undefined;
  desc?: string | undefined;
  nickname?: string | undefined;
  onUpdated: () => void;
}

export function UpdateForm(props: CommonUserProps) {
  const [$name, setName] = useState<string>(props.username);
  const [$email, setEmail] = useState<string>(props.email);
  // const [$password, setPassword] = useState<string>(props.password)
  const [$cpf, setCpf] = useState<string>(props.cpf);
  const [$nickname, setNickName] = useState<string>(props.nickname ?? "");
  const [$contact, setContact] = useState<string>(props.contact ?? "");
  const [$birth, setBirth] = useState<Date | null | string>(
    new Date(props.birth! ?? null),
  );
  // const [$emergency_contact, setEmergencyContact] = useState<string>(props.emergency_contact ?? "")
  const [$gender, setGender] = useState<
    | "Masculino"
    | "Feminino"
    | "Não Binário"
    | "Agênero"
    | "Gênero Fluido"
    | "Transgênero"
    | "Travesti"
    | "Homem Trans"
    | "Mulher Trans"
    | "Pangênero"
    | "Bigênero"
    | "Outro"
    | "Prefiro não dizer"
  >(props.gender ?? "Prefiro não dizer");
  const [file, setFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isFileUpdated, setFileUpdated] = useState<boolean>(false);

  // Guarda apenas os campos alterados
  const [currentValues, setCurrentValues] = useState<
    Array<{ key: string; value: string | Date }>
  >([]);
  const [$bio, setBio] = useState<string>(props.bio ?? "");
  const [$desc, setDesc] = useState<string>(props.desc ?? "");

  const updateValue = (key: string, value: string | Date) => {
    setCurrentValues((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      return [...filtered, { key, value }];
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const payload = {
    //   username: $name,
    //   email: $email,
    //   password: $password,
    //   cpf: $cpf,
    //   contact: $contact,
    //   birth: $birth,
    //   emergency_contact: $emergency_contact,
    //   gender: $gender,
    // }

    const obj = currentValues.reduce(
      (acc, item) => {
        acc[item.key] = item.value;
        return acc;
      },
      {} as Record<string, string | Date>,
    );

    if (isFileUpdated) {
      const fileExt = file!.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file!, { upsert: true });

      if (error) {
        if (error) {
          console.error("Erro no upload:", error.message);
          return;
        }
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
        console.log(imageUrl);
        console.log("Imagem disponível em:", publicUrlData.publicUrl);

        obj["profile_image"] = publicUrlData.publicUrl;
      }

      setFileUpdated(false);
    }

    const res = await UserApi.put(obj as Partial<CommonUser>);
    if (!res.success) {
      toast.error(res.message);

      return;
    }
    toast.success(res.message);
    props.onUpdated();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2  text-sidebar-foreground gap-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            Nome
          </label>
          <input
            type="text"
            value={$name}
            required
            onChange={(e) => {
              setName(e.target.value);
              updateValue("username", e.target.value);
            }}
            className="border-b w-full text-foreground/70  focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            Nick
          </label>
          <input
            type="text"
            value={$nickname}
            required
            onChange={(e) => {
              setNickName(e.target.value);
              updateValue("nickname", "@" + e.target.value);
            }}
            className="border-b w-full text-foreground/70  focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            Email
          </label>
          <input
            type="email"
            value={$email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              updateValue("email", e.target.value);
            }}
            className="border-b w-full text-foreground/70 focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            CPF
          </label>
          <input
            type="text"
            value={$cpf}
            required
            onChange={(e) => {
              setCpf(e.target.value);
              updateValue("cpf", e.target.value);
            }}
            className="border-b w-full text-foreground/70 focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>

        {/* Gênero */}
        <div>
          <label
            htmlFor="gender"
            className="block text-foreground/70 text-sm font-semibold  mb-1"
          >
            Gênero
          </label>
          <select
            name="gender"
            id="gender"
            value={$gender}
            required
            onChange={(e) => {
              setGender(e.target.value as typeof $gender);
              updateValue("gender", e.target.value);
            }}
            className="w-full border-b border-foreground/20 px-1 py-2 text-foreground/70 text-sm outline-none focus:border-accent-normal/40 focus:ring-0"
          >
            {genderOptions.map((s) => (
              <option key={s} value={s} className="text-black ">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Aniversário */}
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            Aniversário
          </label>
          <input
            type="date"
            value={
              $birth instanceof Date
                ? $birth.toLocaleDateString("en-CA") // yyyy-MM-dd sem efeito de UTC
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const date = value ? new Date(`${value}T00:00:00`) : null;

              setBirth(date);
              updateValue("birth", date!);
            }}
            className="border-b w-full p-1 text-foreground/70 border-foreground/20 focus:outline-none focus:border-accent-normal/40 focus:ring-0"
          />
        </div>

        {/* Contato */}
        <div>
          <label className="block text-sm font-semibold text-foreground/70  mb-1">
            Contato
          </label>
          <input
            type="text"
            value={$contact}
            onChange={(e) => {
              setContact(e.target.value);
              updateValue("contact", e.target.value);
            }}
            className="border-b w-full focus:outline-none focus:border-accent-normal/40 text-foreground/70 focus:ring-0 p-1 border-foreground/20"
          />
        </div>
        <div>
          <label
            text-foreground
            className="block text-sm font-semibold text-foreground/70  mb-1"
          >
            Bio
          </label>
          <input
            type="text"
            placeholder="Descrição sobre você..."
            value={$bio}
            onChange={(e) => {
              setBio(e.target.value);
              updateValue("bio", e.target.value);
            }}
            className="border-b w-full text-foreground/70  focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>
        <div>
          <label
            text-foreground
            className="block  text-sm font-semibold text-foreground/70  mb-1"
          >
            Imagem de perfil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              setFile(selectedFile || null);
              setFileUpdated(true);
            }}
            className="border-b w-full text-foreground/70  focus:outline-none focus:border-accent-normal/40 focus:ring-0 p-1 border-foreground/20"
          />
        </div>

        <div className="">
          <label className="block text-sm mb-1 font-semibold text-foreground/70  ">
            Descrição
          </label>
          <input
            placeholder="Descrição básica do seu trabalho."
            value={$desc}
            onChange={(e) => {
              setDesc(e.target.value);
              updateValue("desc", e.target.value);
            }}
            className="border-b w-full text-foreground/70 p-1  grid focus:outline-none focus:border-accent-normal/40 focus:ring-0  border-foreground/20"
          />
        </div>

        {/* Botão */}
        <div className="flex col-span-2 gap-2">
          <button
            className="p-2 bg-accent/60 w-full  rounded-md text-white cursor-pointer"
            type="submit"
          >
            Atualizar Dados
          </button>
        </div>
      </div>
    </form>
  );
}
