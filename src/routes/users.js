const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { getPagination, createPaginationMeta } = require('../utils/pagination');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /users (Admin only)
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const { skip, take, page: currentPage, limit: currentLimit } = getPagination(page, limit);
    
    const where = role ? { role } : {};
    
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const meta = createPaginationMeta(totalCount, currentPage, currentLimit);

    res.json({
      users,
      meta
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /users/:id
router.put('/:id', authenticate, validate(schemas.updateUser), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    // Users can only update their own profile unless they're admin
    // Only admins can change roles
    if (req.user.role !== 'ADMIN') {
      if (req.user.id !== id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      // Remove role from update data for non-admins
      delete updateData.role;
    }

    // Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email }
      });
      
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /users/:id (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;