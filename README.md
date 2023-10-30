# DVS

## Installation

```bash
# Clone the repository
git clone https://github.com/mstomar698/dvs.git -b <<branch_name>>
# Setup virtual environment
conda create -n dvs python=3.9 -y # or virtualenv dvs
# Activate virtual environment
conda activate dvs # or source dvs/bin/activate || dvs/Scripts/activate
# Install dependencies
pip install -r requirements.txt
# set working ENV
export ENV=LOCAL # or $env:ENV = "LOCAL"
# Setup local sqlite DB
python manage.py makemigrations
python manage.py migrate
# Create Super User
python manage.py createsuperuser
# Run server
python manage.py runserver
# Default server is started at :8000
# Change Directory to frontend
cd dashboard
# Install dependencies
npm install
# Run server
npm run start
```
