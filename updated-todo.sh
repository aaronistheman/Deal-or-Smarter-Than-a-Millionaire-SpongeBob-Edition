#!/bin/sh
#
# @pre The todo list, contained in a file named "todo-list.txt", has
# been updated.
# @post A Git commit noting the editing of the todo list has been created.
# @param none
# @example updated-todo.sh

# Make the commit
git add todo-list.txt
git commit -m "Updated todo list"