const { z } = require("zod")
const { ROLES } = require("../constants")

const zodValidation = {
      valiate: (schema) => (req, res, next) => {
            const data = schema.safeParse(req.body)
            if (data.success) {
                  next()
            } else {
                  res.status(400).json({ message: data.error.errors[0].path + ' ' + data.error.errors[0].message })
            }
      },
      userSignUpSchema: z.object({
            username: z.string().min(2, "username must be 2 charachter long"),
            password: z.string().min(6, "password must be 6 charachter long"),
            email: z.string().email().min(2, "email must be valid"),
            role: z.enum(ROLES).optional().default('user'),
      }),
      userSignInSchema: z.object({
            email: z.string().email().min(2, "email must be valid"),
            password: z.string().min(6, "password must be 6 charachter long"),
      }),
      propertySchema: z.object({
            ownerId: z.string().min(2, "owner id is required"),
            title: z.string().min(6, "title must be longer then 6 characters"),
            description: z.string().min(6, 'description must be longer then 6 characters'),
            location: z.object({
                  latitude: z.number(),
                  longitude: z.number(),
            }).optional(),
            address: z.string().min(6, "address must be longer then 6 characters"),
            price: z.preprocess((val) => {
                  if (typeof val === 'string') {
                        let num = Number(val)
                        if (!isNaN(num)) return num
                  }
                  return val
            }, z.number().min(100, "price must be greater then 100 "))
      }),
      visiblitySchema:z.object({
            id: z.string().min(2,"id is required"),
            active: z.boolean()
      }),
      updateUserSchema:z.object({
            username: z.string().optional(),
            email: z.string().email().optional()
      }).refine((data)=> data.username || data.email,{
         message: "atleast on of the field username or email is required"
      }),
      updatePropertySchema: z.object({
            ownerId: z.string().min(2, "owner id is required").optional(),
            title: z.string().min(6, "title must be longer then 6 characters").optional(),
            description: z.string().min(6, 'description must be longer then 6 characters').optional(),
            location: z.object({
                  latitude: z.number(),
                  longitude: z.number(),
                  address: z.string()
            }).optional(),
            address: z.string().min(6, "address must be longer then 6 characters").optional(),
            price: z.number().min(100, "price must be greater then 100 ").optional()
      }),
      wishlistSchema: z.object({
            userId: z.string().min(4,"user id is invalid"),
            propertyId: z.string().min(4,"property id is invalid"),
      }),
      inquirySchema: z.object({
           from: z.string().min(6,"from id is invalid"),
           to: z.string().min(6,"to id is invalid"),
           propertyId: z.string().min(6,"property id is invalid"),
           message: z.string().min(1,'message is required'),
      }),
      updateInquirySchema: z.object({
            message: z.string().min(1,"message must be 1 character long")
      })
}

module.exports = zodValidation