# jap-jete-admin
Backend &amp; website per aplikacionin e dhurimit te gjakut "Jap Jetë"

# Setup
```bash
# clone the repo and cd
git clone https://github.com/tiranacode/jap-jete-admin.git && cd jap-jete-admin
# Install virtualenv and create a virtual environment
pip install virtualenv
virtualenv venv
# activate the virtual environment
source venv/bin/activate
# Install required python libraries
pip install -r requirements.txt
# Install node modules
npm install


# start a local server
python server.py
```

# ReactJS preset
```bash
# Transform JSX for development
gulp default

# Transform JSX for deployment
gulp deploy
```

# Deployment

```bash
# First time deployment:
fab full_install
# Deploy code changes
fab redeploy
```
