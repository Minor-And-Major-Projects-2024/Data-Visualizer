
import os
import logging
from waitress import serve

bind = '127.0.0.1:8000'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

log_file = os.path.join(BASE_DIR, 'waitress_server.log')
logging.basicConfig(filename=log_file, level=logging.INFO,
                    format='%(asctime)s %(levelname)s: %(message)s')


def setup_server():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dvs.settings')
    from django.core.wsgi import get_wsgi_application

    logging.info('Waitress server started')

    return get_wsgi_application()


if os.name == 'nt':
    import sys

    class WindowsLoggingHandler(logging.Handler):
        def emit(self, record):
            msg = self.format(record)
            sys.stdout.write(msg + '\n')

    logger = logging.getLogger('')
    logger.setLevel(logging.INFO)
    handler = WindowsLoggingHandler()
    formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)


if __name__ == '__main__':
    application = setup_server()
    serve(application, listen=bind)
