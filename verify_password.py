import bcrypt

password = b"admin"
hashed = b"$2b$10$vYV0mlHmkMQ3BUTDp4SVqeyIsNK0jyiuIV8ZR0.AO4M/or.HiWOEm"

try:
    if bcrypt.checkpw(password, hashed):
        print("Match")
    else:
        print("No Match")
except Exception as e:
    print(f"Error: {e}")
