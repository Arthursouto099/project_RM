import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import {
  MessageSquare,
  Users2Icon,
  Edit3,
  Briefcase,
  BadgeCheck,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Avatar from "@/api_avatar";
import useAuth from "@/hooks/useAuth";


export default function ProfileDashboard({ id_user }: { id_user: string }) {
  const [user, setUser] = useState<CommonUser | null>(null);
  const { payload } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const res = await UserApi.getUser(id_user);
      if (res?.data) setUser(res.data);
    };
    getUser();
  }, [id_user]);

  return (
    <div className="mx-auto w-full ">
      <Card className="flex flex-col gap-6 rounded-2xl border border-sidebar-border bg-sidebar/60 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-6">
          <Avatar
            className="h-32 w-32"
            image={user?.profile_image}
            name={user?.username}
          />

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold">
                  {user?.username}
                </h1>

                {user?.nickname && (
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="truncate">{user.nickname}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-muted-foreground">
                {user?.accountType === "PROFESSIONAL" && (
                  <Briefcase size={14}  />
                )}

                {user?.verified && (
                  <BadgeCheck
                    size={14}
                    className="text-emerald-500/80"
                  />
                )}
              </div>
            </div>

            {/* Métricas */}
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {user?.posts?.length ?? 0}
                </span>
                <span className="text-muted-foreground">postagens</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users2Icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {user?.friends?.length ?? 0}
                </span>
                <span className="text-muted-foreground">amizades</span>
              </div>

              {user?.id_user === payload?.id_user &&
                user?.accountType === "USER" && (
                  <ProfessionalAccount />
                )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <div className="rounded-xl border border-sidebar-border/60 bg-sidebar/30 p-3">
            <p className="text-sm leading-relaxed text-sidebar-foreground/80">
              {user.bio}
            </p>
          </div>
        )}

        {/* Perfil profissional */}
        {user?.accountType !== "USER" && user?.specialties && (
          <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Perfil profissional</span>
            </div>

            {user?.professionalBio && (
              <p className="mb-4 text-sm leading-relaxed text-sidebar-foreground/70">
                {user.professionalBio}
              </p>
            )}

            {user?.specialties?.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Especialidades
                </div>

                <ul className="flex flex-wrap gap-2">
                  {user.specialties.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-sidebar-border/60 bg-sidebar/60 px-3 py-1 text-xs text-sidebar-foreground/80"
                    >
                      #{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}


import {
  GraduationCap,
  Hash,
  Link2,
  MapPin,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogHeader, DialogTitle, DialogClose, Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Button } from "./ui/button";


type ProfessionalType =
  | "PSYCHOLOGIST"
  | "DOCTOR"
  | "LAWYER"
  | "NUTRITIONIST"
  | "THERAPIST"
  | "COACH"
  | "OTHER";

export const ProfessionalAccount = () => {
  const [open, setOpen] = useState(false);

  // novos campos (front)
  const [verified, setVerified] = useState(false);
  const [professionalType, setProfessionalType] =
    useState<ProfessionalType>("PSYCHOLOGIST");
  const [professionalBio, setProfessionalBio] = useState("");
  const [specialtiesText, setSpecialtiesText] = useState(""); // "Ansiedade, TCC, ..."
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const onSubmit = async () => {
    // você liga no seu back depois
    const payload = {
      verified,
      professionalType,
      professionalBio,
      specialties: specialtiesText
        .split(/[,|\n]/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      website,
      location,
    };

    try {
      const data = await UserApi.put({
        verified: payload.verified,
        accountType: "PROFESSIONAL",
        professionalType: payload.professionalType,
        professionalBio: payload.professionalBio,
        specialties: payload.specialties,
        verifiedAt: new Date(),
      });

      if (data.success) {
        toast.success("Sucesso");
      }
    } catch (e) {
      console.log(e);
      toast.error("Erro ao alterar conta");
    }

    setOpen(false);
  };

  const onReset = () => {
    setVerified(false);
    setProfessionalType("PSYCHOLOGIST");
    setProfessionalBio("");
    setSpecialtiesText("");
    setWebsite("");
    setLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="
            flex items-center gap-2
            bg-sidebar-accent
            shadow-sm
            hover:shadow
            hover:bg-sidebar-accent/90
            transition
          "
        >
          Tornar Profissional <Crown className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-lg rounded-2xl border border-sidebar-border/70 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Perfil profissional
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          {/* Categoria */}
          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select
              value={professionalType}
              onValueChange={(v) => setProfessionalType(v as ProfessionalType)}
            >
              <SelectTrigger className="rounded-xl bg-sidebar/40 border-sidebar-border/70">
                <SelectValue placeholder="Selecione a profissão" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PSYCHOLOGIST">Psicólogo(a)</SelectItem>
                <SelectItem value="DOCTOR">Médico(a)</SelectItem>
                <SelectItem value="LAWYER">Advogado(a)</SelectItem>
                <SelectItem value="NUTRITIONIST">Nutricionista</SelectItem>
                <SelectItem value="THERAPIST">Terapeuta</SelectItem>
                <SelectItem value="COACH">Coach / Mentor(a)</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio profissional */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Bio profissional
            </Label>
            <Textarea
              value={professionalBio}
              onChange={(e) => setProfessionalBio(e.target.value)}
              placeholder="Ex.: Psicólogo clínico, foco em TCC, ansiedade e relacionamentos..."
              className="min-h-[110px] rounded-xl bg-sidebar/40 border-sidebar-border/70 focus-visible:ring-1 focus-visible:ring-sidebar-accent/40"
            />
            <div className="text-xs text-sidebar-foreground/50">
              Máx. recomendado: 500 caracteres.
            </div>
          </div>

          {/* Especialidades */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Especialidades
            </Label>
            <Input
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="Ex.: Ansiedade, Depressão, TCC (separe por vírgula ou enter)"
              className="rounded-xl bg-sidebar/40 border-sidebar-border/70"
            />
            <div className="text-xs text-sidebar-foreground/50">
              Até 12 itens (vírgula ou quebra de linha).
            </div>
          </div>

          {/* Website */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Site / Link
            </Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://seusite.com"
              className="rounded-xl bg-sidebar/40 border-sidebar-border/70"
            />
          </div>

          {/* Localização */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex.: Itajaí/SC"
              className="rounded-xl bg-sidebar/40 border-sidebar-border/70"
            />
          </div>

          {/* Verificado */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar/30 p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Conta verificada</span>
              </div>
              <p className="text-xs text-sidebar-foreground/60 mt-1">
                Campo visual no front (você valida no back depois).
              </p>
            </div>
            <Switch checked={verified} onCheckedChange={setVerified} />
          </div>

          {/* Ações */}
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              className="rounded-full hover:bg-sidebar-accent/15"
            >
              Limpar
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full hover:bg-sidebar-accent/15"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="button"
              onClick={onSubmit}
              className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/90"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
