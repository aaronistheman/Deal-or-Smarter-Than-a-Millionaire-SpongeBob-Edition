#!/bin/sh
#
# @pre The user has the string "<insert-contract>" in the place(s)
# where he/she wants the contractual skeleton to be generated.
# For example:
#
#   <insert-contract>
#   function mySpecialFunction() {
#       ...
#   }
#
# @post Each occurence of the string "<insert-contract>" has been
# replaced by a contractual skeleton. The above example would
# become the following:
#
#   /*
#       @pre
#       @post
#       @hasTest
#       @param
#       @returns
#       @throws
#   */
#   function mySpecialFunction() {
#       ...
#   }
#
# @param $1 name of the file to edit
# @example generate-contracts.sh mySpecialFunction.js

# Substitute the output for any occurence of the
# string "<insert-contract>"
sed -i "s~<insert-contract>~/*\n    @pre\n    @post\n    @hasTest\n    @param\n    @returns\n    @throws\n*/~" $1