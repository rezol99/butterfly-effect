import sys

def print_debug(*message):
    message = " ".join([str(m) for m in message])
    print('\033[31m'+message+'\033[0m', file=sys.stderr)
