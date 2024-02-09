## Emily's notes

# github

- commit often (every two days)
- make small commits
- make commit messages meaningful
- [markup language](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#lists)

# AWS

- ssh -i ~cs(tab) ubuntu@54.156.218.29

# CSS

- <link rel="stylesheet" href="styles.css" />
- pals before marriage

- Selectors
  syntax | affects
  ---|---
  body section | any section that descends from body
  section > p | any direct child of section
  div ~ p | any sibling of div
  div + p | any adjacent sibling of div
  .summary | any tag with summary class
  p.summary | any p with summary tag
  #physics | any tag with physics id
  p[href*="https://"] | any p with attribute
  section:hover | any section that mouse hovers over

- Declarations
  **Property** | **Value** | **Example** | **Does**
  --- | --- | --- | ---
  background-color | color | red | Fill the background color
  border | color width style | #fad solid medium | Sets the border using shorthand where any or all of the values may be provided
  border-radius | unit | 50% | The size of the border radius
  box-shadow | x-offset y-offset blu-radius color | 2px 2px 2px gray | Creates a shadow
  columns | number | 3 | Number of textual columns
  column-rule | color width style | solid thin black | Sets the border used between columns using border shorthand
  color | color | rgb(128, 0, 0) | Sets the text color
  cursor | type | grab | Sets the cursor to display when hovering over the element
  display | type | none | Defines how to display the element and its children
  filter | filter-function | grayscale(30%) | Applies a visual filter
  float | direction | right | Places the element to the left or right in the flow
  flex | | | Flex layout. Used for responsive design
  font | family size style | Arial 1.2em bold | Defines the text font using shorthand
  grid | | | Grid layout. Used for responsive design
  height | unit | .25em | Sets the height of the box
  margin | unit | 5px 5px 0 0 | Sets the margin spacing
  max-[width/height] | unit | 20% | Restricts the width or height to no more than the unit
  min-[width/height] | unit | 10vh | Restricts the width or height to no less than the unit
  opacity | number | .9 | Sets how opaque the element is
  overflow | [visible/hidden/scroll/auto] | scroll | Defines what happens when the content does not fix in its box
  position | [static/relative/absolute/sticky] | absolute | Defines how the element is positioned in the document
  padding | unit | 1em 2em | Sets the padding spacing
  left | unit | 10rem | The horizontal value of a positioned element
  text-align | [start/end/center/justify] | end | Defines how the text is aligned in the element
  top | unit | 50px | The vertical value of a positioned element
  transform | transform-function | rotate(0.5turn) | Applies a transformation to the element
  width | unit | 25vmin | Sets the width of the box
  z-index | number | 100 | Controls the positioning of the element on the z axis

  - Units
  **Unit** |	**Description**
  --- | ---
  px |	The number of pixels
  pt |	The number of points (1/72 of an inch)
  in |	The number of inches
  cm |	The number of centimeters
  % |	A percentage of the parent element
  em |	A multiplier of the width of the letter m in the     parent's font
  rem |	A multiplier of the width of the letter m in the root's   font
  ex |	A multiplier of the height of the element's font
  vw |	A percentage of the viewport's width
  vh |	A percentage of the viewport's height
  vmin |	A percentage of the viewport's smaller dimension
  vmax |	A percentage of the viewport's larger dimension

  - Color
  **Method** |	**Example** | **Description**
  ---|---|---
  keyword | red |	A set of predefined colors (e.g. white, cornflowerblue, darkslateblue)
RGB | hex |	#00FFAA22 or #0FA2	Red, green, and blue as a hexadecimal number, with an optional alpha opacity
RGB | function	| rgb(128, 255, 128, 0.5)	Red, green, and blue as a percentage or number between 0 and 255, with an optional alpha opacity percentage
HSL	| hsl(180, 30%, 90%, 0.5)	| Hue, saturation, and light, with an optional opacity percentage. Hue is the position on the 365 degree color wheel (red is 0 and 255). Saturation is how gray the color is, and light is how bright the color is.
