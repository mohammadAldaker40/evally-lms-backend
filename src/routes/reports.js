const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getPagination, createPaginationMeta } = require('../utils/pagination');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /reports
router.get('/', authenticate, async (req, res) => {
  try {
    const { page, limit, courseId, classId, studentId, startDate, endDate } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = getPagination(page, limit);

    let where = {};
    
    // Build where clause based on filters
    if (courseId) where.courseId = courseId;
    if (studentId) where.studentId = studentId;
    
    if (startDate || endDate) {
      where.lastActivity = {};
      if (startDate) where.lastActivity.gte = new Date(startDate);
      if (endDate) where.lastActivity.lte = new Date(endDate);
    }

    // If classId is provided, filter by courses in that class
    if (classId) {
      const coursesInClass = await prisma.course.findMany({
        where: { classId },
        select: { id: true }
      });
      where.courseId = {
        in: coursesInClass.map(c => c.id)
      };
    }

    // Role-based access control
    if (req.user.role === 'TEACHER') {
      // Teachers can only see reports for their courses
      const teacherCourses = await prisma.course.findMany({
        where: { teacherId: req.user.id },
        select: { id: true }
      });
      
      const teacherCourseIds = teacherCourses.map(c => c.id);
      
      if (where.courseId && where.courseId.in) {
        // Filter existing courseId filter to only include teacher's courses
        where.courseId.in = where.courseId.in.filter(id => teacherCourseIds.includes(id));
      } else if (where.courseId && typeof where.courseId === 'string') {
        // Check if the specific course belongs to the teacher
        if (!teacherCourseIds.includes(where.courseId)) {
          return res.status(403).json({ error: 'Access denied' });
        }
      } else {
        // Limit to teacher's courses
        where.courseId = { in: teacherCourseIds };
      }
    } else if (req.user.role === 'STUDENT') {
      // Students can only see their own reports
      where.studentId = req.user.id;
    }

    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              class: {
                select: { id: true, name: true }
              }
            }
          },
          student: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { lastActivity: 'desc' }
      }),
      prisma.report.count({ where })
    ]);

    const meta = createPaginationMeta(totalCount, currentPage, currentLimit);

    res.json({
      reports,
      meta
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /reports/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            class: {
              select: { id: true, name: true }
            },
            teacher: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Access control
    if (req.user.role === 'STUDENT' && report.studentId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'TEACHER' && report.course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /reports (Create or update progress report)
router.post('/', authenticate, validate(schemas.createReport), async (req, res) => {
  try {
    const { courseId, studentId, progress } = req.validatedData;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Role-based access control
    if (req.user.role === 'TEACHER' && course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only create reports for your courses.' });
    }

    if (req.user.role === 'STUDENT' && req.user.id !== studentId) {
      return res.status(403).json({ error: 'Access denied. You can only update your own progress.' });
    }

    // Create or update report
    const report = await prisma.report.upsert({
      where: {
        courseId_studentId: {
          courseId,
          studentId
        }
      },
      update: {
        progress,
        lastActivity: new Date()
      },
      create: {
        courseId,
        studentId,
        progress,
        lastActivity: new Date()
      },
      include: {
        course: {
          select: { id: true, title: true }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Create/update report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;