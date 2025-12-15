import type { CommonUser } from "@/api/UserApi"
import UserApi from "@/api/UserApi"
import {
  MessageSquare,
  Users2Icon,
  Edit3,
  Info,
  Crown,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import Avatar from "@/api_avatar"
import { Dialog, DialogContent } from "./ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "./ui/button"

export default function ProfileDashboard({ id_user }: { id_user: string }) {
  const [user, setUser] = useState<CommonUser | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const res = await UserApi.getUser(id_user)
      if (res?.data) setUser(res.data)
    }
    getUser()
  }, [id_user])

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 flex flex-col gap">
      {/* Card principal */}
      <Card
        className="
          flex flex-col sm:flex-row gap-6
          p-6
          rounded-2xl
          bg-sidebar/60
          backdrop-blur
          border border-sidebar-border
          shadow-sm
          hover:shadow-md
          transition-all
        "
      >
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
           <Avatar className="w-36 h-36" image={user?.profile_image} name={user?.username}/>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col flex-1 gap-4 text-sidebar-foreground">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-semibold break-words">
              {user?.username}
            </h1>

            {user?.nickname && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Edit3 className="w-4 h-4" />
                <span>{user.nickname}</span>
              </div>
            )}
          </div>

          {/* Métricas */}
          <div className="flex flex-wrap gap-6 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-sidebar-accent" />
              <span className="font-medium">
                {user?.posts?.length ?? 0}
              </span>
              <span className="text-muted-foreground">postagens</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users2Icon className="w-4 h-4 text-sidebar-accent" />
              <span className="font-medium">
                {user?.friends?.length ?? 0}
              </span>
              <span className="text-muted-foreground">amizades</span>
            </div>

            <ProfessionalAccount/>

            
          </div>

          {/* Bio */}
          {user?.bio && (
            <div
              className="
                mt-2
                flex items-start gap-2
                rounded-xl
                bg-sidebar-accent/20
                p-3
                text-sm
                text-sidebar-foreground/80
              "
            >
              <Info className="w-4 h-4 mt-0.5 text-sidebar-accent shrink-0" />
              <p className="leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Descrição longa */}
      {user?.desc && (
        <Card
          className="
            p-5
            rounded-2xl
            bg-sidebar/60
            backdrop-blur
            border border-sidebar-border
            shadow-sm
            flex items-start gap-3
            text-sidebar-foreground
          "
        >
          <Info className="w-5 h-5 mt-1 text-sidebar-accent shrink-0" />
          <p className="text-sm sm:text-base leading-relaxed">
            {user.desc}
          </p>
        </Card>
      )}
    </div>
  )
}




import { BadgeCheck, Briefcase, GraduationCap, Hash, Link2, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProfessionalType =
  |"PSYCHOLOGIST"
   | "DOCTOR"
    |"LAWYER"
    |"NUTRITIONIST"
    |"THERAPIST"
    |"COACH"
    |"OTHER"

export const ProfessionalAccount = () => {
  const [open, setOpen] = useState(false)

  // novos campos (front)
  const [verified, setVerified] = useState(false)
  const [professionalType, setProfessionalType] = useState<ProfessionalType>("PSYCHOLOGIST")
  const [professionalBio, setProfessionalBio] = useState("")
  const [specialtiesText, setSpecialtiesText] = useState("") // "Ansiedade, TCC, ..."
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")

  const onSubmit = async () => {
    // você liga no seu back depois
    const payload = {
      verified,
      accountType: "PROFESSIONAL",
      professionalType,
      professionalBio,
      specialties: specialtiesText
        .split(/[,|\n]/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      website,
      location,
    }

    console.log("payload profissional:", payload)
    setOpen(false)
  }

  const onReset = () => {
    setVerified(false)
    setProfessionalType("PSYCHOLOGIST")
    setProfessionalBio("")
    setSpecialtiesText("")
    setWebsite("")
    setLocation("")
  }

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
            <div className="text-xs text-sidebar-foreground/50">Máx. recomendado: 500 caracteres.</div>
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
  )
}