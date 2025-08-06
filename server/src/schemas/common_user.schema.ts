import {z} from "zod";



// Regex para cpf
const cpfRegex: RegExp = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
// Regex para senha possuir uma letra maiúscula, um número e um caractere especial
const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
// Regex para contato 
const contactRegex: RegExp = /^\d{10,11}$/



const commonUserSchema = z.object({
    username: z.string().min(2, "O nome do usuário deve conter pelo menos 2 caracteres"),
    email: z.email("E-mail inválido"),
    password: z
        .string()
        .min(6, "A senha deve conter no mínimo 8 caracteres")
        .regex(
            passwordRegex,
            "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial"
        ),
    cpf: z.string().min(11, "Cpf Necessita ter 11 caracteres").regex(cpfRegex),
    birth: z.date().optional(),
    profile_image: z.url("Url Invalida").optional(),
    fk_address: z.int().optional(),
    contact:z
    .string()
    .regex(contactRegex, "Número de telefone inválido (use DDD + número)").optional(),
    gender: z.enum([
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
        "Prefiro não dizer"
      ]).optional(),
      emergency_contact: z.string().regex(contactRegex).optional()
      

});




export type CommonUser = z.infer<typeof commonUserSchema>
