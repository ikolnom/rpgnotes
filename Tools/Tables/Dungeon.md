```perhaps
title
	Background
output
	This place is [background]. The theme is [theme.selectUnique(2)], often described as [adjective.selectUnique(2)]. The environment is [environment] ([adjective.selectUnique(2)]) and the danger is [danger].
background
	an ancient temple
	a bandit hide-out
	a treasure horde {untouched|slightly looted|almost empty}
	a long forgotten {city|village}
	a gateway into a new, strange place
	a thriving underground society
	an abandoned compound
	a mining complex
	a faction hq
	a remote jail
	a secret religious sect
	a long sealed tomb
	a burial ground
	a watchtower
	a fortress
theme
	love
	curiosity
	hunger
	greed
	loneliness
	duty
	cowardice
	hatred
	playfulness
	recklessness
	fear
	test
	help
	grief
	study
	rejection
	pilgrimage
	curse
	prophecy
	on-the-run
	opportunism
adjective
	Flaming
	Ancient
	Opulent
	Dark
	Fatalistic
	Desolate
	Bright
	Organic
	Angelic
	Sacred
	Lifeless
	Black
	Mysterious
	Glass
	Fleshy
	Austere
	Calm
	Familial
	Silent
	Warm
	Friendly
	Sinister
	Loud
	Out of place
environment
	underground
	indoors
	outdoors
	urban
	aquatic
	mountain
	coastal
event
	Assassination
	Welcome
	Betrayal
	Communication
	Escape
	Exchange
	Sabotage
	Hostage
	Fight
	Avenging
	Vengeance
	Infiltration
	Intimidation
	Takeover
	Kidnapping
	Ritual
	Chase
	Scam
	Heist
	Destruction
group
	Assassins
	Bandits
	Brainwashed
	Conquerors
	Cultists
	Explorers
	Gang
	Law Enforcement
	Mages
	Mercenaries
	Merchants
	Military
	Refugees
	Religious
	Scientists
	Scouts
	Slavers
	Spies
	Transport Service
	Treasure Hunters
item
	{creator|owner} is important
	{true|false} power
	material value
	storied
	attraction
	heirloom
	
danger
	a beast 
	an event ([event])
	humans ([group])
	a creature
	an item ([item])
	magic 
```
```perhaps
title
	Room
output
	[size] sized [shape] shaped room, with {{1-3} exits^2|stairs^0.5|{1-2} exits and stairs^0.25 } and {1-3} levels, featuring [encounter]. This room seems to have been a [function]
size
	closet^0.5
	small
	medium^2
	large
	collosal^0.5
encounter
	a trap
	a monster
	a lore drop ([lore drop])
	a treasure + monster
	a treasure
	a clue
	a boss^0.25
	an event ([event])
shape
	circular
	straight
	T
	plus
	box
function
	{barracks|bedroom|quarters}
	{library|office|meeting room}
	{forge|smithy|workshop}
	{kitchen|mess hall|pantry}
	{storage|backroom|service area}
	{hallway|cooridor}
	undeveloped/unfinished room
	ritual area
lore drop
	{history|origin}
	{conflict|faction}
	{npc|lost adventurer}
	{magic|supernatural}
	something relevant to a player's goals
	something new but ongoing
event
	Assassination
	Welcome
	Betrayal
	Communication
	Escape
	Exchange
	Sabotage
	Hostage
	Fight
	Avenging
	Vengeance
	Infiltration
	Intimidation
	Takeover
	Kidnapping
	Ritual
	Chase
	Scam
	Heist
	Destruction
```
```perchance
title
	Easy Encounter
output
	{2-5} enemies with hp: {2-6}, morale {2d6}, attack [atk] and armor [armor]
atk
	d4
	d6
	d8^0.25
armor
	-0
	-d2^0.25
```
```perchance
title
	Treasure
output
	{[mundane_artifact]|[strange_artifact]|[treasure]}
adjective
	Flaming
	Ancient
	Opulent
	Dark
	Fatalistic
	Desolate
	Bright
	Organic
	Angelic
	Sacred
	Lifeless
	Black
	Mysterious
	Glass
	Fleshy
	Austere
	Calm
	Familial
	Silent
	Warm
	Friendly
	Sinister
	Loud
	Out of place
	
mundane_artifact
	Book ([books])
	Key and Note, ([adjective.selectUnique(2)])
	{leather|fur} {cap|boots|greaves|pouch}
	{1-6} alchemical herbs, ({healing|poison})
	Robes/Clothes
	Rings/Jewelry
	{1-6} torches
	{1-3} flasks of oil
strange_artifact
	Book of Occult knowledge, {[adjective]}
	Glowing ring, {[adjective]}
	{Claws|Fur|Teeth|Skull} of a strange beast
	Staff with elaborate decorations, {[adjective]}
	Spectacles with thin plates of gemstone where the lenses should be
	Flask of liquid which shimmers multiple colors, {[adjective]}
treasure
	{1-3} precious gems, ({rough (50gp)|fine (75 gp)|excellent (100gp)})
	Crafting supplies
	[adjective.selectUnique(2)] Trinket
	{2-6}x{5-10}gp
	{Healing|Damage|Illusion} potion
	{Destruction|Divination|Enchantment|Protection} scroll
	Enchanted {weapon|armor}, ([adjective.selectUnique(2)])
books
	Children
	Cookbook
	Diary
	Eldritch lore
	Religious text
	Fiction
	Puzzles
	Ledger
	Historical Records
	Nonfiction
	Script
	Recipes ({alchemy|magic|ritual|crafting})
```
```perchance
title
	Traps
output
	[trigger] causes [effect]
trigger
	stepping on the first stone out of the door
	pulling a torch from its sconce
	sitting in a particular chair
	someone saying a question word (who/what/where etc)
	a metal grate on the floor which when opened/stepped on
	a chandelier which when lit
	a door which when opened by pushing instead of pulling 
	heat sensitive crystal which
	pulling a book from the shelf
	
effect
	players consciousness to swap
	loud blaring sounds to scream from every corner for one whole turn
	all magic to hurt the caster
	gravity to become four times weaker
	all organic material to become sentient and attack
	magic to become far more unstable and surge in unpredictable ways
	small particles to flood the room which spontaneously combust
	walls to weep a corrosive liquid
	a large gear rips through the room and pulls anything in its path up to a different room in the ceiling
```