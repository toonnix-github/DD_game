from dataclasses import dataclass
from typing import Tuple


@dataclass
class Character:
    name: str
    move: int
    hp: int
    activity_points: int
    attack_power: int
    defense_power: int
    position: Tuple[int, int]

    def move_to(self, x: int, y: int):
        self.position = (x, y)
