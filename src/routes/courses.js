const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getPagination, createPaginationMeta } = require('../utils/pagination');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /courses (Teacher/Admin)
router.post('/', authenticate, authorize('TEACHER', 'ADMIN'), validate(schemas.createCourse), async (req, res) => {
  try {
    const { title, description, classId, teacherId } = req.validatedData;
    
    // If teacherId not provided, use current user (must be teacher)
    const finalTeacherId = teacherId || (req.user.role === 'TEACHER' ? req.user.id : null);
    
    if (!finalTeacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    // Verify class exists and user has access to it
    const classEntity = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classEntity) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Teachers can only create courses for their own classes
    if (req.user.role === 'TEACHER' && classEntity.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only create courses for your own classes.' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        classId,
        teacherId: finalTeacherId
      },
      include: {
        class: {
          select: { id: true, name: true }
        },
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /courses
router.get('/', authenticate, async (req, res) => {
  try {
    const { page, limit, classId } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = getPagination(page, limit);
    
    let where = {};
    
    // Apply class filter if provided
    if (classId) {
      where.classId = classId;
    }
    
    // Teachers can only see their own courses
    if (req.user.role === 'TEACHER') {
      where.teacherId = req.user.id;
    }

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          class: {
            select: { id: true, name: true }
          },
          teacher: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    const meta = createPaginationMeta(totalCount, currentPage, currentLimit);

    res.json({
      courses,
      meta
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /courses/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        class: {
          select: { id: true, name: true }
        },
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check access permissions
    if (req.user.role === 'TEACHER' && course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /courses/:id (Teacher/Admin)
router.put('/:id', authenticate, authorize('TEACHER', 'ADMIN'), validate(schemas.updateCourse), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;

    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Teachers can only update their own courses
    if (req.user.role === 'TEACHER' && existingCourse.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: { id: true, name: true }
        },
        teacher: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /courses/:id (Teacher/Admin)
router.delete('/:id', authenticate, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Teachers can only delete their own courses
    if (req.user.role === 'TEACHER' && existingCourse.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;