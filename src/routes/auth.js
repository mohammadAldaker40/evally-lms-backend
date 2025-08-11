const express = require('express');
const { generateToken, hashPassword, comparePassword } = require('../lib/auth');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /auth/register
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { name, email, password, role } = req.validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken({ userId: user.id });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({ userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;