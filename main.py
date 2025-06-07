from src.dd_game.game import Game
from src.dd_game.character import Character


def main():
    game = Game()
    knight = Character('Knight', move=3, hp=10, activity_points=2, attack_power=5,
                       defense_power=3, position=(0, 0))
    archer = Character('Archer', move=3, hp=8, activity_points=2, attack_power=4,
                       defense_power=2, position=(0, 1))
    game.add_character(knight)
    game.add_character(archer)
    game.move_character(knight, 0, 0)
    game.move_character(archer, 0, 1)
    print(game)


if __name__ == '__main__':
    main()
