# Basics
tag @s add testing
tag @s remove testing
# Toggle
scoreboard players reset cond_0 sandstone
execute store success score cond_0 sandstone if entity @s[tag=testing] run tag @s remove testing
execute if score cond_0 sandstone matches 0.. run tag @s add testing
# Set Basic
tag @s remove testing
# Set from Condition
scoreboard players reset cond_1 sandstone
execute store success score cond_1 sandstone if predicate label:test run tag @s add testing
execute if score cond_1 sandstone matches 0.. run tag @s remove testing
# Test for Label
execute if entity @s[tag=testing] run say hi
# Pig test
tag @e[limit=1, type=minecraft:pig] add testing
execute if entity @e[tag=testing, limit=1, type=minecraft:pig] run say oink
# Pig toggle
scoreboard players reset cond_4 sandstone
execute store success score cond_4 sandstone if entity @e[tag=testing, limit=1, type=minecraft:pig] run tag @e[limit=1, type=minecraft:pig] remove testing
execute if score cond_4 sandstone matches 0.. run tag @e[limit=1, type=minecraft:pig] add testing