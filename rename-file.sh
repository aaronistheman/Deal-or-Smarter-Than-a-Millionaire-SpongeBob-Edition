#!/bin/sh
#
# @pre (optional) A file named open-my-files.bat exists in the same
# folder as this file.
# @post The file specified by the first argument has been given the name
# specified by the second argument, open-my-files.bat has been edited
# appropriately to open the correct file, and a Git commit announcing
# the former action has been created.
# @param $1 old/current name of the file
# @param $2 new name of the file
# @example rename-file.sh play.html play.php

# Rename the file
git mv $1 $2

# Edit the batch file that opens files (if applicable)
sed -i "s~$1~$2~" open-my-files.bat

# Unstage other changes
# git reset HEAD *

# Commit the change
# git add open-my-files.bat
# git rm $1
# git add $2
# git commit -m "Renamed file: $1 -> $2"