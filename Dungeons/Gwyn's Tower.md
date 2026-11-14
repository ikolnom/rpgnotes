[[Gwyn's Horde]]
Dungeon: This place is a watchtower, built on top of an ancient grave of Gwyn. The theme is duty, greed, often described as Glass, Silent. The environment is underground (Warm, Lifeless) and the danger is an item (heirloom).
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
```perhaps
title
	Wandering Monster
output
	[monster]
monster
	Starning (Beastly Angelic Avian)
	Sychhvine (Sentient Dark Plant)
	Achcyn (Beastly Furry Unknown)
	Bvvynyl (Beastly Calm Goblinoid)
	Flynch (Sentient Dark Humanoid)
	Allnie (Beastly Warm Fey)
```
```perchance
title
	Encounter
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
```perhaps
title
	Treasure (Mundane)
output
	[treasure]
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
treasure
	{1-3} precious gems, ({rough (50gp)|fine (75 gp)|excellent (100gp)})
	Crafting supplies
	[adjective.selectUnique(2)] Trinket
	{25-50} gp
	{Healing|Damage|Illusion|Divination} potion
	{Destruction|Divination|Enchantment|Protection} scroll
	Enchanted {weapon|armor}, ([adjective.selectUnique(2)])
	{leather|fur|steel|ceremonial} {cap|boots|greaves|pouch|helmet|breastplate}
	{1-6} alchemical herbs
	{Ritual|Fine} {Robes|Clothes}
	{Silver|Gold|Gemstone} {Ring|Pendant|Necklace}
	{1-6} torches
	{1-3} flasks of oil
	creature {talons|fur|eye}
```
```perhaps
title
	Treasure (Special)
output
	[treasure]
treasure
	Black glass staff, some sort of liquid is trapped inside. Radiates heat.
	Burial regalia, embossed with some sort of ancient standard.
	Dull, rusted shortsword. Completely covered in strange markings.
	Beautifully bound codex, chained over multiple times.
	Medium sized chest, containing smaller boxes filled with seeds.
	Bestiary, featuring creatures seen (and unseen) here.
```
All creatures in the tomb are completely silent. They make no sound even when they move around. The walls and floor here are marbled, polished so well you can still make out your reflection in them. Every sound you make reverberates through the halls, breaking the ancient silence. The further in you go, the warmer the air feels.