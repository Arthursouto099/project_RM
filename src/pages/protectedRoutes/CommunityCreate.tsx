import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import instanceV1 from "@/api/api@instance/ap-v1i";
import { toast } from "sonner";
import { CommunityModal, type Community } from "./Community";
import {
  Users,
  Sparkles,
  Info,
  BadgeCheck,
  MessageSquare,
  Loader2,
  ImageIcon,
  Save,
  PlusCircleIcon,
} from "lucide-react";

export default function CommunityCreatePage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [, setLoading] = useState<boolean>(false);

  const getCommunities = async () => {
    try {
      setLoading(true);
      const { data } = await instanceV1.get("/community/my/all", {
        withCredentials: true,
      });
      setCommunities(data.data);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommunities();
  }, []);

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage:
          "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlays */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      <div className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />

      <div className="relative z-10 flex flex-col p-10 h-screen max-w-full mx-auto">
        {/* HERO */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight md:max-w-[60%] text-foreground">
            Já imaginou criar sua própria{" "}
            <span className="text-accent drop-shadow-sm">comunidade</span>?
          </h1>

          <p className="text-base md:text-lg md:max-w-[50%] leading-relaxed text-muted-foreground">
            Experimente interações únicas em múltiplos chats e participe de
            conversas que realmente fazem a diferença.
          </p>

          <div className="pt-2">
            <DialogCommunity onSuccess={async () => await getCommunities()}>
              <Button
                variant="secondary"
                className="
                bg-accent/70 text-foreground
                shadow-sm
                hover:opacity-90
                transition
                text-xs
                flex items-center
              "
              >
                <PlusCircleIcon /> Criar comunidade
              </Button>
            </DialogCommunity>
          </div>
        </div>

        {/* LISTA DE COMUNIDADES */}
        <div className="mt-6 grid md:grid-cols-3 gap-4 overflow-auto no-scrollbar">
          {communities.map((c) => (
            <CommunityModal
              key={c.id_community}
              data={c}
              onSuccess={async () => {
                await getCommunities();
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type CommunityPayload = {
  id_community?: string;
  name: string;
  description: string;
  community_image?: string;
};

type DialogCommunityProps = {
  children: React.ReactNode;
  initial?: Partial<CommunityPayload>;
  onSuccess?: (data: CommunityPayload) => void;
  onClose?: () => void;
};

const DEFAULT_COMMUNITY: CommunityPayload = {
  name: "Grupo Desenv",
  description: "Comunidade focada nos programadores do PROJECTRM",
  community_image:
    "https://images.pexels.com/photos/5380603/pexels-photo-5380603.jpeg",
};

/**
 * Implemente sua chamada aqui.
 * - Retorne success:true quando der OK
 * - Retorne success:false quando falhar
 */
async function saveCommunityToApi(payload: CommunityPayload): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    if (payload.id_community) {
      await instanceV1.patch(`/community/${payload.id_community}`, payload, {
        withCredentials: true,
      });
      toast.success("Comunidade alterada com sucesso");
    } else {
      await instanceV1.post("/community/create", payload, {
        withCredentials: true,
      });
      toast.success("Comunidade criada com sucesso");
    }
  } catch {
    toast.error("Erro ao criar comunidade");
  }
  return { success: true, message: "Comunidade salva com sucesso." };
}

/** Overlay de loading */
function Loading({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 shadow-xl">
        <Loader2 className="h-5 w-5 animate-spin text-white" />
        <span className="text-sm text-white/90">Salvando...</span>
      </div>
    </div>
  );
}

export function DialogCommunity({
  children,
  initial,
  onSuccess,
  onClose,
}: DialogCommunityProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialState = useMemo<CommunityPayload>(() => {
    return {
      name: initial?.name ?? DEFAULT_COMMUNITY.name,
      description: initial?.description ?? DEFAULT_COMMUNITY.description,
      community_image:
        initial?.community_image ?? DEFAULT_COMMUNITY.community_image,
    };
  }, [initial]);

  const [name, setName] = useState(initialState.name);
  const [description, setDescription] = useState(initialState.description);
  const [communityImage, setCommunityImage] = useState(
    initialState.community_image,
  );

  // limites UI
  const nameMax = 80;
  const descMax = 240;

  const canSubmit =
    !loading && name.trim().length > 0 && description.trim().length > 0;

  const handleOpenChange = (v: boolean) => {
    setOpen(v);

    // reseta valores ao abrir (opcional)
    if (v) {
      setName(initialState.name);
      setDescription(initialState.description);
      setCommunityImage(initialState.community_image);
    } else {
      onClose?.();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const payload: CommunityPayload = {
      id_community: initial?.id_community ?? undefined,
      name: name.trim(),
      description: description.trim(),
      community_image: communityImage?.trim(),
    };

    try {
      setLoading(true);
      const res = await saveCommunityToApi(payload);
      if (!res.success) return;

      onSuccess?.(payload);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="
          sm:max-w-5xl w-full
          h-[88vh]
          rounded-2xl
          border border-sidebar-border
          bg-sidebar/70 backdrop-blur
          p-0 overflow-hidden
          shadow-xl
          text-foreground
        "
      >
        <Loading open={loading} />

        <DialogHeader className="px-6 py-4 text-foreground border-b border-sidebar-border bg-sidebar/60">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-lg md:text-xl font-semibold truncate flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-foreground " />
                Criar Comunidade
              </DialogTitle>

              <DialogDescription className="text-muted-foreground mt-1">
                Defina um nome claro, descreva o objetivo e escolha uma imagem.
                Você pode editar depois.
              </DialogDescription>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-sidebar-border bg-sidebar/50 px-2.5 py-1">
                  <Users className="h-3.5 w-3.5" />
                  Para times e grupos
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sidebar-border bg-sidebar/50 px-2.5 py-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Múltiplos chats
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sidebar-border bg-sidebar/50 px-2.5 py-1">
                  <Info className="h-3.5 w-3.5" />
                  Preencha em 1 minuto
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full border border-sidebar-border bg-sidebar/60 inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Preview
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full h-full px-6 py-6 overflow-hidden">
          {/* Form */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 no-scrollbar">
            <div className="rounded-2xl border border-sidebar-border bg-sidebar/50 shadow-sm p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome */}
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <label className="font-semibold text-sm">Nome</label>
                    <span
                      className={`text-xs ${
                        name.length > nameMax
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {name.length}/{nameMax}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={name}
                    maxLength={nameMax}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da comunidade"
                    className="
                      w-full
                      rounded-xl
                      border border-sidebar-border
                      bg-sidebar/40
                      px-3 py-2
                      text-sm
                      shadow-sm
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-sidebar-accent
                      transition
                    "
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <label className="font-semibold text-sm">Descrição</label>
                    <span
                      className={`text-xs ${
                        description.length > descMax
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {description.length}/{descMax}
                    </span>
                  </div>

                  <textarea
                    value={description}
                    maxLength={descMax}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o propósito da comunidade"
                    className="
                      w-full min-h-28
                      rounded-xl
                      border border-sidebar-border
                      bg-sidebar/40
                      px-3 py-2
                      text-sm
                      resize-none
                      shadow-sm
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-sidebar-accent
                      transition
                    "
                    required
                  />
                </div>

                {/* Imagem (URL) */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm">Imagem (URL)</label>
                  <input
                    type="url"
                    value={communityImage}
                    onChange={(e) => setCommunityImage(e.target.value)}
                    placeholder="https://..."
                    className="
                      w-full
                      rounded-xl
                      border border-sidebar-border
                      bg-sidebar/40
                      px-3 py-2
                      text-sm
                      shadow-sm
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-sidebar-accent
                      transition
                    "
                  />
                  <div className="text-xs text-muted-foreground">
                    Use uma URL pública (CDN/Storage).
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-xl bg-sidebar-accent shadow-sm hover:shadow hover:opacity-90 transition"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Salvar
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 no-scrollbar">
            <div className="rounded-2xl border border-sidebar-border bg-sidebar/50 shadow-sm p-5 md:p-6 flex flex-col gap-4">
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold">
                  Pré-visualização
                </h2>
                <p className="text-sm text-muted-foreground">
                  Como a comunidade aparecerá para os usuários.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold break-words leading-tight">
                  {name.trim().length ? name : "Nome da comunidade"}
                </h3>
                <p className="text-sm md:text-base text-sidebar-accent-foreground break-words whitespace-pre-line leading-relaxed">
                  {description.trim().length
                    ? description
                    : "Descrição da comunidade"}
                </p>
              </div>

              <div className="rounded-xl overflow-hidden border border-sidebar-border bg-black/5 shadow-sm">
                {communityImage?.trim().length ? (
                  <img
                    src={communityImage}
                    alt="community preview"
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // fallback visual se a URL quebrar
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-5 h-5" />
                    <span>Sem imagem</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Ajuste nome, descrição e URL antes de salvar.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-sidebar-border bg-sidebar/60">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl hover:bg-sidebar-accent/20 transition"
              onClick={onClose}
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
