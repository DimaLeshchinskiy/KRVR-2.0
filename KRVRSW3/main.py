import webview
from app import app


def after_start(window):
    # window.toggle_fullscreen()
    pass


if __name__ == '__main__':
    window = webview.create_window('KRVR',
                                   app,
                                   min_size=(1280, 720),
                                   fullscreen=False)
    webview.start(after_start, window, debug=True)
