import paramiko

nginx_conf = """server {
    listen 80;
    server_name 2.25.75.243 puxarplaca.net www.puxarplaca.net;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
"""

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('2.25.75.243', username='root', password='jvX-GgU#hG.j,0RD')

sftp = client.open_sftp()
with sftp.file('/etc/nginx/sites-available/puxarplaca.net', 'w') as f:
    f.write(nginx_conf)
sftp.close()

stdin, stdout, stderr = client.exec_command('ln -sf /etc/nginx/sites-available/puxarplaca.net /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx')
print('OUT:', stdout.read().decode('utf-8'))
print('ERR:', stderr.read().decode('utf-8'))
client.close()
