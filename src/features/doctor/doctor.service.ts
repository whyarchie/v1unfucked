import prisma from "../../config/prisma";
import type { DoctorSchemaCreate } from "./doctor.schema";

export async function CreateDoctor(data:DoctorSchemaCreate){
    const doctor = await prisma.doctor.create(
        {
            data:{
                name: data.name,
                username: data.username,
                hospitalId: data.hospitalId
            },
            select:{
                id: true,
                name: true,
                username: true
            }
        }
    )
    return doctor
}

export async function GetDoctorByHostpialId(id:number){
    const result = await prisma.doctor.findMany({
        where: {
            id
        },
        select:{
            id: true,
            name: true,
            username: true
        }
    })
    return result
}