from dataclasses import dataclass, field
from typing import List
from .tile import Tile


@dataclass
class Dungeon:
    """The game board composed of tiles."""

    size: int = 7
    tiles: List[List[Tile]] = field(init=False)

    def __post_init__(self):
        self.tiles = [[Tile(exits=[]) for _ in range(self.size)] for _ in range(self.size)]

    def open_tile(self, x: int, y: int, exits: List[str] = None):
        tile = self.tiles[y][x]
        tile.open = True
        if exits is not None:
            tile.exits = exits

    def __repr__(self) -> str:
        rows = [' '.join(str(tile) for tile in row) for row in self.tiles]
        return '\n'.join(rows)
