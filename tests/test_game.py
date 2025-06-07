import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))

from dd_game.game import Game
from dd_game.character import Character


def test_character_movement_opens_tile():
    game = Game()
    knight = Character('Knight', move=3, hp=10, activity_points=2, attack_power=5,
                       defense_power=3, position=(0, 0))
    game.add_character(knight)
    game.move_character(knight, 1, 1)
    assert game.dungeon.tiles[1][1].open is True
    assert knight.position == (1, 1)
