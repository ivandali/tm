#!/bin/bash
for rec in `cat $HOME/Columbus*plan* | cut -d';' -f 1,2,3,5,6`
do
    ./geocode.sh `echo $rec` 
done