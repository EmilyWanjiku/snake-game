# snake-game
This project aims to create an interactive snake game that is fun and enjoyable
#
 Detailed Guide to Setting Up the Legendary Snake Game Project

I'll provide detailed instructions for both Windows and Linux users, including all the necessary commands to install dependencies.
Prerequisites Installation
For Windows Users

    Install Node.js and npm:
        Visit the Node.js website

    Download the LTS (Long Term Support) version
    Run the installer and follow the installation wizard
    Make sure to check the option to install npm (it comes bundled with Node.js)
    Also check the option to "Add to PATH" during installation

Verify Installation: Open Command Prompt (cmd) and run:
node --version
npm --version

You should see version numbers for both.

Install Git (optional, but recommended):

    Download Git from git-scm.com

        Run the installer and use the default settings

For Linux Users

    Install Node.js and npm using your distribution's package manager:

    For Ubuntu/Debian:

# Update package lists
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Install the latest LTS version using NVM (recommended)
# First install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Close and reopen your terminal, then run:
nvm install --lts

For Fedora:
sudo dnf install nodejs npm

For Arch Linux:
sudo pacman -S nodejs npm

Verify Installation:
node --version
npm --version

Install Git (if not already installed):

    # Ubuntu/Debian
    sudo apt install git

    # Fedora
    sudo dnf install git

    # Arch Linux
    sudo pacman -S git

Setting Up the Project
Step 1: Create Project Directory

Windows:
mkdir legendary-snake-game
cd legendary-snake-game

Linux:
mkdir legendary-snake-game
cd legendary-snake-game
Step 2: Initialize a New Next.js Project

This will create a basic Next.js project structure:

Both Windows and Linux:
npx create-next-app@latest .

During the setup, you'll be asked several questions. Answer as follows:

    Would you like to use TypeScript? → Yes
    Would you like to use ESLint? → Yes
    Would you like to use Tailwind CSS? → Yes
    Would you like to use src/ directory? → No
    Would you like to use App Router? → Yes
    Would you like to customize the default import alias (@/*)? → Yes (use @/)

Step 3: Install Required Dependencies

Now, install all the specific dependencies needed for the game:

Both Windows and Linux:
npm install framer-motion lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-switch
Step 4: Set Up shadcn/ui Components

The game uses shadcn/ui components. Install the CLI and add the required components:

Both Windows and Linux:
npm install -D @shadcn/ui
npx shadcn init

When prompted during the init process:

    Which style would you like to use? → Default
    Which color would you like to use as base color? → Slate
    Where is your tailwind.config.js located? → tailwind.config.ts
    Configure the import alias for components? → @/components
    Configure the import alias for utils? → @/lib/utils
    Are you using React Server Components? → Yes

Now add the specific components:
npx shadcn add switch
npx shadcn add label
npx shadcn add slider
Step 5: Create Required Directories

Make sure all necessary directories exist:

Windows:
mkdir components
mkdir context
mkdir public
mkdir public\sounds

Linux:
mkdir -p components
mkdir -p context
mkdir -p public/sounds
Step 6: Copy the Project Files

Now, copy all the code files from our conversation into their respective locations in your project directory. Make sure to maintain the correct file paths as shown in the code blocks.

For example:

    app/page.tsx should go in the app folder
    components/game-screen.tsx should go in the components folder
    etc.

Step 7: Add Sound Files

For the sound effects, you'll need to create placeholder MP3 files in the public/sounds directory:

Windows:
type nul > public\sounds\eat.mp3
type nul > public\sounds\danger.mp3
type nul > public\sounds\levelup.mp3
type nul > public\sounds\gameover.mp3
type nul > public\sounds\scream.mp3
type nul > public\sounds\ambient.mp3

Linux:
touch public/sounds/eat.mp3
touch public/sounds/danger.mp3
touch public/sounds/levelup.mp3
touch public/sounds/gameover.mp3
touch public/sounds/scream.mp3
touch public/sounds/ambient.mp3

For a better experience, you should replace these with actual sound files. You can find free game sound effects on websites like Freesound

.
Running the Project
Start the Development Server

Both Windows and Linux:
npm run dev

This will start the development server, typically on port 3000.
Access the Game

Open your web browser and navigate to:
http://localhost:3000
Troubleshooting Common Issues

    Port already in use: If port 3000 is already in use, Next.js will automatically try to use the next available port (like 3001).

    Missing dependencies: If you encounter errors about missing dependencies, run:

npm install
TypeScript errors: If you see TypeScript errors, they usually don't prevent the app from running in development mode. You can fix them gradually.
Sound not working: Make sure you have valid sound files in the public/sounds directory.

Permission issues (Linux): If you encounter permission issues on Linux, you might need to use sudo for some commands or fix directory permissions:

    sudo chown -R $(whoami) legendary-snake-game

Now you should have a fully functional Legendary Snake Game running on your system!
