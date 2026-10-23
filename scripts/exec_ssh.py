import paramiko
import sys

hostname = "2.25.75.243"
username = "root"
password = r"jvX-GgU#hG.j,0RD"

cmd = sys.argv[1] if len(sys.argv) > 1 else "uname -a"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname, port=22, username=username, password=password, timeout=15)
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    exit_status = stdout.channel.recv_exit_status()
    print("=== STDOUT ===")
    print(out)
    if err:
        print("=== STDERR ===")
        print(err)
    print(f"EXIT CODE: {exit_status}")
finally:
    client.close()
