#!/bin/bash

ALL_FILES=(*)
PRODUCTION_FILES_LIST="productionfiles"



while read LINE
do
    for i in ${ALL_FILES[@]}
    do
        if [ $(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'<<<"${i}") == $(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'<<<"${LINE}") ] ; then
            ALL_FILES=("${ALL_FILES[@]/$i}")
        fi
    done
done < $PRODUCTION_FILES_LIST



for i in ${ALL_FILES[@]}
do
    rm -rf "$i"
done

echo "DEVELOPMENT FILES REMOVED"