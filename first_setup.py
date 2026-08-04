"""
Developer OS - First Time Setup
---------------------------------
Run this once after cloning the repo. It will:
  1. Check for Node.js / npm (and tell you how to install if missing)
  2. Install project dependencies (npm install)
  3. Set up your .env.local file from .env.example
  4. Generate the Prisma client
  5. Create run.py (the script you'll use every time to start the app)
  6. Delete itself, since it's no longer needed
"""

import os
import re
import subprocess
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(ROOT_DIR, "developer-os")


def check_command(cmd, name):
    try:
        result = subprocess.run(
            [cmd, "--version"], capture_output=True, text=True, shell=True
        )
        version = result.stdout.strip() or result.stderr.strip()
        print(f"[OK] {name} found: {version}")
        return True
    except FileNotFoundError:
        print(f"[MISSING] {name} not found.")
        return False


def check_prerequisites():
    print("\nChecking prerequisites...\n")
    node_ok = check_command("node", "Node.js")
    npm_ok = check_command("npm", "npm")

    if not (node_ok and npm_ok):
        print(
            "\nNode.js/npm is missing.\n"
            "Download and install it from: https://nodejs.org/ (LTS version)\n"
            "Then re-run this script.\n"
        )
        sys.exit(1)


def install_dependencies():
    print("\nInstalling dependencies (this can take a few minutes)...\n")
    subprocess.run(["npm", "install"], cwd=APP_DIR, shell=True, check=True)
    print("\nDependencies installed.\n")


def setup_env_file():
    example = os.path.join(APP_DIR, ".env.example")
    target = os.path.join(APP_DIR, ".env.local")

    if os.path.exists(target):
        print("'.env.local' already exists, skipping.")
        return

    if not os.path.exists(example):
        print("No .env.example found, skipping .env.local setup.")
        return

    with open(example, "r", encoding="utf-8") as f:
        content = f.read()

    print("\nSetting up your local environment file...")
    db_url = input(
        "Enter your DATABASE_URL "
        "(e.g. postgresql://user:password@localhost:5432/developer_os)\n"
        "  Press Enter to skip and fill it in manually later: "
    ).strip().strip('"')

    if db_url:
        content = re.sub(
            r'DATABASE_URL=".*?"',
            lambda m: f'DATABASE_URL="{db_url}"',
            content,
        )
        print("DATABASE_URL saved to .env.local.")
    else:
        print("Skipped — DATABASE_URL left as a placeholder in .env.local.")

    with open(target, "w", encoding="utf-8") as f:
        f.write(content)

    print(
        "="*30,"\nCreated developer-os/.env.local.\n"
        "Open it and fill in any remaining values (AUTH_SECRET, OAuth keys, "
        "etc.) before running the app.\n","="*30
    )


def setup_database():
    print("\nGenerating Prisma client...\n")
    subprocess.run(["npx", "prisma", "generate"], cwd=APP_DIR, shell=True, check=True)
    print("Prisma client generated.")
    print(
        "\nRun 'npx prisma db push' inside developer-os/ once your\n"
        "DATABASE_URL is set in .env.local, to create your database tables.\n"
    )


RUN_PY_TEMPLATE = '''"""
Developer OS - Launcher
Run this file any time you want to start the app.
"""

import ctypes
import os
import subprocess

# Hide the console window (Windows only)
ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 6)

# Open the app in Chrome, maximized
subprocess.Popen('start chrome --start-maximized "http://localhost:3000/"', shell=True)

# Start the dev server (path is relative to this file, works on any machine)
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "developer-os")
subprocess.Popen(["npm", "run", "dev"], shell=True, cwd=APP_DIR)
'''

def create_run_script():
    run_path = os.path.join(ROOT_DIR, "run.py")
    with open(run_path, "w", encoding="utf-8") as f:
        f.write(RUN_PY_TEMPLATE)
    print(f"\nCreated run.py at {run_path}")


def self_destruct():
    print("\nCleaning up setup script...\n")
    try:
        os.remove(os.path.abspath(__file__))
        print("first_setup.py deleted. Setup complete!")
    except OSError as e:
        print(f"Could not delete first_setup.py automatically: {e}")
        print("You can delete it manually, it's no longer needed.")


def main():
    print("=" * 50)
    print("   Developer OS - First Time Setup")
    print("=" * 50)

    check_prerequisites()
    install_dependencies()
    setup_env_file()
    setup_database()
    create_run_script()

    print("\nSetup complete! Fill in developer-os/.env.local if you haven't,")
    print("then double-click run.py any time to start Developer OS.\n")

    self_destruct()


if __name__ == "__main__":
    main()