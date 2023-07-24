#! /bin/bash -

if [[ ! -e ../userdata/ege-user-data.json ]]; then
    echo {} > ../userdata/ege-user-data.json
fi

if [[ ! -e ../userdata/greeting-user-data.json ]]; then
    echo {"greetedMembers": \[\]} > ../userdata/greeting-user-data.json
fi