import express from "express";
import { AuthUser } from "../../middleware/Auth";
import { HospitalLoginSchema, HospitalSchema } from "./hospital.schema";
import { GetHospitalById, GetPatientMedicine, GetPatientMedicineForHospital, GetPatientMedicineforHospital, HospitalCreate, HospitalLogin, SearchHospital } from "./hospital.service";
import HashPassword from "../../utils/hashUtils";
import { success } from "zod";
import { AppError } from "../../utils/AppError";
import { COMMON_ERROR } from "../../constants/messages";
const hospitalRouter = express.Router();
//for now i have removed the admin logic as it require to have admin
hospitalRouter.post("/create", async (req, res, next) => {
  try {
    // const user = req.user!   // guaranteed by middleware

    // if (user.role !== "Admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only admin can create hospitals",
    //   })
    // }

    let safeData = HospitalSchema.parse(req.body);
    const hash = await HashPassword(safeData.password);
    safeData.password = hash;
    const hospital = await HospitalCreate(safeData);
    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
});

hospitalRouter.post('/login', async (req , res , next)=>{
  try{

    const data = req.body
    const safeData = HospitalLoginSchema.parse(data);
    const hospital = await HospitalLogin(safeData)
    res.status(200).cookie("token",hospital.token).json({
      success:true,
      data: hospital.safeData
    })
  }catch(error){
    next(error)
  }
})

hospitalRouter.get('/search', async (req , res , next)=>{
  try {
    const query = req.query.name as string
    const hospital = await SearchHospital(query)
    res.status(200).json({
      success: true,
      data: hospital
    })
  } catch (error) {
    next(error)
  }
})
hospitalRouter.get('/id', async (req , res , next)=>{
  try{
    
    const id = req.query.key as string
    const safeId = parseInt(id)
    const hospital = await GetHospitalById(safeId)
    res.status(200).json({
      success: true,
      data: hospital
    })
  }catch(error){
    next(error)
  }
})
hospitalRouter.get("/patientmedicine", AuthUser, async (req, res, next) => {
  try {
    const user = req.user!;
    const patientId = Number(req.query.patientId);

    if (!patientId || isNaN(patientId)) {
      throw new AppError("patientId query is required", 400);
    }

    const result = await GetPatientMedicineForHospital(user, patientId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
export default hospitalRouter;
