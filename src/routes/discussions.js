const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getPagination, createPaginationMeta } = require('../utils/pagination');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /discussions/:courseId
router.post('/:courseId', authenticate, validate(schemas.createDiscussion), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message, parentId } = req.validatedData;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // If parentId provided, verify parent discussion exists and belongs to same course
    if (parentId) {
      const parentDiscussion = await prisma.discussion.findUnique({
        where: { id: parentId }
      });

      if (!parentDiscussion || parentDiscussion.courseId !== courseId) {
        return res.status(400).json({ error: 'Invalid parent discussion' });
      }
    }

    const discussion = await prisma.discussion.create({
      data: {
        courseId,
        userId: req.user.id,
        message,
        parentId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        parent: {
          select: { id: true, message: true }
        }
      }
    });

    res.status(201).json({
      message: 'Discussion post created successfully',
      discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /discussions/:courseId
router.get('/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page, limit } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = getPagination(page, limit);

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get top-level discussions (no parent) with their replies
    const [discussions, totalCount] = await Promise.all([
      prisma.discussion.findMany({
        where: {
          courseId,
          parentId: null // Only top-level discussions
        },
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true }
                  }
                },
                orderBy: { createdAt: 'asc' }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.discussion.count({
        where: {
          courseId,
          parentId: null
        }
      })
    ]);

    const meta = createPaginationMeta(totalCount, currentPage, currentLimit);

    res.json({
      discussions,
      meta
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;