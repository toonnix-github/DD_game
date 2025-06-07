from dataclasses import dataclass, field
from typing import List
from .dungeon import Dungeon
from .character import Character


@dataclass
class Game:
    dungeon: Dungeon = field(default_factory=Dungeon)
    characters: List[Character] = field(default_factory=list)

    def add_character(self, character: Character):
        self.characters.append(character)

    def move_character(self, character: Character, x: int, y: int):
        if 0 <= x < self.dungeon.size and 0 <= y < self.dungeon.size:
            character.move_to(x, y)
            self.dungeon.open_tile(x, y)

    def __repr__(self) -> str:
        char_positions = {c.position: c.name[0] for c in self.characters}
        rows = []
        for y, row in enumerate(self.dungeon.tiles):
            row_repr = []
            for x, tile in enumerate(row):
                if (x, y) in char_positions:
                    row_repr.append(char_positions[(x, y)])
                else:
                    row_repr.append(str(tile))
            rows.append(' '.join(row_repr))
        return '\n'.join(rows)
