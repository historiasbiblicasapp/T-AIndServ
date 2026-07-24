import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { cn, formatCPF, formatPhone } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const schema = z.object({
  empresa_id: z.coerce.number().int().positive("Empresa é obrigatória"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  nome_completo: z.string().min(3, "Nome é obrigatório"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (XXX.XXX.XXX-XX)"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  sexo: z.enum(["M", "F", "Outro"], { required_error: "Sexo é obrigatório" }),
  email_pessoal: z.string().email("E-mail inválido").optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  tipo_colaborador: z.enum(["efetivo", "temporario", "estagio", "terceirizado", "clt", "pj"], {
    required_error: "Tipo é obrigatório",
  }),
  admissao: z.string().min(1, "Data de admissão é obrigatória"),
  status: z.string().default("ativo"),
});

type FormData = z.infer<typeof schema>;

interface Empresa {
  id: number;
  razao_social: string;
}

interface ColaboradorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  colaborador?: any;
}

export function ColaboradorForm({ open, onOpenChange, onSaved, colaborador }: ColaboradorFormProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!colaborador;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      empresa_id: 0,
      matricula: "",
      nome_completo: "",
      cpf: "",
      data_nascimento: "",
      sexo: undefined,
      email_pessoal: "",
      celular: "",
      tipo_colaborador: undefined,
      admissao: "",
      status: "ativo",
    },
  });

  const cpfValue = watch("cpf");
  const celularValue = watch("celular");

  useEffect(() => {
    api.get("/estrutura/empresas").then((res) => {
      setEmpresas(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
      if (colaborador) {
        reset({
          empresa_id: colaborador.empresa_id,
          matricula: colaborador.matricula,
          nome_completo: colaborador.nome_completo,
          cpf: colaborador.cpf,
          data_nascimento: colaborador.data_nascimento,
          sexo: colaborador.sexo,
          email_pessoal: colaborador.email_pessoal || "",
          celular: colaborador.celular || "",
          tipo_colaborador: colaborador.tipo_colaborador,
          admissao: colaborador.admissao,
          status: colaborador.status || "ativo",
        });
      } else {
        reset({
          empresa_id: 0,
          matricula: "",
          nome_completo: "",
          cpf: "",
          data_nascimento: "",
          sexo: undefined,
          email_pessoal: "",
          celular: "",
          tipo_colaborador: undefined,
          admissao: "",
          status: "ativo",
        });
      }
    }
  }, [open, colaborador, reset]);

  useEffect(() => {
    setValue("cpf", formatCPF(cpfValue));
  }, [cpfValue, setValue]);

  useEffect(() => {
    if (celularValue !== undefined) {
      setValue("celular", formatPhone(celularValue));
    }
  }, [celularValue, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await api.patch(`/colaboradores/${colaborador.id}`, data);
      } else {
        await api.post("/colaboradores", data);
      }
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar colaborador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Colaborador" : "Novo Colaborador"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="empresa_id">Empresa *</Label>
            <select
              id="empresa_id"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.empresa_id && "border-destructive"
              )}
              {...register("empresa_id")}
            >
              <option value="">Selecione a empresa</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.razao_social}
                </option>
              ))}
            </select>
            {errors.empresa_id && (
              <p className="text-destructive text-xs mt-1">{errors.empresa_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="matricula">Matrícula *</Label>
            <Input
              id="matricula"
              {...register("matricula")}
              className={errors.matricula && "border-destructive"}
            />
            {errors.matricula && (
              <p className="text-destructive text-xs mt-1">{errors.matricula.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="nome_completo">Nome Completo *</Label>
            <Input
              id="nome_completo"
              {...register("nome_completo")}
              className={errors.nome_completo && "border-destructive"}
            />
            {errors.nome_completo && (
              <p className="text-destructive text-xs mt-1">{errors.nome_completo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="XXX.XXX.XXX-XX"
              maxLength={14}
              {...register("cpf")}
              className={errors.cpf && "border-destructive"}
            />
            {errors.cpf && (
              <p className="text-destructive text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
            <Input
              id="data_nascimento"
              type="date"
              {...register("data_nascimento")}
              className={errors.data_nascimento && "border-destructive"}
            />
            {errors.data_nascimento && (
              <p className="text-destructive text-xs mt-1">{errors.data_nascimento.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sexo">Sexo *</Label>
            <select
              id="sexo"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.sexo && "border-destructive"
              )}
              {...register("sexo")}
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.sexo && (
              <p className="text-destructive text-xs mt-1">{errors.sexo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tipo_colaborador">Tipo Colaborador *</Label>
            <select
              id="tipo_colaborador"
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.tipo_colaborador && "border-destructive"
              )}
              {...register("tipo_colaborador")}
            >
              <option value="">Selecione</option>
              <option value="efetivo">Efetivo</option>
              <option value="temporario">Temporário</option>
              <option value="estagio">Estágio</option>
              <option value="terceirizado">Terceirizado</option>
              <option value="clt">CLT</option>
              <option value="pj">PJ</option>
            </select>
            {errors.tipo_colaborador && (
              <p className="text-destructive text-xs mt-1">{errors.tipo_colaborador.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="admissao">Data de Admissão *</Label>
            <Input
              id="admissao"
              type="date"
              {...register("admissao")}
              className={errors.admissao && "border-destructive"}
            />
            {errors.admissao && (
              <p className="text-destructive text-xs mt-1">{errors.admissao.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email_pessoal">E-mail Pessoal</Label>
            <Input
              id="email_pessoal"
              type="email"
              {...register("email_pessoal")}
              className={errors.email_pessoal && "border-destructive"}
            />
            {errors.email_pessoal && (
              <p className="text-destructive text-xs mt-1">{errors.email_pessoal.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              placeholder="(XX) XXXXX-XXXX"
              maxLength={15}
              {...register("celular")}
              className={errors.celular && "border-destructive"}
            />
            {errors.celular && (
              <p className="text-destructive text-xs mt-1">{errors.celular.message}</p>
            )}
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Colaborador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
