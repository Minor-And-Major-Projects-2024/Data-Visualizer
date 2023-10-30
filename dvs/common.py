
from datetime import datetime

from dvs.settings import AUTHENTICATED_RATE_LIMIT, IST, UNAUTHENTICATED_RATE_LIMIT

def log_time(func):
    def wrap_func(*args, **kwargs):
        
        t1 = datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S.%f')
        print(f'Started at {t1}')
        result = func(*args, **kwargs)
        t2 = datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S.%f')
        print(f'Ended at {t2}')
        return result
    
    return wrap_func

getratelimit = lambda _, request: AUTHENTICATED_RATE_LIMIT if request.user.is_authenticated else UNAUTHENTICATED_RATE_LIMIT

