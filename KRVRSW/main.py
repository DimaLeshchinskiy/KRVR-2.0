import webview
from app import app

webview.create_window('KRVR', app)
webview.start(debug=True)
