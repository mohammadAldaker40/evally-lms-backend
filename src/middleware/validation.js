const { z } = require('zod');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      next(error);
    }
  };
};

// Validation schemas
const schemas = {
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional().default('STUDENT')
  }),

  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),

  updateUser: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional()
  }),

  createClass: z.object({
    name: z.string().min(2, 'Class name must be at least 2 characters'),
    description: z.string().optional(),
    teacherId: z.string().cuid('Invalid teacher ID').optional()
  }),

  updateClass: z.object({
    name: z.string().min(2, 'Class name must be at least 2 characters').optional(),
    description: z.string().optional(),
    teacherId: z.string().cuid('Invalid teacher ID').optional()
  }),

  createCourse: z.object({
    title: z.string().min(2, 'Course title must be at least 2 characters'),
    description: z.string().optional(),
    classId: z.string().cuid('Invalid class ID'),
    teacherId: z.string().cuid('Invalid teacher ID').optional()
  }),

  updateCourse: z.object({
    title: z.string().min(2, 'Course title must be at least 2 characters').optional(),
    description: z.string().optional(),
    classId: z.string().cuid('Invalid class ID').optional(),
    teacherId: z.string().cuid('Invalid teacher ID').optional()
  }),

  createDiscussion: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    parentId: z.string().cuid('Invalid parent ID').optional()
  }),

  createReport: z.object({
    courseId: z.string().cuid('Invalid course ID'),
    studentId: z.string().cuid('Invalid student ID'),
    progress: z.number().min(0).max(100, 'Progress must be between 0 and 100')
  })
};

module.exports = {
  validate,
  schemas
};