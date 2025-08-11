const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getPagination, createPaginationMeta } = require('../utils/pagination');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /classes (Teacher/Admin)
router.post('/', authenticate, authorize('TEACHER', 'ADMIN'), validate(schemas.createClass), async (req, res) => {
  try {
    const { name, description, teacherId } = req.validatedData;
    
    // If teacherId not provided, use current user (must be teacher)
    const finalTeacherId = teacherId || (req.user.role === 'TEACHER' ? req.user.id : null);
    
    if (!finalTeacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    // Verify teacher exists and has correct role
    const teacher = await prisma.user.findUnique({
      where: { id: finalTeacherId }
    });

    if (!teacher || teacher.role !== 'TEACHER') {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const classEntity = await prisma.class.create({
      data: {
        name,
        description,
        teacherId: finalTeacherId
      },
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: classEntity
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /classes
router.get('/', authenticate, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = getPagination(page, limit);
    
    let where = {};
    
    // Students and teachers can only see their own classes
    if (req.user.role === 'TEACHER') {
      where = { teacherId: req.user.id };
    } else if (req.user.role === 'STUDENT') {
      // For students, we need to find classes through courses they have access to
      // This is a simplified version - in real app you'd have enrollment system
      where = {};
    }

    const [classes, totalCount] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take,
        include: {
          teacher: {
            select: { id: true, name: true, email: true }
          },
          courses: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.class.count({ where })
    ]);

    const meta = createPaginationMeta(totalCount, currentPage, currentLimit);

    res.json({
      classes,
      meta
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /classes/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const classEntity = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        },
        courses: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!classEntity) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check access permissions
    if (req.user.role === 'TEACHER' && classEntity.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ class: classEntity });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /classes/:id (Teacher/Admin)
router.put('/:id', authenticate, authorize('TEACHER', 'ADMIN'), validate(schemas.updateClass), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;

    const existingClass = await prisma.class.findUnique({
      where: { id }
    });

    if (!existingClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Teachers can only update their own classes
    if (req.user.role === 'TEACHER' && existingClass.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
      include: {
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      message: 'Class updated successfully',
      class: updatedClass
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /classes/:id (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id }
    });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Class not found' });
    }
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;