import processing
from frame import Frame

def handle(frame: Frame):
    command = frame.command
    if command == 'blur':
        processing.blur(frame.image)
    else:
        raise Exception(f'Unknown command: {command}')
    frame.send()

if __name__ == '__main__':
    frame = Frame()
    handle(frame)
