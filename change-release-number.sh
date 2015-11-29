#!/bin/sh
#
# @pre release number in specified file is placed after the text
# "Release number: "
# @post release number has been changed in specified file
# @param $1 the old release number
# @param $2 the new release number
# @param $3 the file to edit
# @example ./change-release-number.sh 1.1 2.0 play.php

# Make the edit
sed -i "s~Release number: $1~Release number: $2~" $3