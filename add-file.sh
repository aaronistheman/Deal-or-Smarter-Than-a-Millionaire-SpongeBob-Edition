#!/bin/sh
#
# @pre (optional) A file named open-my-files.bat exists in the same
# folder as this file.
# @post The desired file has been created, open-my-files.bat has been
# updated so that it will open the new file, and a new Git commit has been
# appropriately made. (Note that already-existing changes will be
# unstaged.)
# @param $1 name of the file to create.
# @example add-file.sh hello-world.txt

# Create the file
echo > $1

# Open the file
start Notepad++ $1

# Edit the batch file that opens files (if applicable)
sed -i "s~exit~start Notepad++ $1\nexit~" open-my-files.bat

# Unstage other changes
# git reset HEAD *

# Commit the additions
# git add $1
# git add open-my-files.bat
# git commit -m "Added new file: $1"