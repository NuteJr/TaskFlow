import { PrismaClient, UserRole, ProjectVisibility, Priority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskflow.app',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.owner,
      isEmailVerified: true,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A workspace to explore TaskFlow',
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: UserRole.owner,
        },
      },
    },
  });

  console.log('✅ Created workspace:', workspace.name);

  // Create project
  const project = await prisma.project.create({
    data: {
      name: 'Demo Project',
      description: 'A project to showcase TaskFlow features',
      workspaceId: workspace.id,
      ownerId: user.id,
      visibility: ProjectVisibility.workspace,
      members: {
        create: {
          userId: user.id,
          role: 'manager',
        },
      },
      columns: {
        create: [
          { name: 'Backlog', color: 'gray', order: 0, statusMapping: 'backlog' },
          { name: 'To Do', color: 'blue', order: 1, statusMapping: 'todo' },
          { name: 'In Progress', color: 'yellow', order: 2, statusMapping: 'in_progress' },
          { name: 'Done', color: 'green', order: 3, statusMapping: 'done' },
        ],
      },
    },
    include: {
      columns: true,
    },
  });

  console.log('✅ Created project:', project.name);

  // Create tasks
  const columns = project.columns;
  
  const tasksData = [
    { title: '🎉 Welcome to TaskFlow!', description: 'This is a demo task to get you started.', priority: Priority.high, columnIndex: 0 },
    { title: '✨ Explore the features', description: 'Try dragging tasks between columns.', priority: Priority.medium, columnIndex: 0 },
    { title: '📚 Create your first project', description: 'Click "New Project" to add more projects.', priority: Priority.low, columnIndex: 1 },
    { title: '👥 Invite team members', description: 'Collaborate with your team in real-time.', priority: Priority.medium, columnIndex: 2 },
    { title: '✅ Complete this task', description: 'Drag me to the Done column!', priority: Priority.low, columnIndex: 3 },
  ];

  for (let i = 0; i < tasksData.length; i++) {
    const taskData = tasksData[i];
    await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        projectId: project.id,
        workspaceId: workspace.id,
        columnId: columns[taskData.columnIndex].id,
        priority: taskData.priority,
        order: i,
        createdById: user.id,
      },
    });
  }

  console.log('✅ Created', tasksData.length, 'tasks');
  console.log('\n🎊 Database seeded successfully!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@taskflow.app');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
