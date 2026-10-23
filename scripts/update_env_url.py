import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('2.25.75.243', username='root', password='jvX-GgU#hG.j,0RD')

sftp = client.open_sftp()
with sftp.file('/var/www/puxarplaca.net/.env', 'r') as f:
    content = f.read().decode('utf-8')

content = content.replace('NEXT_PUBLIC_APP_URL="http://localhost:3000"', 'NEXT_PUBLIC_APP_URL="https://puxarplaca.net"')

with sftp.file('/var/www/puxarplaca.net/.env', 'w') as f:
    f.write(content)
sftp.close()

stdin, stdout, stderr = client.exec_command('cd /var/www/puxarplaca.net && docker compose up -d')
print('OUT:', stdout.read().decode('utf-8'))
print('ERR:', stderr.read().decode('utf-8'))
client.close()
