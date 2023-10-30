import os
import sys
import logging
from gunicorn import glogging

workers = 2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

log_file = os.path.join(BASE_DIR, 'guni_server.log')
logging.basicConfig(filename=log_file, level=logging.INFO,
                    format='%(asctime)s %(levelname)s: %(message)s')

class CustomGunicornLogger(glogging.Logger):
    def setup(self, cfg):
        super().setup(cfg)
        self.access_log.setLevel(logging.INFO)
        self.access_log.propagate = False

    def log_request(self, *args):
        self.access_log.info(' '.join(map(str, args)))


def on_starting(server):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dvs.settings')
    from django.core.wsgi import get_wsgi_application
    server.application = get_wsgi_application()

    server.logger_class = CustomGunicornLogger
    server.logger = server.logger_class(server.cfg)

    # Log server start
    server.logger.info('Gunicorn server started')


if __name__ == '__main__':
    import subprocess

    if len(sys.argv) < 2:
        print("Please provide a port number as an argument.")
        sys.exit(1)

    port = sys.argv[1]

    args = [
        'gunicorn',
        '-c',
        'gunicorn_config.py',
        '--log-level',
        'info',
        '-b',
        f'0.0.0.0:{port}',
        'dvs.wsgi:application',
    ]
    subprocess.call(args)
