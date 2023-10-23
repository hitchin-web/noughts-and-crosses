# Noughts and crosses

## Running the app

In a terminal window, navigate to the project directory and run:
```
npm init
npm start
```

The app should then be available at [http://localhost:3000](http://localhost:3000), to view it in your browser.


## The interesting bit
It turned out that the most interesting part of this app is the way it calculated if there's a winner after each turn. For this it uses bitmasks.

Each square is a value. In decimal, these values are powers of 2...

| 1 | 2 | 4 |
| - | - | - |
| 8 | 16 | 32 |
| 64 | 128 | 256 |

But, when represented in binary, those values look like this (notice the pattern!):

| 000000001 | 000000010 | 000000100 |
| - | - | - |
| 000001000 | 000010000 | 000100000 |
| 001000000 | 010000000 | 100000000 |

This way each player's past turns can be represented by adding the values of the squares they've chosen. For example, for the following grid:

| X |   | O |
| - | - | - |
| X | O |   |
| O | X | O |

The value of nought's turns is 340 (4 + 16 + 64 + 256). In binary that is `101010100`. Can you see how each of the 1s in the binary value matches a 1 from the positions they're in?

The value of cross's turns is 137 (1 + 8 + 128). In binary that's `010001001`.


Now the cool thing with binary is that you can use [bitmask functions](https://en.wikipedia.org/wiki/Mask_(computing)). We are going to use the `AND` bitmask function.

`AND` operates on two binary numbers. For each position in the number, it takes the bit at that position and compares it to the same bit in the other number. In the case of `AND` it outputs a `1` in that position only if the bit in both values are `1`, in all other cases it outputs a `0`.

For example:
|   | 101010 |
| - | - |
| AND | 111000 |
| = | 101000 |


How is that relevant to noughts and crosses? Well, you can represent each of the 8 winning lines as bitmasks. Then, if we and that with a player's value and the result is the same value as the mask, we have a winner.

Let's look at nought's winning line in the example above. That diagonal line's value is 84 (4 + 16 + 64) or, in binary, `001010100`. Let's `AND` that with the value of nought's turns:

|   | 101010100 |
| - | - |
| AND | 001010100 |
| = | 001010100 |

The result is the same value as the mask; we have a winner!

You can find the following parts in the code:
- The winning lines, represented as decimals
- Calculating the value of each player's turns
- Using `AND` (which is `&` in JavaScript) to work out if it's a winner


## Notes

- This totally didn't need to be a React app, and certainly didn't need all the create-react-app bootstrap. But it's what I know well and we were on a timer.



