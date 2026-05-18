import os, sys
os.chdir('/Users/karim/Desktop/DROLLS WEBBSITE')
from http.server import HTTPServer, SimpleHTTPRequestHandler
HTTPServer(('', 8080), SimpleHTTPRequestHandler).serve_forever()
