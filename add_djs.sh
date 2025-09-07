#!/bin/bash

# Script to add all 106 DJs to the database

# Function to add a DJ
add_dj() {
    local stage_name="$1"
    local real_name="$2"
    local nationality="$3"
    local biography="$4"
    local genres="$5"
    local record_label="$6"
    local debut_year="$7"
    local total_appearances="$8"
    local years_active="$9"
    local rarity="${10}"
    local category="${11}"
    local categories="${12}"

    curl -X POST "http://localhost:3000/api/admin/djs/" \
        -H "Content-Type: application/json" \
        -d "{
            \"stage_name\": \"$stage_name\",
            \"real_name\": \"$real_name\",
            \"nationality\": \"$nationality\",
            \"biography\": \"$biography\",
            \"genres\": [$genres],
            \"record_label\": \"$record_label\",
            \"debut_year\": $debut_year,
            \"total_appearances\": $total_appearances,
            \"years_active\": $years_active,
            \"rarity\": \"$rarity\",
            \"social_links\": {},
            \"is_featured\": false,
            \"category\": \"$category\",
            \"categories\": [$categories]
        }"
    echo ""
}

# Add all DJs
add_dj "Above & Beyond" "Jono Grant, Tony McGuinness, Paavo Siljamäki" "British" "The emotional leaders of modern trance. Known for their deep, melodic sound and the iconic Group Therapy radio show." "\"Trance\", \"Progressive Trance\", \"Uplifting Trance\", \"Ambient\"" "Anjunabeats" 2004 12 20 "LEGENDARY" "mainstage" "\"asot\""

add_dj "Acraze" "Acraze" "American" "Rising DJ and producer known for his energetic performances and viral hits." "\"House\", \"Tech House\", \"Bass House\"" "Spinnin' Records" 2020 3 4 "RARE" "mainstage" "\"mainstage\""

add_dj "Adam Beyer" "Adam Beyer" "Swedish" "The techno king and Drumcode boss. A leading figure in modern techno and the founder of one of the most influential techno labels." "\"Techno\", \"Minimal Techno\", \"Tech House\", \"Industrial Techno\"" "Drumcode" 1999 10 25 "EPIC" "mainstage" "\"core\""

add_dj "Adriatique" "Adrian Shala, Adrian Schweizer" "Swiss" "Melodic techno stars known for their emotional, cinematic sound and Siamese label." "\"Melodic Techno\", \"Deep House\", \"Progressive House\", \"Minimal House\"" "Siamese" 2012 6 12 "UNCOMMON" "mainstage" "\"core\", \"elixir\""

add_dj "Afrojack" "Nick van de Wall" "Dutch" "Dutch DJ and producer, founder of Wall Recordings." "\"Big Room\", \"Electro House\", \"Future Bass\"" "Wall Recordings" 2010 9 14 "EPIC" "mainstage" "\"mainstage\""

add_dj "Alesso" "Alessandro Lindblad" "Swedish" "Swedish DJ and record producer known for melodic progressive house tracks and Tomorrowland performances. Collaborated with Swedish House Mafia." "\"Progressive House\", \"Big Room\", \"Electro House\"" "Refune Music" 2010 10 14 "EPIC" "mainstage" "\"mainstage\""

add_dj "Aly & Fila" "Aly Amr Fathalah, Fadi Wassef Naguib" "Egyptian" "Egyptian trance duo known for their uplifting, emotional sound and Future Sound of Egypt radio show." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "FSOE Recordings" 2004 8 20 "RARE" "mainstage" "\"asot\""

add_dj "Amelie Lens" "Amelie Lens" "Belgian" "A leading force in the new wave of techno. Known for her high-energy sets and dark, industrial sound." "\"Techno\", \"Industrial Techno\", \"Dark Techno\", \"Acid Techno\"" "Lenske" 2016 8 8 "EPIC" "mainstage" "\"core\""

add_dj "ANNA" "Anna Miranda" "Brazilian" "Techno powerhouse from Brazil known for her dark, industrial sound and Drumcode releases." "\"Techno\", \"Industrial Techno\", \"Dark Techno\", \"Acid Techno\"" "Drumcode" 2016 5 8 "UNCOMMON" "mainstage" "\"core\""

add_dj "Andrew Rayel" "Andrew Rayel" "Moldovan" "Moldovan trance producer known for his uplifting sound and Armada Music releases." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Armada Music" 2012 6 12 "COMMON" "mainstage" "\"asot\""

add_dj "Angerfist" "Danny Masseling" "Dutch" "Dutch hardcore king known for his aggressive sound and Master of Hardcore releases." "\"Hardcore\", \"Hardstyle\", \"Rawstyle\", \"Hard Dance\"" "Master of Hardcore" 2009 6 15 "COMMON" "mainstage" "\"qdance\""

add_dj "Anyma" "Matteo Milleri" "Italian" "The visual and sonic futuristic project. Known for his cinematic, otherworldly performances." "\"Melodic Techno\", \"Progressive House\", \"Ambient\", \"Cinematic\"" "Afterlife" 2018 4 6 "UNCOMMON" "mainstage" "\"core\""

add_dj "Apashe" "Apashe" "Canadian" "Canadian producer known for his live brass orchestra bass music and cinematic sound." "\"Bass Music\", \"Trap\", \"Electronic\", \"Orchestral\"" "Kannibalen Records" 2018 3 6 "COMMON" "mainstage" "\"liveact\""

add_dj "Armin van Buuren" "Armin van Buuren" "Dutch" "Dutch trance legend and producer, host of the iconic A State of Trance radio show." "\"Trance\", \"Progressive House\", \"Uplifting Trance\"" "Armada Music" 2005 18 19 "LEGENDARY" "mainstage" "\"mainstage\", \"asot\""

add_dj "Axwell /\\ Ingrosso" "Axwell, Sebastian Ingrosso" "Swedish" "Swedish DJ duo, former members of Swedish House Mafia. Known for their progressive house sound and Tomorrowland performances." "\"Progressive House\", \"Electro House\", \"Big Room\"" "Axtone Records" 2014 8 10 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Bassjackers" "Ralph van Hilst, Marlon Flohr" "Dutch" "Dutch big room duo known for their energetic sound and festival performances." "\"Big Room\", \"Progressive House\", \"Electro House\", \"Future Bass\"" "Spinnin' Records" 2012 6 12 "COMMON" "mainstage" "\"qdance\""

add_dj "Bedouin" "Bedouin" "American" "Melodic house and techno nomads known for their emotional, cinematic sound." "\"Melodic House\", \"Melodic Techno\", \"Deep House\", \"Progressive House\"" "Crosstown Rebels" 2016 5 8 "COMMON" "mainstage" "\"elixir\""

add_dj "Ben Nicky" "Ben Nicky" "British" "British trance DJ known for his hyper-energy trance sound and energetic performances." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Hard Trance\"" "Armada Music" 2014 5 10 "COMMON" "mainstage" "\"asot\""

add_dj "Black Coffee" "Nkosinathi Innocent Maphumulo" "South African" "Grammy-winning deep house icon from South Africa. Known for his soulful, African-influenced sound." "\"Deep House\", \"Afro House\", \"Soulful House\", \"Progressive House\"" "Soulistic Music" 2004 6 20 "RARE" "mainstage" "\"elixir\""

add_dj "Brennan Heart" "Fabian Bohn" "Dutch" "Hardstyle heavyweight and We R Music founder. Known for his emotional, melodic hardstyle." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "We R Music" 2009 7 15 "UNCOMMON" "mainstage" "\"qdance\""

add_dj "CamelPhat" "Dave Whelan, Mike Di Scala" "British" "Grammy-nominated melodic house/techno duo known for their emotional, cinematic sound." "\"Melodic House\", \"Melodic Techno\", \"Deep House\", \"Progressive House\"" "When Stars Align" 2014 6 10 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Carl Cox" "Carl Cox" "British" "The techno godfather and global ambassador of electronic music. A true legend with 35+ years of influence." "\"Techno\", \"House\", \"Acid House\", \"Tech House\"" "Intec Digital" 1989 18 35 "LEGENDARY" "mainstage" "\"core\""

add_dj "Charlotte de Witte" "Charlotte de Witte" "Belgian" "Belgian techno queen known for her high-energy sets and KNTXT label." "\"Techno\", \"Industrial Techno\", \"Dark Techno\"" "KNTXT" 2015 8 9 "EPIC" "mainstage" "\"core\""

add_dj "Chris Lake" "Chris Lake" "British" "The tech house hitmaker and label boss. Known for his consistent production and Black Book Records label." "\"Tech House\", \"Deep House\", \"Bass House\", \"Progressive House\"" "Black Book Records" 2009 8 15 "RARE" "mainstage" "\"elixir\""

add_dj "Claptone" "Unknown" "German" "The enigmatic house music phenomenon. Known for his mysterious persona and deep, melodic house sound." "\"Deep House\", \"Tech House\", \"Minimal House\", \"Disco House\"" "Clap Music" 2014 7 10 "RARE" "mainstage" "\"elixir\""

add_dj "Coone" "Koen Bauweraerts" "Belgian" "Hardstyle legend and Dirty Workz founder. Known for his energetic, crowd-pleasing hardstyle." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Dirty Workz" 2009 8 15 "UNCOMMON" "mainstage" "\"qdance\""

add_dj "Cosmic Gate" "Nic Chagall, Bossi" "German" "German trance duo known for their uplifting sound and Wake Your Mind label." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Wake Your Mind" 2004 7 20 "COMMON" "mainstage" "\"asot\""

add_dj "Da Tweekaz" "Marcus van der Berg, Sven van der Berg" "Norwegian" "Happy hardcore heroes known for their fun, energetic sound and crowd interaction." "\"Happy Hardcore\", \"Hardstyle\", \"Hardcore\", \"Hard Dance\"" "Hard With Style" 2012 6 12 "UNCOMMON" "mainstage" "\"qdance\""

add_dj "Danny Avila" "Danny Avila" "Spanish" "Spanish DJ and producer known for his progressive house sound and Tomorrowland performances. Youngest DJ to play mainstage." "\"Progressive House\", \"Big Room\", \"Electro House\"" "Spinnin' Records" 2011 5 13 "EPIC" "mainstage" "\"mainstage\""

add_dj "D-Block & S-te-Fan" "Diederik Bakker, Stefan van Leewen" "Dutch" "Hardstyle innovators known for their melodic, emotional sound and Scantraxx releases." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Scantraxx" 2009 7 15 "UNCOMMON" "mainstage" "\"qdance\""

add_dj "deadmau5" "Joel Zimmerman" "Canadian" "Canadian DJ and producer known for his progressive house sound and Mau5trap label." "\"Progressive House\", \"Techno\", \"Electro House\", \"Experimental\"" "Mau5trap" 2009 4 15 "COMMON" "mainstage" "\"liveact\""

add_dj "Deborah de Luca" "Deborah de Luca" "Italian" "Italian techno producer known for her dark, industrial sound and Sola Records releases." "\"Techno\", \"Industrial Techno\", \"Dark Techno\", \"Acid Techno\"" "Sola Records" 2016 4 8 "COMMON" "mainstage" "\"core\""

add_dj "David Guetta" "Pierre David Guetta" "French" "French DJ and record producer, one of the most successful DJs in the world. Known for hits like 'Titanium' and 'When Love Takes Over'. Grammy Award winner and Tomorrowland mainstage regular." "\"House\", \"Electro House\", \"Progressive House\"" "What A Music" 1987 15 37 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Dimitri Vegas & Like Mike" "Dimitri Thivaios, Michael Thivaios" "Belgian" "Belgian DJ duo and brothers known for their explosive energy and Tomorrowland residency." "\"Big Room\", \"Progressive House\", \"Electro House\"" "Smash The House" 2010 15 14 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Dixon" "Dixon" "German" "German DJ known for his melodic house and techno sound and Innervisions label." "\"Melodic House\", \"Melodic Techno\", \"Deep House\", \"Progressive House\"" "Innervisions" 2009 6 15 "COMMON" "mainstage" "\"elixir\""

add_dj "Don Diablo" "Don Pepijn Schipper" "Dutch" "Dutch DJ and producer, pioneer of the future house genre." "\"Future House\", \"Progressive House\", \"Future Bass\"" "Hexagon" 2016 4 8 "EPIC" "mainstage" "\"mainstage\""

add_dj "DVBBS" "Alexandre van den Hoef, Christopher van den Hoef" "Canadian" "Canadian DJ duo known for their energetic performances and big room sound. Regulars at Tomorrowland and founders of Kanary Records." "\"Big Room\", \"Electro House\", \"Trap\"" "Kanary Records" 2012 6 12 "EPIC" "mainstage" "\"mainstage\""

add_dj "Enrico Sangiuliano" "Enrico Sangiuliano" "Italian" "Italian techno producer known for his dark, industrial sound and Drumcode releases." "\"Techno\", \"Minimal Techno\", \"Industrial Techno\", \"Acid Techno\"" "Drumcode" 2014 5 10 "COMMON" "mainstage" "\"core\""

add_dj "Eric Prydz" "Eric Sheridan Prydz" "Swedish" "The visionary behind Pryda, Cirez D, and his epic HOLO show. A true innovator in progressive electronic music." "\"Progressive House\", \"Techno\", \"Ambient\", \"Melodic Techno\"" "Mouseville Records" 2004 12 20 "LEGENDARY" "mainstage" "\"mainstage\", \"core\", \"liveact\""

add_dj "Ferry Corsten" "Ferry Corsten" "Dutch" "Dutch trance legend known for his uplifting sound and Flashover Recordings label." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Flashover Recordings" 1999 8 25 "COMMON" "mainstage" "\"asot\""

add_dj "Fisher" "Paul Nicholas Fisher" "Australian" "The tech house superstar known for his high-energy sets and viral hits. A rising star in the house music scene." "\"Tech House\", \"Deep House\", \"Minimal House\", \"Bass House\"" "Catch & Release" 2018 5 6 "RARE" "mainstage" "\"elixir\""

add_dj "Fred again.." "Frederick John Philip Gibson" "British" "The genre-blending critical darling known for his innovative sound and viral hits." "\"Future Bass\", \"Garage\", \"House\", \"Experimental\"" "Atlantic Records" 2018 4 6 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Gareth Emery" "Gareth Emery" "British" "British trance producer known for his melodic sound and Garuda Music label." "\"Trance\", \"Progressive Trance\", \"Uplifting Trance\", \"Vocal Trance\"" "Garuda Music" 2009 6 15 "COMMON" "mainstage" "\"asot\""

add_dj "Gesaffelstein" "Mike Lévy" "French" "French techno producer known for his dark, industrial sound and experimental approach." "\"Techno\", \"Industrial Techno\", \"Dark Techno\", \"Experimental\"" "Bromance Records" 2014 4 10 "COMMON" "mainstage" "\"core\", \"liveact\""

add_dj "Giuseppe Ottaviani" "Giuseppe Ottaviani" "Italian" "Italian trance producer known for his live trance performances and Black Hole releases." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Black Hole Recordings" 2009 6 15 "COMMON" "mainstage" "\"asot\""

add_dj "Goodboys" "Goodboys" "British" "British deep house duo known for their melodic sound and commercial success." "\"Deep House\", \"Tech House\", \"Progressive House\", \"Future Bass\"" "Spinnin' Records" 2018 4 6 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Gorgon City" "Kye Gibbon, Matt Robson-Scott" "British" "British deep house duo known for their melodic sound and Black Butter Records label." "\"Deep House\", \"Tech House\", \"Progressive House\", \"Future Bass\"" "Black Butter Records" 2014 5 10 "COMMON" "mainstage" "\"elixir\""

add_dj "Hardwell" "Robbert van de Corput" "Dutch" "Dutch DJ and producer, founder of Revealed Recordings." "\"Big Room\", \"Progressive House\", \"Electro House\"" "Revealed Recordings" 2011 8 13 "EPIC" "mainstage" "\"mainstage\""

add_dj "Headhunterz" "Willem Rebergen" "Dutch" "Hardstyle legend and one of the most influential figures in the genre. Known for his melodic, emotional hardstyle." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Art of Creation" 2009 8 15 "RARE" "mainstage" "\"qdance\""

add_dj "James Hype" "James Hype" "British" "The technical drill house king known for his high-energy sets and technical skills." "\"Tech House\", \"Bass House\", \"Drill House\", \"Future House\"" "Fool Me Once" 2016 5 8 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Jamie Jones" "Jamie Jones" "Welsh" "The cool king of tech house and Paradise boss. Known for his underground sound and Hot Creations label." "\"Tech House\", \"Deep House\", \"Minimal House\", \"Progressive House\"" "Hot Creations" 2009 7 15 "RARE" "mainstage" "\"elixir\""

add_dj "John O'Callaghan" "John O'Callaghan" "Irish" "Irish trance producer known for his uplifting sound and Armada Music releases." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Armada Music" 2009 5 15 "COMMON" "mainstage" "\"asot\""

add_dj "John Summit" "John Summit" "American" "The tech house phenomenon of the 2020s known for his viral hits and energetic performances." "\"Tech House\", \"Deep House\", \"Bass House\", \"Progressive House\"" "Off The Grid" 2018 4 6 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Joris Voorn" "Joris Voorn" "Dutch" "Dutch techno and house aesthete known for his melodic sound and Rejected label." "\"Techno\", \"Deep House\", \"Progressive House\", \"Minimal House\"" "Rejected" 2009 6 15 "COMMON" "mainstage" "\"elixir\""

add_dj "Justice" "Gaspard Augé, Xavier de Rosnay" "French" "French electronic duo known for their innovative sound and Ed Banger Records releases." "\"Electronic\", \"French House\", \"Electro\", \"Experimental\"" "Ed Banger Records" 2009 4 15 "COMMON" "mainstage" "\"liveact\""

add_dj "Kayzo" "Hayden Capuozzo" "American" "American DJ and producer known for his heavy dubstep and hardstyle fusion." "\"Dubstep\", \"Hardstyle\", \"Trap\", \"Bass Music\"" "Monstercat" 2016 4 8 "COMMON" "mainstage" "\"qdance\""

add_dj "KSHMR" "Niles Hollowell-Dhar" "American" "American DJ and producer known for his cinematic and orchestral approach to electronic music. Tomorrowland regular and founder of Dharma Worldwide." "\"Big Room\", \"Progressive House\", \"Electro House\"" "Dharma Worldwide" 2014 7 10 "EPIC" "mainstage" "\"mainstage\""

add_dj "Loco Dice" "Loco Dice" "German" "German tech house and techno royalty known for his underground sound and Desolat label." "\"Tech House\", \"Deep House\", \"Minimal House\", \"Progressive House\"" "Desolat" 2009 6 15 "COMMON" "mainstage" "\"elixir\""

add_dj "Lost Frequencies" "Felix De Laet" "Belgian" "Belgian deep house producer known for his melodic, tropical sound and Found Frequencies label." "\"Deep House\", \"Progressive House\", \"Future Bass\", \"Tropical House\"" "Found Frequencies" 2016 5 8 "RARE" "mainstage" "\"elixir\""

add_dj "Maceo Plex" "Maceo Plex" "Spanish" "Spanish techno and house producer known for his melodic sound and Ellum Audio label." "\"Techno\", \"Deep House\", \"Progressive House\", \"Minimal House\"" "Ellum Audio" 2012 5 12 "COMMON" "mainstage" "\"core\""

add_dj "Maddix" "Maddix" "Dutch" "The high-energy mainstage weapon known for his explosive sound and festival performances." "\"Big Room\", \"Progressive House\", \"Electro House\", \"Future Rave\"" "Revealed Recordings" 2016 5 8 "UNCOMMON" "mainstage" "\"mainstage\""

add_dj "Malaa" "Malaa" "French" "French DJ and producer known for his deep house sound and mysterious persona." "\"Deep House\", \"Tech House\", \"Bass House\", \"Future House\"" "Confession" 2016 5 8 "COMMON" "mainstage" "\"elixir\""

add_dj "Marco Carola" "Marco Carola" "Italian" "Italian techno legend known for his minimal sound and Music On label." "\"Techno\", \"Minimal Techno\", \"Deep Techno\", \"Progressive House\"" "Music On" 2004 6 20 "COMMON" "mainstage" "\"elixir\""

add_dj "MarLo" "MarLo" "Dutch" "Dutch trance producer known for his uplifting sound and Armada Music releases." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Armada Music" 2014 5 10 "COMMON" "mainstage" "\"asot\""

add_dj "Markus Schulz" "Markus Schulz" "German" "German trance producer known for his uplifting sound and Coldharbour Recordings label." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Coldharbour Recordings" 2004 7 20 "COMMON" "mainstage" "\"asot\""

add_dj "Martin Garrix" "Martijn Garritsen" "Dutch" "Dutch DJ and producer who became the youngest DJ to reach #1 in DJ Mag Top 100." "\"Big Room\", \"Progressive House\", \"Future Bass\"" "STMPD RCRDS" 2013 12 11 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Mathame" "Amedeo Giovanelli, Matteo Giovanelli" "Italian" "Italian melodic techno duo known for their emotional sound and Afterlife releases." "\"Melodic Techno\", \"Progressive House\", \"Deep House\", \"Ambient\"" "Afterlife" 2018 4 6 "COMMON" "mainstage" "\"core\""

add_dj "Miss Monique" "Miss Monique" "Ukrainian" "Ukrainian DJ and producer known for her melodic progressive house sound." "\"Progressive House\", \"Melodic Techno\", \"Deep House\", \"Ambient\"" "Siona Records" 2018 4 6 "UNCOMMON" "mainstage" "\"core\""

add_dj "Nervo" "Miriam Nervo, Olivia Nervo" "Australian" "Australian DJ duo known for their big room sound and commercial success." "\"Big Room\", \"Progressive House\", \"Electro House\", \"Future Bass\"" "Spinnin' Records" 2012 6 12 "COMMON" "mainstage" "\"qdance\""

add_dj "Nicky Romero" "Nick Rotteveel" "Dutch" "Dutch DJ and record producer, founder of Protocol Recordings. Known for his progressive house sound and Tomorrowland performances." "\"Progressive House\", \"Big Room\", \"Electro House\"" "Protocol Recordings" 2009 11 15 "EPIC" "mainstage" "\"mainstage\""

add_dj "Nina Kraviz" "Nina Kraviz" "Russian" "The influential techno artist and label owner known for her unique sound and трип label." "\"Techno\", \"Minimal Techno\", \"Deep Techno\", \"Experimental\"" "трип" 2012 6 12 "UNCOMMON" "mainstage" "\"core\""

add_dj "Nora En Pure" "Daniela Di Lillo" "Swiss" "The purveyor of deep house known for her melodic, tropical sound and Enormous Tunes releases." "\"Deep House\", \"Progressive House\", \"Melodic House\", \"Tropical House\"" "Enormous Tunes" 2014 5 10 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Oliver Heldens" "Oliver Heldens" "Dutch" "Dutch DJ and producer known for pioneering the future house sound. Regular at Tomorrowland and major festivals worldwide." "\"Future House\", \"Deep House\", \"Tech House\"" "Heldeep Records" 2013 9 11 "EPIC" "mainstage" "\"mainstage\""

add_dj "Pan-Pot" "Tassilo Ippenberger, Thomas Benedix" "German" "German techno duo known for their minimal sound and Mobilee Records releases." "\"Techno\", \"Minimal Techno\", \"Deep Techno\", \"Industrial Techno\"" "Mobilee Records" 2012 5 12 "COMMON" "mainstage" "\"core\""

add_dj "Paul Oakenfold" "Paul Oakenfold" "British" "British trance legend known for his uplifting sound and Perfecto Records label." "\"Trance\", \"Progressive Trance\", \"Uplifting Trance\", \"Vocal Trance\"" "Perfecto Records" 1999 6 25 "COMMON" "mainstage" "\"asot\""

add_dj "Paul van Dyk" "Matthias Paul" "German" "Trance legend and pioneer who helped define the genre. One of the most respected figures in electronic music." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Vandit Records" 1994 16 30 "LEGENDARY" "mainstage" "\"asot\""

add_dj "Peggy Gou" "Peggy Gou" "South Korean" "A global fashion and music icon. Known for her disco-influenced house sound and Gudu Records label." "\"Deep House\", \"Disco House\", \"Tech House\", \"Minimal House\"" "Gudu Records" 2018 4 6 "RARE" "mainstage" "\"elixir\""

add_dj "Quintino" "Quintino van Werkhoven" "Dutch" "Dutch DJ and producer known for his big room sound and Tomorrowland performances. Spinnin' Records artist." "\"Big Room\", \"Electro House\", \"Progressive House\"" "Spinnin' Records" 2009 8 15 "EPIC" "mainstage" "\"mainstage\""

add_dj "Rank 1" "Benno de Goeij, Piet Bervoets" "Dutch" "Dutch trance duo known for their uplifting sound and Armada Music releases." "\"Trance\", \"Uplifting Trance\", \"Progressive Trance\", \"Vocal Trance\"" "Armada Music" 2009 5 15 "COMMON" "mainstage" "\"asot\""

add_dj "Reinier Zonneveld" "Reinier Zonneveld" "Dutch" "Live techno maestro known for his live performances and Filth on Acid label." "\"Live Techno\", \"Industrial Techno\", \"Acid Techno\", \"Minimal Techno\"" "Filth on Acid" 2016 4 8 "UNCOMMON" "mainstage" "\"core\""

add_dj "Richie Hawtin" "Richard Hawtin" "Canadian" "The minimalist techno innovator and pioneer of minimal electronic music. A true visionary in the underground scene." "\"Minimal Techno\", \"Techno\", \"Ambient\", \"Experimental\"" "Minus" 1994 14 30 "LEGENDARY" "mainstage" "\"core\""

add_dj "Robin Schulz" "Robin Schulz" "German" "German deep house producer known for his tropical, melodic sound and commercial success." "\"Deep House\", \"Tropical House\", \"Progressive House\", \"Future Bass\"" "Warner Music" 2014 6 10 "RARE" "mainstage" "\"elixir\""

add_dj "Sara Landry" "Sara Landry" "American" "Rising techno star known for her dark, industrial sound and energetic performances." "\"Techno\", \"Industrial Techno\", \"Dark Techno\", \"Acid Techno\"" "KNTXT" 2020 3 4 "UNCOMMON" "mainstage" "\"core\""

add_dj "Sebastian Ingrosso" "Sebastian Ingrosso" "Swedish" "Swedish DJ and producer, former member of Swedish House Mafia. Known for his melodic progressive house and founder of Refune Records." "\"Progressive House\", \"Electro House\", \"Big Room\"" "Refune Records" 2001 14 23 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Showtek" "Wouter Janssen, Sjoerd Janssen" "Dutch" "Dutch duo known for their hardstyle roots and big room evolution." "\"Hardstyle\", \"Big Room\", \"Progressive House\", \"Electro House\"" "Skink Records" 2009 8 15 "COMMON" "mainstage" "\"qdance\""

add_dj "Solomun" "Mladen Solomun" "Bosnian-German" "The melodic deep house and techno don. Known for his emotional, melodic sound and Diynamic Music label." "\"Deep House\", \"Melodic Techno\", \"Progressive House\", \"Minimal House\"" "Diynamic Music" 2009 8 15 "EPIC" "mainstage" "\"elixir\", \"core\""

add_dj "Steve Aoki" "Steven Hiroyuki Aoki" "American" "American DJ, record producer, and music executive. Founder of Dim Mak Records and known for his energetic performances and cake-throwing antics at Tomorrowland." "\"Electro House\", \"Big Room\", \"Trap\"" "Dim Mak Records" 1996 12 28 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Steve Angello" "Steven Angello" "Swedish" "Swedish DJ and producer, former member of Swedish House Mafia. Known for his progressive house sound and founder of Size Records." "\"Progressive House\", \"Electro House\", \"Big Room\"" "Size Records" 2004 12 20 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "Sub Zero Project" "Sub Zero Project" "Dutch" "Dutch hardstyle duo known for their innovative sound and Roughstate releases." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Roughstate" 2012 6 12 "COMMON" "mainstage" "\"qdance\""

add_dj "Subtronics" "Jesse Kardon" "American" "The leader of the modern riddim movement known for his heavy, experimental sound." "\"Riddim\", \"Dubstep\", \"Bass Music\", \"Experimental\"" "Cyclops Recordings" 2018 4 6 "UNCOMMON" "mainstage" "\"liveact\""

add_dj "Sven Väth" "Sven Väth" "German" "The techno shaman and Cocoon icon. A legendary figure in the German electronic music scene." "\"Techno\", \"Trance\", \"Progressive House\", \"Ambient\"" "Cocoon Recordings" 1989 13 35 "LEGENDARY" "mainstage" "\"core\""

add_dj "Swedish House Mafia" "Axwell, Steve Angello, Sebastian Ingrosso" "Swedish" "Swedish DJ supergroup consisting of Axwell, Steve Angello, and Sebastian Ingrosso. One of the most influential electronic music groups and Tomorrowland headliners." "\"Progressive House\", \"Electro House\", \"Big Room\"" "Axtone Records" 2008 10 16 "LEGENDARY" "mainstage" "\"mainstage\", \"liveact\""

add_dj "Tale Of Us" "Carmine Conte, Matteo Milleri" "Italian" "The architects of the melodic, cinematic Afterlife sound. Known for their emotional, visual performances." "\"Melodic Techno\", \"Progressive House\", \"Ambient\", \"Cinematic\"" "Afterlife" 2012 7 12 "EPIC" "mainstage" "\"core\""

add_dj "Tchami" "Martin Bresso" "French" "Future house pioneer known for his innovative sound and Confession label." "\"Future House\", \"Deep House\", \"Tech House\", \"Bass House\"" "Confession" 2014 6 10 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "The Chainsmokers" "Alex Pall, Drew Taggart" "American" "American DJ duo known for their crossover hits blending electronic music with pop. Grammy Award winners and Tomorrowland headliners." "\"Electronic\", \"Pop\", \"Future Bass\"" "Disruptor Records" 2012 8 12 "LEGENDARY" "mainstage" "\"mainstage\""

add_dj "The Chemical Brothers" "Tom Rowlands, Ed Simons" "British" "Live electronic music legends who pioneered the big beat genre. A cultural institution in electronic music." "\"Big Beat\", \"Electronic\", \"Ambient\", \"Experimental\"" "Virgin Records" 1994 6 30 "LEGENDARY" "mainstage" "\"liveact\""

add_dj "The Martinez Brothers" "Chris Martinez, Steve Martinez" "American" "American house music duo known for their tech house sound and Cuttin' Headz label." "\"Tech House\", \"Deep House\", \"Minimal House\", \"Progressive House\"" "Cuttin' Headz" 2012 5 12 "COMMON" "mainstage" "\"elixir\""

add_dj "Tiësto" "Tijs Michiel Verwest" "Dutch" "Dutch DJ and record producer, often called the 'Godfather of EDM'. First DJ to perform at the Olympics opening ceremony. Multiple Tomorrowland headliner." "\"Trance\", \"Progressive House\", \"Big Room\"" "Musical Freedom" 1994 18 30 "LEGENDARY" "mainstage" "\"mainstage\", \"asot\""

add_dj "Timmy Trumpet" "Timothy Jude Smith" "Australian" "Australian DJ and trumpeter known for incorporating live trumpet into his electronic performances. Tomorrowland regular." "\"Big Room\", \"Electro House\", \"Brass House\"" "Spinnin' Records" 2010 6 14 "EPIC" "mainstage" "\"mainstage\""

add_dj "Underworld" "Karl Hyde, Rick Smith" "British" "British electronic music pioneers known for their experimental sound and cult status." "\"Electronic\", \"Ambient\", \"Experimental\", \"Techno\"" "Underworld Records" 1994 4 30 "COMMON" "mainstage" "\"liveact\""

add_dj "Vintage Culture" "Lukas Ruiz" "Brazilian" "Brazilian house music superstar known for his melodic, tropical sound and Só Track Boa label." "\"Deep House\", \"Progressive House\", \"Melodic House\", \"Tropical House\"" "Só Track Boa" 2016 5 8 "UNCOMMON" "mainstage" "\"elixir\""

add_dj "Vini Vici" "Aviram Saharai, Matan Kadosh" "Israeli" "Israeli psytrance duo known for their high-energy trance performances and Tomorrowland appearances. Psytrance pioneers." "\"Psytrance\", \"Progressive Trance\"" "Armada Music" 2014 4 10 "EPIC" "mainstage" "\"mainstage\""

add_dj "W&W" "Willem van Hanegem, Wardt van der Harst" "Dutch" "Dutch DJ duo known for their big room sound and energetic performances. Regulars at Tomorrowland mainstage and founders of Rave Culture." "\"Big Room\", \"Electro House\", \"Trance\"" "Rave Culture" 2007 13 17 "EPIC" "mainstage" "\"mainstage\""

add_dj "Wildstylez" "Wildstylez" "Dutch" "Dutch hardstyle producer known for his euphoric sound and Scantraxx releases." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Scantraxx" 2012 6 12 "COMMON" "mainstage" "\"qdance\""

add_dj "Zatox" "Zatox" "Italian" "Italian hardstyle producer known for his energetic sound and Zatox Records label." "\"Hardstyle\", \"Euphoric Hardstyle\", \"Rawstyle\", \"Hardcore\"" "Zatox Records" 2012 6 12 "COMMON" "mainstage" "\"qdance\""

add_dj "999999999" "999999999" "Unknown" "Mysterious techno collective known for their experimental sound and underground performances." "\"Techno\", \"Industrial Techno\", \"Experimental\", \"Dark Techno\"" "Unknown" 2018 2 6 "RARE" "mainstage" "\"core\""

echo "All 106 DJs added successfully!"
