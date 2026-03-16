import express from "express";
import { MedicineSchema, type MedicineCreateSchema } from "./medicine.schema";
import { CreateMedicine, MedicineDetail, MedicineSearch } from "./medicine.service";

const medicineRouter = express.Router();
//Create Medicine
medicineRouter.post("/create", async (req, res, next) => {
  try {
    const data: MedicineCreateSchema = req.body;
    const safeData = MedicineSchema.parse(data);
    const medicine = await CreateMedicine(safeData);
    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
});

//Search Medicine or for debouncing
medicineRouter.get("/search", async (req, res, next) => {
  try {
    const value = req.query.value as string;
    const medicine = await MedicineSearch(value);
    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
});

//Search medicine by id
medicineRouter.get("/id", async (req , res , next)=>{
  try {
    const value = req.query.id as string
    const id= parseInt(value)
    const medicine = await MedicineDetail(id)
    res.status(200).json({
      success: true,
      data: medicine
    })
  } catch (error) {
    next(error)
  }
})
export default medicineRouter;
