const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@lms.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create teacher users
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@lms.com' },
    update: {},
    create: {
      name: 'John Teacher',
      email: 'teacher1@lms.com',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@lms.com' },
    update: {},
    create: {
      name: 'Jane Teacher',
      email: 'teacher2@lms.com',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 12);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@lms.com' },
    update: {},
    create: {
      name: 'Alice Student',
      email: 'student1@lms.com',
      password: studentPassword,
      role: 'STUDENT'
    }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@lms.com' },
    update: {},
    create: {
      name: 'Bob Student',
      email: 'student2@lms.com',
      password: studentPassword,
      role: 'STUDENT'
    }
  });

  // Create classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Mathematics 101',
      description: 'Introduction to Mathematics',
      teacherId: teacher1.id
    }
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Physics 101',
      description: 'Introduction to Physics',
      teacherId: teacher2.id
    }
  });

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Algebra Fundamentals',
      description: 'Learn the basics of algebra',
      classId: class1.id,
      teacherId: teacher1.id
    }
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Geometry Basics',
      description: 'Introduction to geometric concepts',
      classId: class1.id,
      teacherId: teacher1.id
    }
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Classical Mechanics',
      description: 'Study of motion and forces',
      classId: class2.id,
      teacherId: teacher2.id
    }
  });

  // Create sample discussions
  const discussion1 = await prisma.discussion.create({
    data: {
      courseId: course1.id,
      userId: student1.id,
      message: 'I have a question about quadratic equations. Can someone help?'
    }
  });

  await prisma.discussion.create({
    data: {
      courseId: course1.id,
      userId: teacher1.id,
      message: 'Sure! What specifically are you having trouble with?',
      parentId: discussion1.id
    }
  });

  // Create sample reports
  await prisma.report.create({
    data: {
      courseId: course1.id,
      studentId: student1.id,
      progress: 75.5,
      lastActivity: new Date()
    }
  });

  await prisma.report.create({
    data: {
      courseId: course1.id,
      studentId: student2.id,
      progress: 62.0,
      lastActivity: new Date()
    }
  });

  await prisma.report.create({
    data: {
      courseId: course3.id,
      studentId: student1.id,
      progress: 88.5,
      lastActivity: new Date()
    }
  });

  console.log('Database seed completed successfully!');
  console.log('\nSample login credentials:');
  console.log('Admin: admin@lms.com / admin123');
  console.log('Teacher: teacher1@lms.com / teacher123');
  console.log('Student: student1@lms.com / student123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });