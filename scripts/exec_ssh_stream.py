import paramiko
import sys
import time

hostname = "2.25.75.243"
username = "root"
password = r"jvX-GgU#hG.j,0RD"

cmd = sys.argv[1] if len(sys.argv) > 1 else "uname -a"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname, port=22, username=username, password=password, timeout=30)
    transport = client.get_transport()
    channel = transport.open_session()
    channel.set_combine_stderr(True)
    channel.exec_command(cmd)

    while True:
        if channel.recv_ready():
            data = channel.recv(4096)
            sys.stdout.buffer.write(data)
            sys.stdout.buffer.flush()
        if channel.exit_status_ready():
            while channel.recv_ready():
                data = channel.recv(4096)
                sys.stdout.buffer.write(data)
                sys.stdout.buffer.flush()
            break
        time.sleep(0.5)

    exit_code = channel.recv_exit_status()
    print(f"\n[STREAM COMPLETED - EXIT CODE: {exit_code}]")
    sys.exit(exit_code)
finally:
    client.close()
