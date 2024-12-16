'use server';

import { encryptPwd } from "@/lib/auth-pwd";
import { 
  userModel, 
  userGroupModel, 
  permissionModel,
} from "@/app/backend/models/manager";
import { unitModel } from "@/app/backend/models/clinical";

const permissions = [
  {
    label: "Utentes",
    route: "patient",
    detail: "Gestão de utentes"
  },
  {
    label: "Triagem",
    route: "screening",
    detail: "Triagem de sinais dos utentes"
  },
  {
    label: "Banco de Urgência",
    route: "urgency-bank",
    detail: "Bancos de urgências de atendimentos (Medicina, pediatria, geral...)"
  },
  {
    label: "Consultório",
    route: "office",
    detail: "Consultório"
  },
  {
    label: "Perfil",
    route: "profile",
    detail: "Perfil do Usuário"
  },
  {
    label: "Unidades/Funcionários",
    route: "phisical-unit",
    detail: "Unidades de Acesso, internamento, Laboratorios Externas"
  },
  {
    label: "Exames Agendados",
    route: "schedule-exams-services",
    detail: "Gestão de agendamento de exames"
  },
  {
    label: "Exames/Serviços",
    route: "exams-services",
    detail: "Cadastro de tipos de exames/serviços"
  },
  {
    label: "Calendário",
    route: "doctor-calendar",
    detail: "Calendário/Escala Médica"
  },
  {
    route: 'appointment',
    label: 'Consultas Agendadas',
    detail: "Consultas"
  },
  {
    route: 'laboratory',
    label: 'Laboratório',
    detail: "Laboratorio"
  },
  {
    route: 'imaging',
    label: 'Imagiologia',
    detail: "Imagilogia"
  }
];

const userGroups = [
  {
    label: 'Administrador',
    name: 'administrator',
    route: '/manager'
  },
  {
    label: 'Clínico',
    name: 'clinical',
    route: '/clinical'
  },
];

export default async function masterAutoSetup(){
  try{
    const isConfigureded = await userModel.findOne({username: 'admin'});
    if(isConfigureded)
      return {
        message: 'Master já está configurado!',
        status: false
      };

    for(const group of userGroups){
      const userGroup = new userGroupModel(group);
      await userGroup.save();
    }

    // config admin account 
    const password = await encryptPwd('admin'); // default password
    const userGroupAdmin = await userGroupModel.findOne({name: 'administrator'}).select({_id: 1});
    
    if(!userGroupAdmin){
      const createAdminGroup = new userGroupModel(userGroups[0]);
      await createAdminGroup.save();
      throw new Error("Falha na criação do usuário admin, tente novamente!");
    }

    const adminUser = new userModel({
      username: 'admin',
      fullname: 'Administrador',
      password,
      email: 'it@gmail.com',  
      userGroupId: userGroupAdmin._id,
      isActive: true,
      isAdmin: true,
      tel: '000000000'
    });

    await adminUser.save();

    // permissões do modulo clinico
    for(const perm of permissions){
      const clinicalGroup = await userGroupModel.findOne({ name: "clinical" });
      if(!clinicalGroup)
        throw new Error("Modulo clinico não definido!");
      
      const userPermission = new permissionModel({
        userGroupId: clinicalGroup._id,
        route: perm.route,
        label: perm.label,
        detail: perm.detail,  
      });

      await userPermission.save();
    }

    // unidade física padrão
    const unit = new unitModel({
      name: process.env.CLIENT_NAME,
      unitTypeId: "workplace",
      userId: adminUser._id,
    });

    await unit.save();

    console.log({
      message: "master configurado com sucesso!",
    })
  }catch(err: unknown){
    const e = err as { message: string };
    console.log({
      message: e.message,
    });
  }
}