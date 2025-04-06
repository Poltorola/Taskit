# Taskit 
Simple To-Do List generator (web app practice)

# deploy (Ubuntu)

## clone git repo

```bash
git clone https://github.com/Poltorola/Taskit.git
```

## preparing virtual env with dependencies
```bash
apt install python3.12-venv
python3 -m venv .
source bin/activate
pip install -r requirements.txt
```

## install mongodb

```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl enable mongod
```

## create .env file

create a flask secret key
```python
import secrets

secret_key = secrets.token_hex(32)  # 64 символа, 256 бит
print(secret_key)
```

create a mongodb strong password
```python

from random import choice

alphabet = 'qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()-=_+[]{};:<>,./?|~'
alphabet += alphabet.upper()

print(''.join([choice(alphabet) for _ in range(20)]))

```

write secret key and password into .env file
```conf
FLASK_SECRET_KEY=<secret_key_generated_before>
MONGO_PASSWORD=<password_generated_before>
```

## create user and database in mongo

```bash
mongosh
```

```mongosh
use taskit_app
use admin

db.createUser(
    {
        user: "backend",
        pwd: "<password_generated_before>",
        roles: [{role: "readWrite", db: "taskit_app"}]
    }
)

db.createUser(
    {
        user: "admin",
        pwd: "<other_password>",
        roles: [{role: "root", db: "admin"}]
    }
)

use taskit_app
db.createCollection("users", {capped: true, size: 104857600, max: 100});
db.createCollection("tasks", {capped: true, size: 104857600, max: 100});
```



