import express, { type NextFunction } from "express";
import {
  AssignMedicineSchema,
  medicalHistorySchema,
  PatientConditionSchema,
  patientLoginSchema,
  patientSchema,
  type MedicalHistoryCreate,
  type PatientInput,
  type PatientLoginInput,
} from "./patient.schema";
import {
  AssignMedicine,
  CreatePatient,
  DeletePatientService,
  GetAssignedMedicineForPatient,
  LoginPatient,
  MedicalHistoryCreateService,
  PatientConditionCreate,
  PatientConditionGet,
} from "./patient.service";
import { AuthUser } from "../../middleware/Auth";
import { AppError } from "../../utils/AppError";
import { COMMON_ERROR } from "../../constants/messages";
const patientRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API to manage patients
 */

/**
 * @swagger
 * /api/v1/patient/create:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *               bloodGroup:
 *                 type: string
 *                 enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
 *               gender:
 *                 type: string
 *                 enum: ["MALE", "FEMALE", "OTHER"]
 *               mobileNumber:
 *                 type: string
 *             example:
 *               name: "John Doe"
 *               dateOfBirth: "1990-01-01T00:00:00.000Z"
 *               bloodGroup: "O+"
 *               gender: "MALE"
 *               mobileNumber: "919876543210"
 *     responses:
 *       200:
 *         description: Patient created successfully
 *       400:
 *         description: Validation error
 */
patientRouter.post("/create", async (req, res, next) => {
  const data: PatientInput = req.body;
  try {
    const safeData = patientSchema.parse(data);
    const patient = await CreatePatient(safeData);
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /api/v1/patient/login:
 *   post:
 *     summary: Login a patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *             example:
 *               mobileNumber: "919876543210"
 *               dateOfBirth: "1990-01-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Login successful, returns token cookie
 *       400:
 *         description: Invalid credentials
 */
patientRouter.post("/login", async (req, res, next) => {
  const data: PatientLoginInput = req.body;
  try {
    const safeData = patientLoginSchema.parse(data);
    const patient = await LoginPatient(safeData);
    res.status(200).cookie("token", patient.token).json({
      success: true,
      data: patient.patient,
    });
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /api/v1/patient/loginmedicine:
 *   post:
 *     summary: Login a patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *             example:
 *               mobileNumber: "919876543210"
 *               dateOfBirth: "1990-01-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Login successful, return array of assigned medicine 
 *       400:
 *         description: Invalid credentials
 */
patientRouter.post('/loginmedicine', async (req , res , next)=>{
 try {
  const data: PatientLoginInput = req.body;
  const safeData = patientLoginSchema.parse(data);
    const result = await LoginPatient(safeData);
     const medicine = await GetAssignedMedicineForPatient(result.patient.id)
    res.status(200).json({
      success: true,
      data: medicine
    })
 } catch (error) {
  next(error)
 }
})

/**
 * @swagger
 * /api/v1/patient/delete:
 *   delete:
 *     summary: Delete a patient (Self)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       403:
 *         description: Unauthorized
 */
//Patient Delete
patientRouter.delete("/delete", AuthUser, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (userInfo?.role == "Patient") {
      const id = userInfo?.id;
      const data = await DeletePatientService(id);
      console.log(data);
      res.status(200).json({
        success: true,
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /api/v1/patient/medicalhistorycreate:
 *   post:
 *     summary: Create Medical History
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diseaseId:
 *                 type: number
 *               patientId:
 *                 type: number
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             example:
 *               diseaseId: 1
 *               patientId: 1
 *               description: "Patient experienced severe headaches"
 *               startDate: "2023-01-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Medical history created successfully
 */
//Medical History create
patientRouter.post("/medicalhistorycreate", async (req, res, next) => {
  const data: MedicalHistoryCreate = req.body;
  try {
    const safeData = medicalHistorySchema.parse(data);
    const newData = await MedicalHistoryCreateService(safeData);
    res.status(200).json({
      success: true,
      data: newData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/patient/condition:
 *   post:
 *     summary: Request/Create a patient condition
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: number
 *               diseaseId:
 *                 type: number
 *               hospitalId:
 *                 type: number
 *               doctorId:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: ["STABLE", "CRITICAL", "RECOVERED"]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             example:
 *               patientId: 1
 *               diseaseId: 1
 *               hospitalId: 1
 *               status: "STABLE"
 *               startDate: "2023-01-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Patient condition created
 */
//Create Patient Condition
patientRouter.post("/condition", AuthUser, async (req, res, next) => {
  try {
    let data = req.body;
    const user = req.user;
    // Validate input data
    const safeData = PatientConditionSchema.parse(data);
    const payload = {
      ...safeData,
      [`${user?.role.toLowerCase()}Id`]: user?.id
    }
    const patientCondition = await PatientConditionCreate(payload)
    // Success response
    res.status(201).json({
      success: true,
      data: patientCondition,
    });


  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/patient/condition/:
 *   get:
 *     summary: Get patient condition by ID
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Condition ID
 *     responses:
 *       200:
 *         description: Patient condition details
 */
patientRouter.get("/condition/", AuthUser, async (req, res, next) => {
  try {
    const user = req.user!;
    const id = parseInt(req.query.id as string)


    if (!id) {
      throw new AppError("Invalid condition id", 400);
    }

    const condition = await PatientConditionGet({ user, safeId: id });

    res.json({
      success: true,
      data: condition,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/patient/condition/medicine:
 *   post:
 *     summary: Assign medicine to a condition (Hospital Only)
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientConditionId:
 *                 type: number
 *               medicines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicineId:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     tillDate:
 *                       type: string
 *                       format: date-time
 *                     timings:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               patientConditionId: 1
 *               medicines:
 *                 - medicineId: 1
 *                   quantity: 2
 *                   tillDate: "2023-12-31T00:00:00.000Z"
 *                   timings: ["08:00", "20:00"]
 *     responses:
 *       200:
 *         description: Medicine assigned successfully
 *       403:
 *         description: Invalid role
 */
patientRouter.post("/condition/medicine", AuthUser, async (req, res, next) => {
  try {
    const user = req.user
    const safeData = AssignMedicineSchema.parse(req.body)

    if (user?.role !== "Hospital") {
      throw new AppError(COMMON_ERROR.INVALID_ROLE, 403)
    }

    const result = await AssignMedicine(safeData, user)

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
})
/**
 * @swagger
 * /api/v1/patient/condition/assignedmedicine:
 *   get:
 *     summary: Get assigned medicines for a patient
 *     tags: [Patients]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved assigned medicines
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   patientConditionId: 1
 *                   medicineId: 1
 *                   quantity: 2
 *                   tillDate: "2023-12-31T00:00:00.000Z"
 *                   timings: ["08:00", "20:00"]
 *                   medicine:
 *                     id: 1
 *                     name: "Paracetamol"
 *                     description: "For fever"
 *       403:
 *         description: Invalid role
 */

patientRouter.get('/condition/assignedmedicine', AuthUser, async (req, res, next) => {
  try {

    const user = req.user;
    if (user?.role !== "Patient") {
      throw new AppError(COMMON_ERROR.INVALID_ROLE, 403)
    }
    const medicine = await GetAssignedMedicineForPatient(user.id)
    res.status(200).json({
      success: true,
      data: medicine
    })
  } catch (error) {
    next(error)
  }

})
export default patientRouter;
