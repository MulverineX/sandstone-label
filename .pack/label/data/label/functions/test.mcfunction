# Basics
tag @s[tag=testing] add testing
tag @s[tag=testing] remove testing
# Toggle
scoreboard players set cond_0 sandstone 0
execute if entity @s[tag=testing] run function label:test/if
execute if score cond_0 sandstone matches 0 run tag @s[tag=testing] add testing
# Set Basic
tag @s[tag=testing] remove testing
# Set from Condition
scoreboard players set cond_1 sandstone 0
execute if predicate label:test run function label:test/if_2
execute if score cond_1 sandstone matches 0 run tag @s[tag=testing] remove testing
# Test for Label
scoreboard players set cond_2 sandstone 0
execute if entity @s[tag=testing] run function label:test/if_3