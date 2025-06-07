from dataclasses import dataclass
from typing import List

@dataclass
class Tile:
    """Represents a single dungeon tile."""

    exits: List[str]
    open: bool = False

    def __repr__(self) -> str:
        return 'O' if self.open else 'X'
