import paramiko

js_code = """
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  const email = 'rfpita.ti@gmail.com';
  const password = 'Rafael@67';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      active: true,
      adminAttempts: 0,
      adminLockoutUntil: null,
    },
    create: {
      name: 'Rafael Pita Admin',
      email,
      passwordHash,
      role: 'ADMIN',
      active: true,
      balance: 1000.0,
      adminAttempts: 0,
      adminLockoutUntil: null,
    }
  });

  console.log('ADMIN_USER_CONFIGURED:', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active
  }, null, 2));
}

run()
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('2.25.75.243', username='root', password='jvX-GgU#hG.j,0RD')

sftp = client.open_sftp()
with sftp.file('/var/www/puxarplaca.net/scripts/setup_admin_user.js', 'w') as f:
    f.write(js_code)
sftp.close()

stdin, stdout, stderr = client.exec_command('docker exec -i consultaall-app node /app/scripts/setup_admin_user.js || docker run --rm --network host -v /var/www/puxarplaca.net:/app -w /app puxarplacanet-app node scripts/setup_admin_user.js')
print('OUT:', stdout.read().decode('utf-8'))
print('ERR:', stderr.read().decode('utf-8'))
client.close()
