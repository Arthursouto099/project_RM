import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ArrowRight, CheckCheck, HelpingHand } from "lucide-react";
import { useEffect, useState } from "react";

export default function HelpModal() {
  const [count, setCount] = useState<number>(0);
  const [alterButton, setAlterButton] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="text-sm w-fit bg-accent/70 font-medium flex gap-2 items-center"
        >
          <HelpingHand />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 md:min-w-2xl">
        <div className="p-5 pb-0 flex  items-center gap-4">
          <DialogTitle className="text-white">
            <img width={30} src="\logo.png" alt="" />
          </DialogTitle>
          <DialogDescription className="mt-1 font-medium text-sm">
            Guia inicial
          </DialogDescription>
        </div>
        <div className="w-full min-h-[290px] bg-white">
          <CarrouselHelp
            onClose={() => {
              setAlterButton(true);
            }}
            count={count}
          />
        </div>
        <div className=" flex  -mt-2  items-center ">
          <div className="p-5 flex justify-between w-full items-center">
            {alterButton ? (
              <h1
                onClick={() => {
                  setCount(0);
                  setAlterButton(false);
                }}
                className="text-white/60 cursor-pointer"
              >
                Olhar Novamente
              </h1>
            ) : (
              <DialogClose asChild>
                <h1 className="text-white/60 cursor-pointer">Pular</h1>
              </DialogClose>
            )}

            {alterButton ? (
              <div>
                <DialogClose>
                  <h1
                    onClick={() => setCount((prev) => prev + 1)}
                    className=" flex items-center cursor-pointer justify-center gap-2 text-accent/90"
                  >
                    Finalizar <CheckCheck />
                  </h1>
                </DialogClose>
              </div>
            ) : (
              <h1
                onClick={() => setCount((prev) => prev + 1)}
                className=" flex items-center cursor-pointer justify-center gap-2 text-accent/90"
              >
                Proximo <ArrowRight />
              </h1>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CarrouselHelpProps {
  count: number;
  onClose: () => void;
}

export function CarrouselHelp({ count, onClose }: CarrouselHelpProps) {
  useEffect(() => {
    console.log(count);
    if (count > 5) {
      onClose();
    }
  }, [count, onClose]);

  return (
    <div className="w-full bg-accent h-full">
      {divs[count] != null ? (
        divs[count]
      ) : (
        <div
          className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
          style={{
            backgroundImage:
              "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

          {/* Gradiente para dar profundidade */}
          <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

          <div className="w-full h-full  flex justify-center items-center">
            <div className="w-[80%] flex gap-10 items-center z-20  h-[90%]  ">
              <div className="text-white ">
                <h1 className="font-medium ">Pronto você está preparado!</h1>
                <p className="text-xs text-foreground/70">
                  Continue sua jornada conosco!{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const divs = [
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img
            className="min-w-48 min-h-48"
            src="/por_algum_motivo_um_cerebro.png"
          />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">Bem-vindo ao RelaxMind</h1>
          <p className="text-xs text-foreground/70">
            Um espaço seguro para você!{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            Bem-vindo(a) ao RelaxMind é um espaço digital criado para cuidar da
            sua saúde mental de forma leve, acessível e segura. Aqui, você não
            está sozinho: a plataforma conecta pessoas que buscam apoio, escuta
            e bem-estar, tudo em um ambiente acolhedor e gratuito.
          </p>
        </div>
      </div>
    </div>
  </div>,
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img className="min-w-48 min-h-48" src="compatilhe.png" />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">
            Compartilhe e se expresse com liberdade
          </h1>
          <p className="text-xs text-foreground/70">
            Aqui, sua voz importa: encontre apoio na comunidade!{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            Você pode criar postagens para compartilhar sentimentos,
            experiências ou reflexões do dia a dia. Interagir com conteúdos de
            outras pessoas por meio de curtidas e comentários ajuda a fortalecer
            conexões e promove apoio mútuo dentro da comunidade.
          </p>
        </div>
      </div>
    </div>
  </div>,
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img className="min-w-48 min-h-48" src="/converse.png" />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">Converse com segurança</h1>
          <p className="text-xs text-foreground/70">
            Nos preocupamos com seu bem-estar!{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            O RelaxMind oferece chats privados e salas de conversa para que você
            possa dialogar com outras pessoas de forma segura e respeitosa.
            Esses espaços são pensados para incentivar conversas saudáveis e
            trocas positivas.
          </p>
        </div>
      </div>
    </div>
  </div>,
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img className="min-w-48 min-h-48" src="/construa_rede_apoio.png" />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">Construa sua rede de apoio</h1>
          <p className="text-xs text-foreground/70">
            Conecte-se com quem te entende!{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            Aqui, você pode adicionar amigos e criar conexões focadas em
            bem-estar emocional. Quanto mais ativa for sua participação, maior
            será a sensação de pertencimento e apoio dentro da plataforma.
          </p>
        </div>
      </div>
    </div>
  </div>,
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img className="min-w-48 min-h-48" src="\profissa.png" />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">
            Interaja com profissionais verificados
          </h1>
          <p className="text-xs text-foreground/70">
            Receba orientação com credibilidade!{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            Alguns perfis pertencem a profissionais da área da saúde mental.
            Esses usuários passam por um processo de verificação, garantindo
            mais confiança e segurança para quem busca orientação e apoio
            qualificado.
          </p>
        </div>
      </div>
    </div>
  </div>,
  <div
    className="
      relative w-full h-full overflow-hidden
      bg-accent/20 dark:bg-black
    "
    style={{
      backgroundImage:
        "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay escuro */}
    <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />

    {/* Gradiente para dar profundidade */}
    <div className="absolute inset-0 bg-gradient-to-b  from-black/60 via-black/30 to-transparent" />

    <div className="w-full h-full  flex justify-center items-center">
      <div className="w-[80%] flex gap-10 items-center md:overflow-hidden overflow-auto  z-20  h-[90%] md:flex-row flex-col ">
        <div className="md:w-[100%] w-[70%]    ">
          <img className="min-w-48 min-h-48" src="\rede_de_apoio.png" />
        </div>
        <div className="text-white ">
          <h1 className="font-medium ">Um espaço para todos</h1>
          <p className="text-xs text-foreground/70">
            Cada pessoa é única, e a experiência também{" "}
          </p>

          <p className="mt-5 text-xs leading-relaxed">
            O RelaxMind foi desenvolvido com foco em acessibilidade. A
            plataforma conta com recursos adaptados para diferentes
            necessidades, garantindo uma experiência confortável, inclusiva e
            segura para todos os usuários.
          </p>
        </div>
      </div>
    </div>
  </div>,
];
