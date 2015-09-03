#!/bin/sh
#
# @pre There are uncommitted changes.
# @post A new Git commit announcing having cleaned up the code has been
# made.
# @param none
# @example did-cleanup.sh

git commit -am "Performed some cleanup"